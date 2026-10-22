/**
 * The only place the global soundscape asset is configured.
 *
 * To use a future Mahamrityunjaya Mantra MP3, place it in `public/audio/` and
 * update `src` below. The player, fades, looping, and preference handling stay
 * unchanged.
 */
export const BACKGROUND_SOUNDTRACK = {
  src: '/audio/eternal-journey-instrumental.wav',
  label: 'Eternal Journey instrumental soundscape',
  defaultVolume: 0.2
} as const;

export const AUDIO_PREFERENCES = {
  volumeKey: 'eternal_journey_audio_volume',
  mutedKey: 'eternal_journey_audio_muted'
} as const;
