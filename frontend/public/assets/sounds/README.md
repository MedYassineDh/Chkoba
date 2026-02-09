# Sound Effects

Add your custom sound MP3 files here.

## Sound Files Needed

- `shuffle.mp3` - Card shuffling (0.5-2 seconds)
- `card-place.mp3` - Card placement
- `card-capture.mp3` - Card capture/success
- `chkobba.mp3` - Chkobba sweep celebration
- `win.mp3` - Victory sound
- `lose.mp3` - Defeat sound
- `turn-start.mp3` - Turn notification
- `ui-click.mp3` - Button click
- `match-end.mp3` - Match completion

## Format

- Format: MP3 (high compression) or WAV (high quality)
- Sample Rate: 44.1kHz or 48kHz
- Duration: 0.5-2 seconds per file
- Bitrate: 128-192 kbps

## Resources

- Free sound effects: [Freesound](https://freesound.org)
- Sound libraries: [Zapsplat](https://www.zapsplat.com)
- Music sites: [Pixabay](https://pixabay.com)
- Recording software: [Audacity](https://www.audacityteam.org)

## Customization

Edit `frontend/src/app/page.tsx` to map sounds to events:

```typescript
const SOUNDS = {
  shuffle: '/assets/sounds/shuffle.mp3',
  cardPlace: '/assets/sounds/card-place.mp3',
  // ... more sounds
};
```
