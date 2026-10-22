import { GuestbookEntry } from '../types';

export const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: 'gb-1',
    name: 'Aarav & Meera',
    city: 'New Delhi',
    message: 'Looking at these photographs brings back goosebumps. The Kashi Ganga Aarti shots look like they belong in an art museum. What a magical pilgrimage!',
    favoriteMoment: 'The night reflection of lamps at Dashashwamedh',
    reaction: '🙏',
    createdAt: '2026-10-20T22:15:00Z',
    status: 'approved'
  },
  {
    id: 'gb-2',
    name: 'Siddharth V.',
    city: 'Bengaluru',
    message: 'The Camera Wars feature is hilarious! Still convinced the S25 crushed the shadows, but iPhone took the Saryu sunset. Thank you for sharing this journey with us all.',
    favoriteMoment: 'The Saryu sunset at Ram Ki Paidi',
    reaction: '📸',
    createdAt: '2026-10-21T08:30:00Z',
    status: 'approved'
  },
  {
    id: 'gb-3',
    name: 'Pooja Sharma',
    city: 'Mumbai',
    message: 'The Memory Machine felt so nostalgic with the shutter clicks! Felt like I was on the wooden boat in Varanasi right beside you.',
    favoriteMoment: 'Manikarnika Ghat contemplation',
    reaction: '✨',
    createdAt: '2026-10-21T14:10:00Z',
    status: 'approved'
  }
];
