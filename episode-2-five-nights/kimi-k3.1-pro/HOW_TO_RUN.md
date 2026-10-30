# Night Shift at Pumpkin Pete's

## Start the game

From this folder, run:

```bash
python -m http.server 8000
```

Open **http://localhost:8000** in a modern browser and select **Begin Night**. No installation, build step, API key, or internet connection is needed. All art, voice, music, and sound effects are local.

## Your shift

Survive from **12 AM to 6 AM**. Night 01 lasts 4 minutes 30 seconds; completing it unlocks the faster, five-minute **Overtime** mode. Survive Overtime to unlock **Custom Shift**, with independent 0–10 AI settings for all five mascots. Setting a mascot to 0 removes it from the building. Progress, settings, best power, and best Custom AI total are saved in the browser.

Power is shared by the office, ten-camera tablet, security doors, hall lights, and vent lure. At 0%, the doors open, the office goes dark, and something comes to find you.

For Pete, Vesper, and Patch, close an occupied door until you hear the visitor leave. **Shroud is the exception:** doors do not stop it. Hold the correct hall light on its cold spot until it retreats. **Gloam ignores both:** select CAM 10 and play the lure when it enters the vents or reaches the office ceiling.

| Control | Action |
|---|---|
| `Space` | Raise/lower the camera tablet |
| `1`–`9`, `0`, or the map | Switch cameras (`0` selects CAM 10) |
| `F` or **Play Lure** | Play the selected camera's lure; costs 0.8% power |
| `A` / `D` | Toggle left/right security door |
| `Q` / `E` | Toggle left/right hall light |
| `M` | Mute/unmute all audio |
| `Esc` | Pause/resume |
| `R` on an ending screen | Instantly restart |

Mouse and touch controls are also available. Headphones are recommended: footsteps, whispers, wingbeats, and mechanical sounds are positioned to help locate threats.

## Know the mascots

- **Pumpkin Pete:** methodically crosses the dining room, party room, and west hall. Keeping his current camera on screen suspends his movement.
- **Vesper:** advances only while her current camera is unwatched. Follow her through prizes, the kitchen, and east hall.
- **Patch:** his movement timer runs only while your tablet is raised. Use cameras in short, deliberate bursts.
- **Shroud:** never appears on CCTV and approaches only in darkness. A whisper and cold-spot warning reveal which door it is haunting. Hold that hall light on it for 1½ seconds; a closed door alone will not save you.
- **Gloam:** travels from the arcade through CAM 10's ventilation duct to the office ceiling. Wingbeats announce its arrival. A lure played on its current feed drives it back to the arcade; a wrong feed wastes power and makes it more restless. The lure needs six seconds to recharge.

All five become more aggressive toward morning. Camera motion pings last only a few seconds. The opening voicemail and later warnings explain the rules during Night 01.

## Replay and ratings

The ending reports camera checks, successful door saves, light saves, lure saves, and remaining power. Winning awards a C–S shift rating based on power conservation. Overtime has longer duration, faster enemies, shorter attack windows, and no voicemail guidance. Custom Shift records your best winning total AI level.
