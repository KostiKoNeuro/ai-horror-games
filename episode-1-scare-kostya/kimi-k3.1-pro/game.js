(() => {
'use strict';
const $ = id => document.getElementById(id);
const els = {scene:$('scene'), image:$('sceneImage'), spots:$('hotspots'), hud:$('hud'), objective:$('objective'), prompt:$('prompt'), subtitle:$('subtitle'), camera:$('cameraUi'), cams:$('camControls'), camLabel:$('camLabel'), camTime:$('camTime'), fade:$('fade'), toast:$('toast'), title:$('titleScreen'), pause:$('pauseScreen'), end:$('endScreen'), impact:$('impact'), hold:$('holdUi'), holdFill:$('holdFill'), video:$('localVideo'), shadow:$('localShadow'), evidence:$('evidence'), evidenceImage:$('evidenceImage'), clock:$('clock')};
const IMG = 'assets/images/';
const AUD = 'assets/audio/';
const images = {office:'office.png', dark:'office_dark.png', hallway:'hallway.png', figure:'hallway_figure.png', elevator:'elevator.png', elevatorFigure:'elevator_figure.png', stairwell:'stairwell.png', stairwellFigure:'stairwell_figure.png', door:'door.png', entity:'entity.png', fusebox:'fusebox.png', fuseboxOn:'fusebox_on.png', underdesk:'underdesk.png', underdeskLegs:'underdesk_legs.png', morning:'office_morning.png', shadow:'shadow.png'};
Object.values(images).forEach(f => {const im=new Image(); im.src=IMG+f;});
const shadowImage=new Image();shadowImage.src=IMG+images.shadow;

const AudioEngine = {
  ctx:null, master:null, limiter:null, active:[], muted:false, ambience:null, music:null, static:null, morning:null,
  init(){if(this.ctx){this.ctx.resume();return;} const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;this.ctx=new AC();this.master=this.ctx.createGain();this.master.gain.value=this.muted?0:.8;this.limiter=this.ctx.createDynamicsCompressor();this.limiter.threshold.value=-10;this.limiter.knee.value=12;this.limiter.ratio.value=4;this.limiter.attack.value=.003;this.limiter.release.value=.25;this.master.connect(this.limiter);this.limiter.connect(this.ctx.destination);},
  play(name,{volume=.7,loop=false,pan=0}={}){
    if(!this.ctx)return null;
    const a=new Audio(AUD+name+'.mp3');a.loop=loop;a.preload='auto';
    const src=this.ctx.createMediaElementSource(a), gain=this.ctx.createGain(), panner=this.ctx.createStereoPanner();
    gain.gain.value=volume;panner.pan.value=pan;src.connect(gain);gain.connect(panner);panner.connect(this.master);
    const item={a,gain,src,panner};this.active.push(item);a.play().catch(()=>{});
    a.onended=()=>{this.active=this.active.filter(x=>x!==item);try{src.disconnect();gain.disconnect();panner.disconnect();}catch(e){}};
    return item;
  },
  startBeds(){if(!this.ambience)this.ambience=this.play('ambience',{volume:.5,loop:true});},
  tension(){if(!this.music)this.music=this.play('music',{volume:.16,loop:true});if(this.ambience)this.ambience.gain.gain.setTargetAtTime(.7,this.ctx.currentTime,1);},
  camera(on){if(on&&!this.static)this.static=this.play('static',{volume:.075,loop:true});if(!on&&this.static){this.static.a.pause();this.static.a.currentTime=0;this.active=this.active.filter(x=>x!==this.static);this.static=null;}},
  duck(on){if(this.ambience)this.ambience.gain.gain.setTargetAtTime(on?.16:.5,this.ctx.currentTime,.3);},
  pause(on){if(!this.ctx)return;if(on)this.ctx.suspend();else this.ctx.resume();},
  stop(){this.active.forEach(x=>{x.a.pause();x.a.currentTime=0;});this.active=[];this.ambience=null;this.music=null;this.static=null;this.morning=null;},
  mute(){this.muted=!this.muted;if(this.master)this.master.gain.setTargetAtTime(this.muted?0:.8,this.ctx.currentTime,.04);$('muteBtn').textContent=this.muted?'ЗВУК: ВЫКЛ':'ЗВУК: ВКЛ';}
};

let state, timers=[], last=performance.now(), stream=null, cameraRequested=false, holdKeys=new Set(), toastTimer=0;
function fresh(){return {mode:'title',phase:'phone',paused:false,time:0,minutes:193,cam:0,visited:new Set(),reviewToken:0,anomaly:false,reported:false,log:0,breaker:0,evidence:null,holding:false,hold:0,ended:false,doorSeen:false};}
state=fresh();
function after(sec,fn){timers.push({at:state.time+sec,fn});}
function clearTimers(){timers=[];}
function toast(text,sec=2.7){els.toast.textContent=text;els.toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>els.toast.classList.remove('show'),sec*1000);}
function objective(text){els.objective.textContent=text||'';}
function prompt(text){els.prompt.textContent=text||'';}
function subtitle(text){els.subtitle.textContent=text||'';}
function scene(name,dark=false){AudioEngine.camera(false);document.querySelector('.breaker-panel')?.remove();$('game').classList.remove('camera-mode');els.camera.classList.add('hidden');els.video.classList.add('hidden');els.shadow.classList.add('hidden');els.shadow.classList.remove('manifest');els.spots.innerHTML='';els.scene.className='scene '+name+' '+(dark?'dark ':'');els.image.style.filter='';els.image.style.backgroundImage=`url("${IMG+images[name]}")`;els.image.classList.add('breathe');setTimeout(()=>els.image.classList.remove('breathe'),50);}
function spot(label,x,y,w,h,fn,attention=false){const b=document.createElement('button');b.className='hotspot'+(attention?' attention':'');b.dataset.label=label;b.setAttribute('aria-label',label);Object.assign(b.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});b.onclick=fn;els.spots.appendChild(b);return b;}
function setClock(minutes){state.minutes=minutes;const h=String(Math.floor(minutes/60)%24).padStart(2,'0'),m=String(minutes%60).padStart(2,'0');els.clock.textContent=`${h}:${m}`;}
function voice(name,lines){AudioEngine.duck(true);AudioEngine.play(name,{volume:.95,pan:-.12});let t=0;lines.forEach(([line,d])=>{after(t,()=>subtitle(line));t+=d;});after(t,()=>{subtitle('');AudioEngine.duck(false);});return t;}
function phoneRing(){
  if(!AudioEngine.ctx)return;const c=AudioEngine.ctx,t=c.currentTime,g=c.createGain(),p=c.createStereoPanner();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.055,t+.03);g.gain.setValueAtTime(.055,t+.65);g.gain.linearRampToValueAtTime(0,t+.72);p.pan.value=-.72;g.connect(p);p.connect(AudioEngine.master);
  [1320,1670].forEach(f=>{const o=c.createOscillator();o.type='sine';o.frequency.value=f;o.connect(g);o.start(t);o.stop(t+.75);});setTimeout(()=>{g.disconnect();p.disconnect();},900);
}
function start(){
  AudioEngine.init();AudioEngine.stop();clearTimers();document.querySelector('.logbook-panel')?.remove();state=fresh();state.mode='office';state.phase='phone';state.time=0;cameraRequested=false;setClock(193);
  els.title.classList.add('hidden');els.end.classList.add('hidden');els.pause.classList.add('hidden');els.hud.classList.remove('hidden');els.hold.classList.add('hidden');els.impact.classList.add('hidden');els.evidence.classList.add('hidden');els.evidenceImage.removeAttribute('src');document.querySelector('.utility').classList.remove('hidden');
  if(!document.fullscreenElement)$('game').requestFullscreen?.().catch(()=>{});
  scene('office');AudioEngine.startBeds();objective('Ответьте на телефон.');prompt('Нажмите на объект, чтобы взаимодействовать');
  officeSpots();const ring=()=>{if(state.phase==='phone'&&!state.paused){phoneRing();after(3.4,ring);}};after(1,ring);
  after(2,()=>prompt(''));
}
function officeSpots(){
  els.spots.innerHTML='';
  if(state.phase==='phone')spot('ТЕЛЕФОН',5,54,26,36,answerPhone,true);
  if(['cams','return','second','third'].includes(state.phase))spot('МОНИТОРЫ',28,20,43,46,openCams,true);
  if(state.phase==='log')spot('ЖУРНАЛ ДЕЖУРСТВА',62,60,29,33,openLog,true);
  if(state.phase==='fuse')spot('ЩИТОК',61,25,12,39,openFuse,true);
  if(state.phase==='door')spot('ДВЕРЬ',73,17,25,59,inspectDoor,true);
}
function answerPhone(){
  if(state.phase!=='phone')return;state.phase='phoneTalk';els.spots.innerHTML='';objective('Слушайте диспетчера.');prompt('');
  const d=voice('voice1',[['Ты новый? Слушай внимательно.',3.3],['До шести утра проверяй камеры.',3.6],['Если увидишь человека — не подходи к нему.',4.4],['И главное… не дай ему понять, что ты его видишь.',5.2]]);
  after(d+.5,()=>{state.phase='cams';setClock(197);objective('Проверьте камеры 01–03 на мониторе.');officeSpots();toast('НОВАЯ ЗАДАЧА');});
}
async function enableLocal(){
  if(stream||cameraRequested||!navigator.mediaDevices?.getUserMedia)return;cameraRequested=true;
  try{stream=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720},audio:false});els.video.srcObject=stream;await els.video.play().catch(()=>{});if(state.mode==='camera')renderCam();}
  catch(e){stream=null;}
}
const camNames=['КОРИДОР · ЭТАЖ 3','ЛИФТ · СЕКТОР B','ЛЕСТНИЦА · СЕВЕР','ЛОКАЛЬНАЯ · ВАША КАМЕРА'];
function cameraObjective(){if(state.phase==='second')return'Источник движения: камера 02.';if(state.phase==='third')return'Источник движения: камера 03.';return state.anomaly?'Источник движения: камера 01.':'Дождитесь проверки записей на камерах 01–03.';}
function openCams(){
  if(!['cams','return','second','third'].includes(state.phase))return;state.mode='camera';$('game').classList.add('camera-mode');els.spots.innerHTML='';objective(cameraObjective());prompt('');els.camera.classList.remove('hidden');AudioEngine.camera(true);enableLocal();renderCam();reviewCam();
}
function renderCam(){
  els.camera.classList.remove('analyzing');els.cams.innerHTML='';els.video.classList.add('hidden');els.shadow.classList.add('hidden');els.shadow.classList.remove('manifest');els.image.style.backgroundImage='';
  for(let i=0;i<4;i++){const b=document.createElement('button');b.className='cam-btn'+(state.cam===i?' active':'');b.textContent='CAM 0'+(i+1);b.onclick=()=>selectCam(i);els.cams.appendChild(b);}
  const back=document.createElement('button');back.className='cam-btn return';back.textContent=state.reported?'В ОФИС →':'ESC · В ОФИС';back.onclick=closeCams;els.cams.appendChild(back);
  const n=state.cam;els.camLabel.textContent=`КАМЕРА 0${n+1} · ${camNames[n]}`;
  if(n===3&&stream){els.video.classList.remove('hidden');Object.assign(els.video.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(1) contrast(1.3) brightness(.55)',zIndex:'2'});els.image.style.background='#030605';if(['second','third','log','door'].includes(state.phase)){els.shadow.classList.remove('hidden');requestAnimationFrame(()=>els.shadow.classList.add('manifest'));}}
  else {let key='dark';if(n===0)key=state.phase==='cams'&&state.anomaly?'figure':'hallway';else if(n===1)key=state.phase==='second'?'elevatorFigure':'elevator';else if(n===2)key=state.phase==='third'?'stairwellFigure':'stairwell';els.image.style.backgroundImage=`url("${IMG+images[key]}")`;els.image.style.filter='grayscale(.75) sepia(.16) contrast(1.3) brightness(.58)';}
  els.scene.className='scene camera';
  document.querySelector('.cam-anomaly')?.remove();
  const eventHere=!state.reported&&((state.phase==='cams'&&n===0&&state.anomaly)||(state.phase==='second'&&n===1)||(state.phase==='third'&&n===2));
  if(eventHere){const b=document.createElement('button');b.className='cam-anomaly';b.setAttribute('aria-label','Зафиксировать человека');b.onclick=state.phase==='second'?reportSecond:state.phase==='third'?reportThird:reportAnomaly;if(state.phase==='second')Object.assign(b.style,{left:'48%',top:'18%',width:'25%',height:'65%'});if(state.phase==='third')Object.assign(b.style,{left:'16%',top:'37%',width:'22%',height:'45%'});els.camera.appendChild(b);prompt('Если заметили отклонение, нажмите на него.');}
  else if(n===3&&!stream)prompt('ЛОКАЛЬНЫЙ СИГНАЛ ОТСУТСТВУЕТ');
  else prompt('');
}
function reviewCam(){
  const n=state.cam,token=++state.reviewToken;if(n===3||state.anomaly||state.reported)return;
  if(state.visited.has(n)){prompt('ЗАПИСЬ ПРОВЕРЕНА · ОТКЛОНЕНИЙ НЕТ');return;}
  els.camera.classList.add('analyzing');prompt('АНАЛИЗ ЗАПИСИ… НЕ ПЕРЕКЛЮЧАЙТЕ КАМЕРУ');
  after(5,()=>{
    if(token!==state.reviewToken||state.mode!=='camera'||state.cam!==n)return;state.visited.add(n);els.camera.classList.remove('analyzing');prompt('ОТКЛОНЕНИЙ НЕТ');
    if([0,1,2].every(x=>state.visited.has(x))&&!state.anomaly){state.anomaly=true;after(1.1,()=>{if(state.mode==='camera'){toast('ДВИЖЕНИЕ · КАМЕРА 01',4);AudioEngine.play('knock',{volume:.18,pan:.5});if(state.cam===0)renderCam();objective('Источник движения: камера 01.');}});}
    else{toast(`CAM 0${n+1} · ПРОВЕРЕНО`);objective(`Проверено записей: ${state.visited.size} / 3.`);}
  });
}
function selectCam(n){
  if(state.reported)return;state.cam=n;renderCam();reviewCam();
}
function closeCams(){
  if(state.mode!=='camera')return;state.reviewToken++;state.mode='office';els.camera.classList.add('hidden');els.video.classList.add('hidden');els.image.style.filter='';scene(['log','second','third'].includes(state.phase)?'dark':'office');officeSpots();
  if(!state.reported)objective(cameraObjective());
}
function reportAnomaly(){
  if(state.reported||state.phase!=='cams')return;state.reviewToken++;state.reported=true;state.phase='return';state.visited.add(0);document.querySelector('.cam-anomaly')?.remove();prompt('');toast('ОТКЛОНЕНИЕ ЗАФИКСИРОВАНО');AudioEngine.tension();
  const d=voice('voice2',[['Он сменил камеру.',2.6],['Не смотри на него так долго.',3.2],['Вернись в офис. Сейчас же.',3.4]]);
  after(d+.5,beginSecondEvent);
}
function beginSecondEvent(){
  if(state.mode==='camera')closeCams();state.phase='second';state.reported=false;state.anomaly=true;state.cam=0;setClock(209);scene('dark',true);AudioEngine.play('elevator',{volume:.24,pan:-.35});objective(cameraObjective());officeSpots();toast('ДВИЖЕНИЕ · КАМЕРА 02');
}
function reportSecond(){
  if(state.reported||state.phase!=='second')return;state.reviewToken++;state.reported=true;document.querySelector('.cam-anomaly')?.remove();prompt('');toast('КАМЕРА 02 · ЗАПИСЬ СОХРАНЕНА');
  const d=voice('voice5',[['Он в лифте. Он поднимается.',3.8],['Проверь лестницу. Быстрее.',4.2]]);after(d+.5,beginThirdEvent);
}
function beginThirdEvent(){
  if(state.mode==='camera')closeCams();state.phase='third';state.reported=false;state.anomaly=true;state.cam=0;setClock(217);scene('dark',true);AudioEngine.play('footsteps',{volume:.23,pan:.55});objective(cameraObjective());officeSpots();toast('ДВИЖЕНИЕ · КАМЕРА 03');
}
function reportThird(){
  if(state.reported||state.phase!=='third')return;state.reviewToken++;state.reported=true;document.querySelector('.cam-anomaly')?.remove();prompt('');toast('КАМЕРА 03 · ЗАПИСЬ СОХРАНЕНА');
  const d=voice('voice6',[['Он на лестнице. Он уже здесь.',4.2],['Запиши всё в журнал.',3.6]]);after(d+.5,()=>{if(state.mode==='camera')closeCams();state.phase='log';setClock(221);scene('dark',true);objective('Запишите происшествие в журнал.');officeSpots();toast('03:41 · СБОЙ ЭЛЕКТРОПИТАНИЯ');});
}
function openLog(){
  if(state.phase!=='log')return;state.phase='logging';els.spots.innerHTML='';objective('Подтвердите три записи.');AudioEngine.play('paper',{volume:.42});
  const panel=document.createElement('div');panel.className='logbook-panel';panel.innerHTML=`<div class="log-head">ЖУРНАЛ ДЕЖУРСТВА <span>14 / 10 / 1998</span></div><p>ОБЪЕКТ 14 · НОЧНАЯ СМЕНА</p>${['03:17 — проверка камер','03:26 — посторонний объект','03:41 — сбой электропитания'].map((x,i)=>`<button data-i="${i}"><b>0${i+1}</b>${x}<i>ОТМЕТИТЬ</i></button>`).join('')}<small>Подпись дежурного: __________________</small>`;
  $('game').appendChild(panel);
  panel.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.classList.contains('done'))return;b.classList.add('done');b.querySelector('i').textContent='ЗАПИСАНО';state.log++;AudioEngine.play('paper',{volume:.32,pan:.1});if(state.log===3)after(1,beginBlackout);});
}
function beginBlackout(){
  document.querySelector('.logbook-panel')?.remove();state.phase='fuseIntro';els.spots.innerHTML='';setClock(224);scene('dark',true);objective('Восстановите питание. Щиток рядом с дверью.');prompt('');AudioEngine.play('sparks',{volume:.2,pan:.65});
  const d=voice('voice7',[['Щиток рядом с дверью.',3],['Порядок переключателей на крышке. Не выходи.',5.8]]);
  after(d+.2,()=>{if(state.phase!=='fuseIntro')return;state.phase='fuse';prompt('Порядок переключателей указан на крышке.');officeSpots();});
}
function openFuse(){
  if(state.phase!=='fuse')return;state.phase='fusing';state.breaker=0;scene('fusebox');objective('Включите контуры в порядке C → A → D → B.');prompt('');
  const panel=document.createElement('div');panel.className='breaker-panel';panel.innerHTML='<div class="breaker-head"><span>АВАРИЙНОЕ ПИТАНИЕ · ЩИТ 14-B</span><strong>C → A → D → B</strong></div><div class="breaker-switches">'+['A','B','C','D'].map(x=>`<button class="breaker-switch" data-breaker="${x}" aria-label="Контур ${x}"><b>${x}</b><span>КОНТУР</span></button>`).join('')+'</div><div class="breaker-status">ОЖИДАНИЕ · 0 / 4</div>';
  $('game').appendChild(panel);
  const buttons=[...panel.querySelectorAll('.breaker-switch')],status=panel.querySelector('.breaker-status'),order=['C','A','D','B'];
  buttons.forEach(b=>b.onclick=()=>{
    if(state.phase!=='fusing')return;
    if(b.dataset.breaker===order[state.breaker]){
      b.classList.add('on');b.disabled=true;state.breaker++;AudioEngine.play('switch',{volume:.55,pan:(buttons.indexOf(b)-1.5)*.25});status.textContent=`КОНТУР ЗАМКНУТ · ${state.breaker} / 4`;
      if(state.breaker===4)completeFuse(panel);
    }else{
      state.phase='fuseFault';state.breaker=0;buttons.forEach(x=>{x.classList.remove('on');x.disabled=true;});panel.classList.add('fault');status.textContent='ОШИБКА ПОСЛЕДОВАТЕЛЬНОСТИ · СБРОС';AudioEngine.play('sparks',{volume:.42});
      after(.65,()=>{if(!panel.isConnected)return;state.phase='fusing';panel.classList.remove('fault');buttons.forEach(x=>x.disabled=false);status.textContent='ОЖИДАНИЕ · 0 / 4';});
    }
  });
}
function completeFuse(panel){
  state.phase='fuseDone';panel.querySelectorAll('button').forEach(b=>b.disabled=true);panel.querySelector('.breaker-status').textContent='ПИТАНИЕ ВОССТАНОВЛЕНО';objective('');AudioEngine.play('elevator',{volume:.38});
  after(.45,()=>{if(state.phase==='fuseDone')scene('fuseboxOn');});after(2.4,()=>{if(state.phase==='fuseDone')lightsOut();});
}
function lightsOut(){
  document.querySelector('.logbook-panel')?.remove();state.phase='door';setClock(227);scene('dark',true);AudioEngine.duck(false);objective('');AudioEngine.play('knock',{volume:.85,pan:.75});
  const d=voice('voice3',[['Он уже не на камерах.',3.2],['Не оборачивайся.',3.2]]);after(d+.5,()=>{objective('Проверьте дверь.');officeSpots();});
}
function inspectDoor(){
  if(state.phase!=='door'||state.doorSeen)return;state.doorSeen=true;state.phase='doorSeen';els.spots.innerHTML='';objective('');scene('door');AudioEngine.play('breath',{volume:.6,pan:.5});prompt('Он стоит неподвижно.');after(3.6,()=>{prompt('Не открывай.');});after(6.2,()=>{els.fade.classList.add('on');AudioEngine.play('knock',{volume:1,pan:.8});});after(7.1,beginHide);
}
function beginHide(){
  state.phase='hide';setClock(238);els.fade.classList.remove('on');scene('underdesk');els.image.style.filter='brightness(.58) contrast(1.3)';objective('');prompt('');els.hold.classList.remove('hidden');state.hold=0;state.holding=false;AudioEngine.play('breath',{volume:.72,pan:0});
  after(3.4,()=>{if(state.phase==='hide'){scene('underdeskLegs');els.image.style.filter='brightness(.55) contrast(1.35)';AudioEngine.play('footsteps',{volume:.48,pan:.15});voice('voice4',[['Костя… я вижу тебя.',4]]);}});
}
function captureEvidence(){
  if(!stream||els.video.readyState<2)return;
  try{
    const c=document.createElement('canvas');c.width=640;c.height=360;const x=c.getContext('2d'),vw=els.video.videoWidth,vh=els.video.videoHeight;
    const scale=Math.max(c.width/vw,c.height/vh),sw=c.width/scale,sh=c.height/scale;x.drawImage(els.video,(vw-sw)/2,(vh-sh)/2,sw,sh,0,0,c.width,c.height);
    if(shadowImage.complete&&shadowImage.naturalWidth){x.globalAlpha=.42;x.drawImage(shadowImage,150,0,640,360);x.globalAlpha=1;}
    state.evidence=c.toDataURL('image/jpeg',.82);
  }catch(e){state.evidence=null;}
}
function finishHide(){
  if(state.ended)return;captureEvidence();state.ended=true;state.phase='final';state.holding=false;els.hold.classList.add('hidden');els.hud.classList.add('hidden');els.spots.innerHTML='';document.querySelector('.utility').classList.add('hidden');
  AudioEngine.play('sting',{volume:.95});els.impact.classList.remove('hidden');document.querySelector('.impact-image').style.backgroundImage=`url("${IMG+images.entity}")`;
  after(2.4,()=>{els.fade.classList.add('on');});after(4.2,showEnding);
}
function showEnding(){
  els.impact.classList.add('hidden');els.fade.classList.remove('on');els.end.classList.remove('hidden');setClock(360);AudioEngine.duck(false);if(AudioEngine.music)AudioEngine.music.gain.gain.setTargetAtTime(0,AudioEngine.ctx.currentTime,1.5);if(AudioEngine.ambience)AudioEngine.ambience.gain.gain.setTargetAtTime(.12,AudioEngine.ctx.currentTime,1.5);
  if(state.evidence){els.evidenceImage.src=state.evidence;els.evidence.classList.remove('hidden');}
  if(!AudioEngine.morning)AudioEngine.morning=AudioEngine.play('morning',{volume:.22,loop:true});
  if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
}
function togglePause(force){
  if(state.mode==='title'||state.ended)return;state.paused=force===undefined?!state.paused:force;els.pause.classList.toggle('hidden',!state.paused);AudioEngine.pause(state.paused);
}
function setHolding(on){if(state.phase!=='hide'||state.paused)return;state.holding=on;els.hold.classList.toggle('active',on);}

