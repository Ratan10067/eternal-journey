export type City = 'Varanasi' | 'Ayodhya';

export interface Photo {
  id: string;
  src: string;
  thumbnail: string;
  date: string | null;
  city: City | null;
  locationId: string | null;
  caption: string;
  featured: boolean;
  device?: 'Galaxy S25' | 'iPhone 17' | 'Other';
  width?: number;
  height?: number;
  aspect?: number;
  exif?: {
    make?: string;
    model?: string;
    focalLength?: string;
    aperture?: string;
    iso?: string;
  };
}

export type LocationCategory = 'temple' | 'ghat' | 'sacred_site' | 'heritage' | 'ceremony';

export interface LocationMemory {
  id: string;
  slug: string;
  name: string;
  hindiName: string;
  city: City;
  category: LocationCategory;
  coordinates: [number, number]; // [longitude, latitude]
  date: string;
  dayNumber: number;
  timeOfDay?: string;
  coverImage: string;
  summary: string;
  culturalNote?: string;
  photoIds: string[];
}

export interface TimelineEvent {
  time: string;
  title: string;
  note: string;
  photoId?: string;
  locationId?: string;
}

export interface ConversationQuote {
  speaker: string;
  text: string;
  context?: string;
}

export interface DayTimeline {
  day: number;
  date: string;
  isoDate: string;
  city: City | 'Transit';
  title: string;
  hindiTitle: string;
  tagline: string;
  story: string;
  heroPhoto: string;
  locationIds: string[];
  featuredPhotoIds: string[];
}

export interface JourneyDiaryDay {
  day: number; // 1 to 5
  date: string; // e.g. "October 16, 2026"
  isoDate: string; // "2026-10-16"
  city: City | 'Transit';
  title: string;
  hindiTitle: string;
  subtitle: string;
  coverPhoto: string;
  personalNarrative: string; // Markdown or rich narrative
  locationsVisited: string[]; // LocationMemory IDs
  timeline: TimelineEvent[];
  funnyIncidents: string[];
  memorableConversations: ConversationQuote[];
  highlightQuotes: string[];
  photoIds: string[];
  featuredPhotoIds: string[];
  isDraft?: boolean;
}

export interface CameraBattle {
  id: string;
  title: string;
  locationId: string;
  locationName: string;
  date: string;
  description: string;
  photoS25: {
    src: string;
    thumbnail: string;
    caption: string;
    device: 'Galaxy S25';
    settings?: string;
  };
  photoIPhone: {
    src: string;
    thumbnail: string;
    caption: string;
    device: 'iPhone 17';
    settings?: string;
  };
  votesS25: number;
  votesIPhone: number;
  status: 'active' | 'concluded';
  createdAt: string;
}

export interface BattleComment {
  id: string;
  battleId: string;
  author: string;
  text: string;
  reaction?: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'flagged';
}

export interface GuestbookEntry {
  id: string;
  name: string;
  city?: string;
  message: string;
  favoriteMoment?: string;
  reaction: string;
  createdAt: string;
  status: 'approved' | 'pending';
}

export interface ScoreboardStats {
  totalVotesS25: number;
  totalVotesIPhone: number;
  battlesWonS25: number;
  battlesWonIPhone: number;
  totalBattles: number;
}
