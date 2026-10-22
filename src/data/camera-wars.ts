import { CameraBattle, BattleComment } from '../types';

export const INITIAL_BATTLES: CameraBattle[] = [
  {
    id: 'battle-01-aarti-flames',
    title: 'Round 1: The Sacred Flames of Dashashwamedh',
    locationId: 'dashashwamedh-ghat',
    locationName: 'Dashashwamedh Ghat, Varanasi',
    date: 'October 16, 2026',
    description: 'Capturing high dynamic range in extreme darkness: blazing multi-tiered brass lamps versus dark river ripples and dense crowds.',
    photoS25: {
      src: '/images/optimized/dashashwamedh-maha-aarti-22a85777.webp',
      thumbnail: '/images/thumbnails/dashashwamedh-maha-aarti-22a85777.webp',
      caption: 'Galaxy S25 with Nightography Pro: preserved rich shadow recovery on the wooden boats and vivid saffron tones.',
      device: 'Galaxy S25',
      settings: '23mm equivalent · f/1.7 · 1/60s · ISO 400'
    },
    photoIPhone: {
      src: '/images/optimized/dashashwamedh-maha-aarti-22a85777.webp',
      thumbnail: '/images/thumbnails/dashashwamedh-maha-aarti-22a85777.webp',
      caption: 'iPhone 17 Photonic Engine: natural highlight roll-off in the direct flame tips and warm analog tone curve.',
      device: 'iPhone 17',
      settings: '24mm equivalent · f/1.6 · 1/50s · ISO 320'
    },
    votesS25: 42,
    votesIPhone: 38,
    status: 'active',
    createdAt: '2026-10-17T09:00:00Z'
  },
  {
    id: 'battle-02-dawn-mist',
    title: 'Round 2: Golden Mist at Kashi Ghats',
    locationId: 'dashashwamedh-ghat',
    locationName: 'Ganges Riverbank, Varanasi',
    date: 'October 16, 2026',
    description: 'Subtle atmospheric haze, delicate pastel dawn gradients, and texture on old stone ghats.',
    photoS25: {
      src: '/images/optimized/kashi-dawn-ghat-a0629a05.webp',
      thumbnail: '/images/thumbnails/kashi-dawn-ghat-a0629a05.webp',
      caption: 'Galaxy S25 200MP detail crop: individual oars and water droplets crisply delineated in morning glow.',
      device: 'Galaxy S25',
      settings: '23mm equivalent · f/1.7 · 1/250s · ISO 100'
    },
    photoIPhone: {
      src: '/images/optimized/kashi-dawn-ghat-a0629a05.webp',
      thumbnail: '/images/thumbnails/kashi-dawn-ghat-a0629a05.webp',
      caption: 'iPhone 17 Smart HDR: dreamy atmospheric depth and smooth fog gradation across the river.',
      device: 'iPhone 17',
      settings: '24mm equivalent · f/1.6 · 1/280s · ISO 80'
    },
    votesS25: 55,
    votesIPhone: 59,
    status: 'active',
    createdAt: '2026-10-17T14:30:00Z'
  },
  {
    id: 'battle-03-mandir-sandstone',
    title: 'Round 3: Pink Sandstone of Shri Ram Janmabhoomi',
    locationId: 'ram-janmabhoomi',
    locationName: 'Ram Janmabhoomi, Ayodhya',
    date: 'October 19, 2026',
    description: 'Midday sunlight hitting intricate Nagara architectural carvings of pink Bansi Paharpur sandstone against an azure sky.',
    photoS25: {
      src: '/images/optimized/ram-janmabhoomi-mandir-ad63e062.webp',
      thumbnail: '/images/thumbnails/ram-janmabhoomi-mandir-ad63e062.webp',
      caption: 'Galaxy S25 punchy saturation and vivid blue sky contrast highlighting every carved pillar.',
      device: 'Galaxy S25',
      settings: '23mm equivalent · f/1.7 · 1/1200s · ISO 50'
    },
    photoIPhone: {
      src: '/images/optimized/ram-janmabhoomi-mandir-ad63e062.webp',
      thumbnail: '/images/thumbnails/ram-janmabhoomi-mandir-ad63e062.webp',
      caption: 'iPhone 17 neutral warmth and organic sandstone texture without over-sharpening.',
      device: 'iPhone 17',
      settings: '24mm equivalent · f/1.6 · 1/1400s · ISO 40'
    },
    votesS25: 64,
    votesIPhone: 61,
    status: 'active',
    createdAt: '2026-10-19T18:00:00Z'
  },
  {
    id: 'battle-04-saryu-sunset',
    title: 'Round 4: Saryu River Sunset Amber Reflections',
    locationId: 'saryu-ghat',
    locationName: 'Ram Ki Paidi, Ayodhya',
    date: 'October 20, 2026',
    description: 'Golden hour twilight with deep reflections of temple spires on the gentle ripples of Saryu River.',
    photoS25: {
      src: '/images/optimized/saryu-sunset-ram-ki-paidi-00393a65.webp',
      thumbnail: '/images/thumbnails/saryu-sunset-ram-ki-paidi-00393a65.webp',
      caption: 'Galaxy S25 ultra-wide angle view with vibrant burnt copper highlights.',
      device: 'Galaxy S25',
      settings: '13mm equivalent · f/2.2 · 1/90s · ISO 125'
    },
    photoIPhone: {
      src: '/images/optimized/saryu-sunset-ram-ki-paidi-00393a65.webp',
      thumbnail: '/images/thumbnails/saryu-sunset-ram-ki-paidi-00393a65.webp',
      caption: 'iPhone 17 2x optical portrait crop with cinematic natural lens flare.',
      device: 'iPhone 17',
      settings: '48mm equivalent · f/1.6 · 1/80s · ISO 160'
    },
    votesS25: 48,
    votesIPhone: 52,
    status: 'active',
    createdAt: '2026-10-20T21:00:00Z'
  }
];

export const INITIAL_COMMENTS: Record<string, BattleComment[]> = {
  'battle-01-aarti-flames': [
    {
      id: 'c1',
      battleId: 'battle-01-aarti-flames',
      author: 'Rohit K.',
      text: 'The highlight recovery on the flame tips in Photo B is unreal! But Photo A feels so punchy and cinematic.',
      reaction: '🔥',
      createdAt: '2026-10-17T11:20:00Z',
      status: 'approved'
    },
    {
      id: 'c2',
      battleId: 'battle-01-aarti-flames',
      author: 'Ananya S.',
      text: 'Blind voted for A! The mood of Kashi comes through so intensely. S25 or iPhone, both did magic here.',
      reaction: '✨',
      createdAt: '2026-10-17T13:45:00Z',
      status: 'approved'
    }
  ],
  'battle-03-mandir-sandstone': [
    {
      id: 'c3',
      battleId: 'battle-03-mandir-sandstone',
      author: 'Vikramaditya',
      text: 'The stone texture and carvings on the mandir are breathtaking. Hardest vote of the trip!',
      reaction: '🏛️',
      createdAt: '2026-10-19T20:10:00Z',
      status: 'approved'
    }
  ]
};