$('startBtn').onclick=start;$('restartBtn').onclick=start;$('restartPauseBtn').onclick=start;$('resumeBtn').onclick=()=>togglePause(false);
$('muteBtn').onclick=()=>AudioEngine.mute();$('fullBtn').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else $('game').requestFullscreen?.().catch(()=>{});};
document.addEventListener('keydown',e=>{
  if(e.code==='KeyM'){AudioEngine.mute();return;}if(e.code==='KeyF'){$('fullBtn').click();return;}if(e.code==='Escape'){if(state.mode==='camera')closeCams();else togglePause();return;}
  if(state.paused)return;if(state.mode==='camera'&&['Digit1','Digit2','Digit3','Digit4'].includes(e.code))selectCam(Number(e.code.slice(-1))-1);
  if(e.code==='Space'){e.preventDefault();holdKeys.add('key');setHolding(true);}
});
document.addEventListener('keyup',e=>{if(e.code==='Space'){holdKeys.delete('key');if(!holdKeys.size)setHolding(false);}});
$('game').addEventListener('mousedown',e=>{if(state.phase==='hide'&&!e.target.closest('button')){holdKeys.add('mouse');setHolding(true);}});
document.addEventListener('mouseup',()=>{holdKeys.delete('mouse');if(!holdKeys.size)setHolding(false);});
window.addEventListener('blur',()=>{holdKeys.clear();setHolding(false);});
$('game').addEventListener('pointermove',e=>{if(state.mode!=='office'||state.paused)return;const x=(e.clientX/innerWidth-.5)*-10,y=(e.clientY/innerHeight-.5)*-7;els.image.style.backgroundPosition=`calc(50% + ${x}px) calc(50% + ${y}px)`;});

function tick(now){
  const dt=Math.min((now-last)/1000,.1);last=now;
  if(!state.paused&&state.mode!=='title'){
    state.time+=dt;const due=timers.filter(t=>t.at<=state.time);timers=timers.filter(t=>t.at>state.time);due.forEach(t=>t.fn());
    const sec=Math.floor(state.time)%60;els.camTime.textContent=`${els.clock.textContent}:${String(sec).padStart(2,'0')}`;
    if(state.phase==='hide'){
      state.hold=Math.max(0,Math.min(12,state.hold+(state.holding?dt:-dt*.35)));els.holdFill.style.width=(state.hold/12*100)+'%';
      els.image.style.filter=`brightness(${Math.max(.25,.58-state.hold*.027)}) contrast(1.35)`;
      if(state.hold>=12)finishHide();
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

const canvas=$('grain'),ctx=canvas.getContext('2d',{alpha:true});let lastGrain=0;
function grain(now){if(now-lastGrain>120){lastGrain=now;const w=Math.min(innerWidth,480),h=Math.min(innerHeight,270);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const d=ctx.createImageData(w,h);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=100;}ctx.putImageData(d,0,0);}requestAnimationFrame(grain);}requestAnimationFrame(grain);
})();
