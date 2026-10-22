import { JourneyDiaryDay } from '../types';

export const JOURNEY_DIARIES: JourneyDiaryDay[] = [
  {
    day: 1,
    date: 'October 16, 2026',
    isoDate: '2026-10-16',
    city: 'Varanasi',
    title: 'The Awakening at the Ghats',
    hindiTitle: 'काशी आगमन एवं गंगा महाआरती',
    subtitle: 'Stepping into the eternal city as dawn mist dissolves into sacred evening flame',
    coverPhoto: '/images/optimized/dashashwamedh-maha-aarti-22a85777.webp',
    personalNarrative: `The morning train pulled into Varanasi Junction just as the first cool autumn breeze of mid-October brushed against our faces. Entering Kashi doesn't feel like arriving at a geographic coordinate—it feels like stepping sideways out of linear time into an ancient continuum that has never paused for thousands of years.

We navigated the labyrinthine galis toward the western bank of the sacred Ganga. The morning sunlight poured like liquid honey over the ancient stone steps, revealing wooden rowboats gently bobbing on the water. Later in the evening, we took our position on the wooden deck of a quiet boat facing Dashashwamedh Ghat for the Maha Aarti. 

As seven young pujaris in silk robes raised the towering bronze multi-tiered deepams, the roar of conch shells and Vedic hymns echoed across the water. Fire, incense, and thousands of floating marigold diyas transformed the river into a moving galaxy of prayer.`,
    locationsVisited: ['kashi-vishwanath', 'dashashwamedh-ghat'],
    timeline: [
      {
        time: '05:30 AM',
        title: 'Arrival in Varanasi & Morning Ghat Walk',
        note: 'First glimpse of the sunrise across the eastern bank of the Ganga.',
        photoId: 'kashi-dawn-ghat-a0629a05',
        locationId: 'dashashwamedh-ghat'
      },
      {
        time: '09:00 AM',
        title: 'Shri Kashi Vishwanath Darshan',
        note: 'Walking through the newly restored Vishwanath Corridor into the golden sanctum.',
        locationId: 'kashi-vishwanath'
      },
      {
        time: '01:30 PM',
        title: 'Banarasi Kachori-Jalebi at Thatheri Bazar',
        note: 'Crispy hing kachoris served on leaf pattals followed by piping hot jalebis.'
      },
      {
        time: '06:15 PM',
        title: 'Dashashwamedh Maha Aarti from the River',
        note: 'Watching the sacred ceremony from a wooden boat beneath the starlit sky.',
        photoId: 'dashashwamedh-maha-aarti-22a85777',
        locationId: 'dashashwamedh-ghat'
      }
    ],
    funnyIncidents: [
      'A local monkey on the rooftop near Godowlia made a sudden grab for our tripod bag before settling for an offering of roasted chana instead.',
      'Our boatman Munna Bhaiya insisted on acting as our camera critic, declaring that the evening fire looked more cinematic on manual exposure.'
    ],
    memorableConversations: [
      {
        speaker: 'Boatman Munna',
        text: 'Babuji, Banaras dekhna hai toh aankh band karke suniye pehle. Ganga ki lehar aur ghante ki aawaz hi Banaras hai.',
        context: 'While rowing into the center of the Ganga at twilight'
      },
      {
        speaker: 'Local Chaiwala at Chowk',
        text: 'Yahan har roz subah ek nayi zindagi shuru hoti hai, aur shaam ko Ganga me samapt hoti hai.',
        context: 'Over a clay kulhad of ginger malai chai'
      }
    ],
    highlightQuotes: [
      '"Benares is older than history, older than tradition, older even than legend, and looks twice as old as all of them put together." — Mark Twain',
      '"In Kashi, the sacred fire does not consume; it illuminates."'
    ],
    photoIds: ['kashi-dawn-ghat-a0629a05', 'dashashwamedh-maha-aarti-22a85777'],
    featuredPhotoIds: ['dashashwamedh-maha-aarti-22a85777', 'kashi-dawn-ghat-a0629a05']
  },
  {
    day: 2,
    date: 'October 17, 2026',
    isoDate: '2026-10-17',
    city: 'Varanasi',
    title: 'Guardians & The Eternal Pyre',
    hindiTitle: 'भैरव दर्शन एवं मोक्षदायिनी मणिकर्णिका',
    subtitle: 'From the Kotwal of Kashi to the timeless fires of liberation at Manikarnika',
    coverPhoto: '/images/optimized/manikarnika-sacred-fires-687d9d84.webp',
    personalNarrative: `Day two began with an essential pilgrimage protocol: seeking permission from Kaal Bhairav, the fierce guardian deity and celestial police chief of Kashi. According to tradition, no traveler or soul can abide in the sacred city without his divine sanction. We tied the protective black silk thread (kaala dhaaga) around our wrists amidst dense camphor incense.

Later in the afternoon, we paid homage at Maa Annapurna temple, marveling at the golden idol that bestows sustenance upon both pilgrims and gods alike.

As twilight gathered, our boat glided silently toward Manikarnika Ghat. The sacred cremation fires—burning uninterrupted for thousands of years—cast amber reflections across the dark water. Sitting there in deep silence, one experiences not grief, but a profound peace: the illusion of permanence vanishes, leaving only gratitude and awe for life itself.`,
    locationsVisited: ['kaal-bhairav', 'annapurna-temple', 'manikarnika-ghat'],
    timeline: [
      {
        time: '07:30 AM',
        title: 'Kaal Bhairav Temple Darshan',
        note: 'Seeking the blessings and permission of the Kotwal of Varanasi.',
        locationId: 'kaal-bhairav'
      },
      {
        time: '11:00 AM',
        title: 'Maa Annapurna Darshan',
        note: 'Quiet prayers for abundance, gratitude, and nourishment.',
        locationId: 'annapurna-temple'
      },
      {
        time: '03:00 PM',
        title: 'Exploring Old Kashi Silk Weavers',
        note: 'Witnessing Master Zari artisans weaving authentic Banarasi brocade on vintage jacquard wooden looms.'
      },
      {
        time: '06:30 PM',
        title: 'Contemplation at Manikarnika Ghat',
        note: 'Observing the sacred eternal flame of Mahashmashana from the tranquil river.',
        photoId: 'manikarnika-sacred-fires-687d9d84',
        locationId: 'manikarnika-ghat'
      }
    ],
    funnyIncidents: [
      'The temple priest at Kaal Bhairav tapped our backs with a peacock feather broom with so much vigour that my camera almost slipped from my neck strap.',
      'We spent twenty minutes arguing whether the Galaxy S25 night mode or the iPhone 17 tone curve captured the smoky twilight better.'
    ],
    memorableConversations: [
      {
        speaker: 'Elderly Sadhu at Scindia Ghat',
        text: 'Maut yahan darati nahi hai, beta. Maut yahan Mahadev ka aashirwad hai.',
        context: 'Sitting on stone steps overlooking the smoking pyres'
      }
    ],
    highlightQuotes: [
      '"Death is not the opposite of life, but an eternal transition back to the source."',
      '"To look upon Manikarnika is to shed the burden of vanity."'
    ],
    photoIds: ['manikarnika-sacred-fires-687d9d84', 'kashi-dawn-ghat-a0629a05'],
    featuredPhotoIds: ['manikarnika-sacred-fires-687d9d84']
  },
  {
    day: 3,
    date: 'October 18, 2026',
    isoDate: '2026-10-18',
    city: 'Varanasi',
    title: 'The Wheel of Dharma & Sacred Verses',
    hindiTitle: 'सारनाथ शांति एवं तुलसी मानस',
    subtitle: 'Where Buddha turned the wheel of truth and Tulsidas etched the immortal Ramayana',
    coverPhoto: '/images/optimized/sarnath-dhamek-stupa-c0384629.webp',
    personalNarrative: `After the sensory intensity of the ghats, our third day offered deep contemplative stillness. A short morning drive north brought us to Sarnath. Walking through the manicured lawns surrounded by ancient brick foundations, the monolithic 5th-century Dhamek Stupa rose majestically into the clear blue sky. It was here in this very deer park that Siddhartha Gautama gave his first discourse after enlightenment.

In the afternoon, we visited Tulsi Manas Mandir. Standing before walls carved with the entire text of the Ramcharitmanas, one feels the literary and spiritual heartbeat of medieval India. 

We concluded the day under the towering white shikhara of the New Vishwanath Temple inside the sprawling, tree-lined Banaras Hindu University campus.`,
    locationsVisited: ['sarnath-deer-park', 'tulsi-manas-temple', 'bhu-vishwanath'],
    timeline: [
      {
        time: '08:30 AM',
        title: 'Sarnath Deer Park & Dhamek Stupa',
        note: 'Walking the pradakshina path around the 1500-year-old Buddhist stupa.',
        photoId: 'sarnath-dhamek-stupa-c0384629',
        locationId: 'sarnath-deer-park'
      },
      {
        time: '01:00 PM',
        title: 'Sarnath Archaeological Museum',
        note: 'Beholding the original Ashokan Lion Capital polished to mirror perfection.'
      },
      {
        time: '03:45 PM',
        title: 'Tulsi Manas & Durga Kund Mandir',
        note: 'Reading couplets inscribed on pure white Makrana marble.',
        locationId: 'tulsi-manas-temple'
      },
      {
        time: '05:30 PM',
        title: 'BHU Vishwanath Temple at Sunset',
        note: 'Sitting in the serene temple gardens as evening bells chimed from the 77-meter spire.',
        locationId: 'bhu-vishwanath'
      }
    ],
    funnyIncidents: [
      'We stopped for famous Blue Lassi in Chowk; our friend attempted to pronounce all 30 exotic fruit toppings in a single breath and got choked up on pomegranate seeds.',
      'A university student at BHU tried to photobomb our architectural shot while balancing a cup of cold coffee on his bicycle handle.'
    ],
    memorableConversations: [
      {
        speaker: 'Sarnath Museum Guide',
        text: 'The polish on this Ashokan sandstone has lasted 2,300 years without losing its glass-like shine. What we build with devotion never fades.',
        context: 'Standing before the Lion Capital'
      }
    ],
    highlightQuotes: [
      '"Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened." — Gautama Buddha',
      '"From silence to wisdom, the deer park carries the whisper of an awakened world."'
    ],
    photoIds: ['sarnath-dhamek-stupa-c0384629'],
    featuredPhotoIds: ['sarnath-dhamek-stupa-c0384629']
  },
  {
    day: 4,
    date: 'October 19, 2026',
    isoDate: '2026-10-19',
    city: 'Ayodhya',
    title: 'Entering the City of Sri Rama',
    hindiTitle: 'अयोध्या धाम एवं राम जन्मभूमि दर्शन',
    subtitle: 'From the banks of Ganga to the city of Raghu—the grand darshan at Ram Janmabhoomi',
    coverPhoto: '/images/optimized/ram-janmabhoomi-mandir-ad63e062.webp',
    personalNarrative: `We set out before sunrise on October 19th, watching the morning mist give way to golden mustard fields as we crossed eastern Uttar Pradesh into the sacred city of Ayodhya. The transition from Shiva's ancient citadel of Kashi to Rama's royal city of righteousness was palpable in the architecture, the chants, and the atmosphere.

Before visiting the Janmabhoomi, we climbed the 76 steep stone stairs to Hanuman Garhi. Perched on its hilltop fortress, Lord Hanuman watches vigilantly over every arrival.

By midday, we passed through the monumental arched gateway into the Shri Ram Janmabhoomi complex. Carved entirely from pink Bansi Paharpur sandstone in classical Nagara style without a single piece of structural iron, the temple rose like a celestial palace. Standing before the divine murti of Ram Lalla, the emotion across thousands of pilgrims was overwhelming—tears, folded hands, and spontaneous cries of 'Jai Shri Ram'.`,
    locationsVisited: ['ram-janmabhoomi', 'hanuman-garhi'],
    timeline: [
      {
        time: '06:00 AM',
        title: 'Road Journey: Varanasi to Ayodhya',
        note: '190 km highway drive through the autumn heartlands of Awadh.'
      },
      {
        time: '11:00 AM',
        title: 'Hanuman Garhi Fort Darshan',
        note: 'Climbing the 76 stairs to receive the protective blessings of Mahavira.',
        locationId: 'hanuman-garhi'
      },
      {
        time: '01:30 PM',
        title: 'Awadhi Satvik Feast',
        note: 'Traditional pure ghee puris, kaddu ki sabzi, and rabdi pedas.'
      },
      {
        time: '03:30 PM',
        title: 'Shri Ram Janmabhoomi Mandir Darshan',
        note: 'The unforgettable sight of the pink sandstone towers and the darshan of Ram Lalla.',
        photoId: 'ram-janmabhoomi-mandir-ad63e062',
        locationId: 'ram-janmabhoomi'
      }
    ],
    funnyIncidents: [
      'At Hanuman Garhi, a family warned us to hold our spectacles; within ten seconds, a monkey had snatched a tourist\'s sunglass case and gracefully traded it back for a box of motichoor laddoos.',
      'Our friend spent 10 minutes looking for an iPhone charger in the car, only to realize he had been using it as a camera wrist-strap.'
    ],
    memorableConversations: [
      {
        speaker: 'Elderly Pilgrim from Maharashtra',
        text: 'Pachas saal se intezaar tha. Aaj aankhon se aashirwad nikal raha hai.',
        context: 'Stepping down from the temple corridor with folded hands'
      }
    ],
    highlightQuotes: [
      '"Ram is not merely a name; he is the inner compass of human righteousness."',
      '"Pink stone carved by thousand hands, crowned by a devotion older than memory."'
    ],
    photoIds: ['ram-janmabhoomi-mandir-ad63e062'],
    featuredPhotoIds: ['ram-janmabhoomi-mandir-ad63e062']
  },
  {
    day: 5,
    date: 'October 20, 2026',
    isoDate: '2026-10-20',
    city: 'Ayodhya',
    title: 'The Golden Palace & Saryu Sunset',
    hindiTitle: 'कनक भवन एवं सरयू तट संध्या',
    subtitle: 'The golden sanctum of Sita-Ram and the tranquil farewell by the waters of Saryu',
    coverPhoto: '/images/optimized/saryu-sunset-ram-ki-paidi-00393a65.webp',
    personalNarrative: `Our final day in the sacred cities opened at Kanak Bhawan—the legendary "Palace of Gold" gifted by Queen Kaikeyi to Sita Ji. The inner courtyards, painted with delicate murals and arched in Bundelkhandi elegance, felt intimate and reverent. Devotees sat in quiet clusters singing sweet Awadhi bhajans.

As late afternoon approached, we made our way to Ram Ki Paidi on the banks of the Saryu River. The calm water mirrored the silhouettes of countless temple spires. Sitting side by side on the ancient stone steps as the autumn sun dipped beneath the horizon, painting the sky in fiery tones of amber, copper, and rose gold.

We watched the evening lamps float gently along the surface of the river. Five days had passed like a vivid dream. We began as ordinary travelers; we departed carrying the sacred imprint of two eternal cities in our souls.`,
    locationsVisited: ['kanak-bhawan', 'saryu-ghat'],
    timeline: [
      {
        time: '08:30 AM',
        title: 'Kanak Bhawan Morning Darshan',
        note: 'Listening to melodious sitar and tabla bhajans in the sunlit palace courtyard.',
        locationId: 'kanak-bhawan'
      },
      {
        time: '12:00 PM',
        title: 'Strolling through Ramkot & Dashrath Mahal',
        note: 'Exploring the heritage courtyards and antique wooden balconies of old Ayodhya.'
      },
      {
        time: '04:30 PM',
        title: 'Ram Ki Paidi & Saryu River Walk',
        note: 'Walking the riverside promenade as priests prepared the evening Saryu Aarti.',
        photoId: 'saryu-sunset-ram-ki-paidi-00393a65',
        locationId: 'saryu-ghat'
      },
      {
        time: '06:00 PM',
        title: 'Sunset Farewell & Final Reflections',
        note: 'Sitting on the water\'s edge, releasing our final marigold diya into the golden ripples.',
        photoId: 'saryu-sunset-ram-ki-paidi-00393a65',
        locationId: 'saryu-ghat'
      }
    ],
    funnyIncidents: [
      'We tried to take one final group selfie at sunset; a rogue pigeon flew straight into the frame, creating our unofficial trip mascot photo.',
      'We bought so many packets of Ayodhya pedas for our families back home that we had to rearrange all our camera bags just to zip them up.'
    ],
    memorableConversations: [
      {
        speaker: 'Tea vendor by Saryu Ghat',
        text: 'Kashi me moksha milta hai, Ayodhya me shanti. Dono dekh liya, toh jeevan me bacha hi kya?',
        context: 'Pouring hot spiced tea into clay cups as twilight fell'
      }
    ],
    highlightQuotes: [
      '"The journey lasted five days. The memories will last a lifetime."',
      '"Rivers flow, empires dissolve, but sacred devotion remains eternal."'
    ],
    photoIds: ['saryu-sunset-ram-ki-paidi-00393a65'],
    featuredPhotoIds: ['saryu-sunset-ram-ki-paidi-00393a65']
  }
];

export function getDiaryByDay(dayNumber: number): JourneyDiaryDay | undefined {
  return JOURNEY_DIARIES.find(d => d.day === dayNumber);
}
