async function mirrorScene() {
  await act(async () => {
    loop('music_box', .4, {fade: 2}); unloop('clock', 1.5);
    comp('mirror', true); place($('mglass'), MBOX);
    bg('hall_open', {fade: 0}); play('sting_small', {vol: .5});
    msg('Это просто зеркало.', 2500); await wait(1500); snapshot(); await wait(2500);
    $('mgran').style.opacity = 1; await wait(2200);
    play('g_see', {vol: .9, pan: .15, lp: 2800}); sub('— Вот теперь я тебя вижу.', true);
    await wait(3200); subOff(); snapshot();
    await wait(800); $('mgran').style.opacity = 0; await wait(900);
    black(1, .15); unloop('music_box', .2); await wait(1600);
    comp('mirror', false); bg('hall', {fade: 0}); S.mirrorDone = true; S.room = 'hall'; S.phase = 5;
    loop('drone', .3, {fade: 2}); black(0, .6); await wait(1400);
    play('knock_slow', {vol: 1.1, pan: -.55, dur: 6}); await wait(3200);
    await say('g_door1', ['— Костенька? Это бабушка. Открой, внучек.'], {vol: 1, lp: 1500, pan: -.5});
    obj('Уйти. Не открывать.');
  });
}

async function frontDoor() {
  if (!S.docs) { await act(async () => { msg('Тётя Люда просила взять документы. Они в шкатулке в гостиной.'); await wait(3000); }); return; }
  if (S.phase >= 6) { await act(async () => { msg('Не открывать. Только не открывать.'); await wait(2200); }); return; }
  await act(async () => {
    black(1, .3); await wait(400);
    FL.mode = 'flat'; FL.flat = .05; unloop('drone', 1);
    if (!S.peep) {
      S.peep = 1;
      bg('peephole_gran', {fade: 0, fit: 'contain'}); black(0, .4); await wait(800);
      msg('Глазок.', 1800); zoom(1.12, 9); await wait(2600);
      await say('g_door2', ['— Костя, ну открой... Холодно мне тут.', ' Холодно.'], {vol: .95, lp: 1500});
      await wait(1200);
      play('knock_fast', {vol: 1.25, dur: 5}); shake(900); flicker(800, 4);
      await say('g_door3', ['— Я знаю, что ты дома.', ' Открой бабушке.', ' Открой!'], {vol: 1.1, lp: 1700});
      black(1, .2); await wait(500); bg('hall', {fade: 0}); FL.mode = 'beam'; FL.flick = .9; loop('drone', .35, {fade: 1});
      black(0, .5); await wait(2500);
      msg('Тихо. Она перестала стучать.', 3000); await wait(3000);
    } else {
      bg('peephole_empty', {fade: 0, fit: 'contain'}); black(0, .4); await wait(900);
      zoom(1.08, 6); await wait(3200);
      msg('Никого.', 1800); await wait(2300);
      play('steps_slow', {vol: .9, pan: .55, dur: 5}); await wait(2600);
      play('g_call', {vol: 1.1, pan: .85}); sub('— Костя...', true); await wait(1700); subOff();
      black(1, .15); await wait(400);
      bg('hall', {fade: 0}); FL.mode = 'beam'; FL.r = .3; FL.d = .97; FL.flick = 1.6; loop('tension', .45, {fade: 1});
      S.phase = 6; obj('Спрятаться');
      black(0, .4); await wait(700);
      msg('Она уже в квартире.', 3000); await wait(1500);
    }
  });
}

async function hideInWardrobe() {
  S.busy = true; setHS([]); S.phase = 7;
  play('wardrobe', {vol: 1, dur: 2}); black(1, .35); await wait(450);
  bg('wardrobe_view', {fade: 0}); FL.mode = 'flat'; FL.flat = .08; FL.flick = 0;
  unloop('tension', 2); black(0, .4); await wait(1200);
  msg('Не издавай ни звука.', 3500); await wait(2800);
  play('steps_slow', {vol: .8, dur: 7, fade: 1}); await wait(2500);
  bg('wardrobe_gran', {fade: 2.5}); await wait(3000);
  play('g_quiet', {vol: .85}); sub('— Тшшш...', true); await wait(1600); subOff();
  // listen: if the player makes noise, she hears
  let heard = false;
  if (S.an) $('meter').style.display = 'block';
  for (let i = 0; i < 70; i++) {
    const lv = micLevel(); if (S.an) $('meter').querySelector('i').style.width = Math.min(100, lv * 400) + '%';
    if (lv > .22) { heard = true; break; }
    await wait(100);
  }
  $('meter').style.display = 'none';
  if (!heard) {
    bg('wardrobe_view', {fade: 3}); play('steps_slow', {vol: .4, pan: -.4, dur: 4, fade: .5}); await wait(4500);
    msg('Ушла?..', 2500); await wait(4200);
  }
  play('g_found', {vol: 1.3, pan: .9}); sub('— Вот ты где.', true); await wait(heard ? 700 : 1100); subOff();
  bg('wardrobe_face', {fade: 0}); play('sting_big', {vol: 1}); shake(700);
  await wait(2300);
  black(1, .1); hush(.1); await wait(300);
  ending();
}

async function ending() {
  if (S.endStarted) return; S.endStarted = true;
  S.busy = true; setHS([]); if (!S.photo) snapshot();
  $('sub').style.opacity = $('msg').style.opacity = $('lbl').style.opacity = $('obj').style.opacity = 0;
  black(1, .1); await wait(3500);
  await center('<span style="font-size:.7em;letter-spacing:.4em;color:#8a8275">три дня спустя</span>', 3000);
  comp('mirror', false); $('L0').style.opacity = $('L1').style.opacity = 0;
  comp('endc', true); place($('eglass'), EBOX); FL.mode = 'flat'; FL.flat = .1;
  if (S.photo) Object.assign($('eglass').style, {backgroundImage: 'url(' + S.photo + ')', backgroundSize: 'cover', backgroundPosition: 'center 30%'});
  else { const c = document.createElement('canvas'); silhouette(c, 240, 400); Object.assign($('eglass').style, {backgroundImage: 'url(' + c.toDataURL() + ')', backgroundSize: 'cover'}); }
  loop('clock', .3, {fade: 2}); black(0, 3); await wait(3500);
  await say('v_aunt_end', [
    '— Костя? Костя, ты где? Ты третий день трубку не берёшь...',
    ' Я приехала к бабушке на квартиру.',
    ' Тут все зеркала открыты...',
    ' Костя... а почему на столе стоит твоя фотография?'
  ], {vol: 1, lp: 3200, hp: 350, fade: .3});
  unloop('clock', .1); await wait(3200);
  play('g_call', {vol: 1.2, pan: -.85}); sub('— Костя...', true); await wait(1300); subOff();
  comp('endc', false); bg('jumpscare_face', {fade: 0}); FL.mode = 'flat'; FL.flat = 0;
  play('sting_big', {vol: 1}); shake(800); await wait(1300);
  black(1, .05); hush(.2); await wait(2500);
  document.title = 'Она ещё дома';
  $('center').innerHTML = '<b>СОРОК ДНЕЙ</b><br><span style="font-size:.5em;letter-spacing:.3em;color:#6d665b">конец</span>';
  $('center').style.opacity = 1; loop('music_box', .3, {fade: 4});
}

