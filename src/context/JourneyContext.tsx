import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Photo, CameraBattle, BattleComment, GuestbookEntry } from '../types';
import photosData from '../data/photos.json';
import { INITIAL_BATTLES, INITIAL_COMMENTS } from '../data/camera-wars';
import { INITIAL_GUESTBOOK } from '../data/guestbook';
import { AUDIO_PREFERENCES, BACKGROUND_SOUNDTRACK } from '../config/audio';
import { apiRequest } from '../lib/api';

interface JourneyContextType {
  photos: Photo[];
  favorites: string[];
  toggleFavorite: (photoId: string) => void;
  isFavorite: (photoId: string) => boolean;
  battles: CameraBattle[];
  userVotes: Record<string, 'Galaxy S25' | 'iPhone 17'>;
  castVote: (battleId: string, device: 'Galaxy S25' | 'iPhone 17') => void;
  comments: Record<string, BattleComment[]>;
  addComment: (battleId: string, author: string, text: string, reaction?: string) => void;
  guestbook: GuestbookEntry[];
  addGuestbookEntry: (name: string, city: string | undefined, message: string, reaction: string, favoriteMoment?: string) => Promise<boolean>;
  isAudioPlaying: boolean;
  toggleAudio: () => void;
  audioVolume: number;
  setAudioVolume: (volume: number) => void;
  audioError: string | null;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

const DEFAULT_AUDIO_VOLUME = BACKGROUND_SOUNDTRACK.defaultVolume;
const AUDIO_VOLUME_KEY = AUDIO_PREFERENCES.volumeKey;
const AUDIO_MUTED_KEY = AUDIO_PREFERENCES.mutedKey;
const FADE_DURATION_MS = 350;

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

const getStoredVolume = () => {
  try {
    const stored = localStorage.getItem(AUDIO_VOLUME_KEY);
    if (stored === null) return DEFAULT_AUDIO_VOLUME;

    const parsed = Number(stored);
    return Number.isFinite(parsed) ? clampVolume(parsed) : DEFAULT_AUDIO_VOLUME;
  } catch {
    return DEFAULT_AUDIO_VOLUME;
  }
};

const getStoredMutedState = () => {
  try {
    // New visitors are always muted. A saved "false" means they previously
    // opted in, but playback still waits for their next explicit tap.
    return localStorage.getItem(AUDIO_MUTED_KEY) !== 'false';
  } catch {
    return true;
  }
};

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>(photosData as Photo[]);
  
  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eternal_journey_favorites');
      return saved ? JSON.parse(saved) : ['dashashwamedh-maha-aarti-22a85777'];
    } catch {
      return ['dashashwamedh-maha-aarti-22a85777'];
    }
  });

  // User votes in Camera Wars stored in localStorage
  const [userVotes, setUserVotes] = useState<Record<string, 'Galaxy S25' | 'iPhone 17'>>(() => {
    try {
      const saved = localStorage.getItem('camera_wars_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [battles, setBattles] = useState<CameraBattle[]>(() => {
    try {
      const saved = localStorage.getItem('camera_wars_battles');
      return saved ? JSON.parse(saved) : INITIAL_BATTLES;
    } catch {
      return INITIAL_BATTLES;
    }
  });

  const [comments, setComments] = useState<Record<string, BattleComment[]>>(() => {
    try {
      const saved = localStorage.getItem('camera_wars_comments');
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('eternal_journey_guestbook');
      return saved ? JSON.parse(saved) : INITIAL_GUESTBOOK;
    } catch {
      return INITIAL_GUESTBOOK;
    }
  });

  // Published CMS photos and approved guestbook entries enhance the bundled
  // memorial data when the API is configured. The existing experience remains
  // available if an owner has not deployed MongoDB yet.
  useEffect(() => {
    let active = true;
    void Promise.all([
      apiRequest<{ photos: Photo[] }>('/photos?limit=60'),
      apiRequest<{ entries: GuestbookEntry[] }>('/guestbook?limit=60')
    ]).then(([photoResponse, guestbookResponse]) => {
      if (!active) return;
      if (photoResponse.photos.length) setPhotos(photoResponse.photos);
      if (guestbookResponse.entries.length) setGuestbook(guestbookResponse.entries);
    }).catch(() => {
      // The public site deliberately keeps its curated static fallback available.
    });
    return () => { active = false; };
  }, []);

  // A single Audio element lives for the lifetime of the provider, so route changes
  // never create a second soundtrack or restart an active one.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const isAudioStartingRef = useRef(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolumeState] = useState(getStoredVolume);
  const [isAudioMuted, setIsAudioMuted] = useState(getStoredMutedState);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('eternal_journey_favorites', JSON.stringify(favorites));
    } catch {
      // storage unavailable
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('camera_wars_votes', JSON.stringify(userVotes));
    } catch {
      // storage unavailable
    }
  }, [userVotes]);

  useEffect(() => {
    try {
      localStorage.setItem('camera_wars_battles', JSON.stringify(battles));
    } catch {
      // storage unavailable
    }
  }, [battles]);

  useEffect(() => {
    try {
      localStorage.setItem('camera_wars_comments', JSON.stringify(comments));
    } catch {
      // storage unavailable
    }
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem('eternal_journey_guestbook', JSON.stringify(guestbook));
    } catch {
      // storage unavailable
    }
  }, [guestbook]);

  useEffect(() => {
    try {
      localStorage.setItem(AUDIO_VOLUME_KEY, String(audioVolume));
    } catch {
      // storage unavailable
    }
  }, [audioVolume]);

  useEffect(() => {
    try {
      localStorage.setItem(AUDIO_MUTED_KEY, String(isAudioMuted));
    } catch {
      // storage unavailable
    }
  }, [isAudioMuted]);

  const cancelAudioFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeAudioTo = useCallback((targetVolume: number, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    cancelAudioFade();
    const startVolume = audio.volume;
    const target = clampVolume(targetVolume);
    const startTime = performance.now();
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : FADE_DURATION_MS;

    const step = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - startTime) / duration);
      audio.volume = startVolume + (target - startVolume) * progress;

      if (progress < 1) {
        fadeFrameRef.current = window.requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
        onComplete?.();
      }
    };

    fadeFrameRef.current = window.requestAnimationFrame(step);
  }, [cancelAudioFade]);

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(BACKGROUND_SOUNDTRACK.src);
    audio.loop = true;
    audio.preload = 'metadata';
    // Attribute form is understood by iOS Safari even though it is not exposed on
    // TypeScript's HTMLAudioElement interface.
    audio.setAttribute('playsinline', '');
    audio.volume = 0;
    audio.addEventListener('error', () => {
      cancelAudioFade();
      isAudioStartingRef.current = false;
      setIsAudioPlaying(false);
      setIsAudioMuted(true);
      setAudioError('The instrumental soundscape could not be loaded. Please try again.');
    });
    audioRef.current = audio;
    return audio;
  }, [cancelAudioFade]);

  const setAudioVolume = useCallback((volume: number) => {
    const nextVolume = clampVolume(volume);
    setAudioVolumeState(nextVolume);

    // A direct adjustment should take precedence over an in-progress fade.
    if (audioRef.current && isAudioPlaying) {
      cancelAudioFade();
      audioRef.current.volume = nextVolume;
    }
  }, [cancelAudioFade, isAudioPlaying]);

  useEffect(() => {
    return () => {
      cancelAudioFade();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [cancelAudioFade]);

  const toggleFavorite = (photoId: string) => {
    setFavorites(prev => 
      prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId]
    );
  };

  const isFavorite = (photoId: string) => favorites.includes(photoId);

  const castVote = (battleId: string, device: 'Galaxy S25' | 'iPhone 17') => {
    const previousVote = userVotes[battleId];
    if (previousVote === device) return; // already voted for this device

    setUserVotes(prev => ({ ...prev, [battleId]: device }));

    setBattles(prev => prev.map(battle => {
      if (battle.id !== battleId) return battle;

      let newS25 = battle.votesS25;
      let newIPhone = battle.votesIPhone;

      if (previousVote === 'Galaxy S25') newS25 = Math.max(0, newS25 - 1);
      if (previousVote === 'iPhone 17') newIPhone = Math.max(0, newIPhone - 1);

      if (device === 'Galaxy S25') newS25 += 1;
      if (device === 'iPhone 17') newIPhone += 1;

      return {
        ...battle,
        votesS25: newS25,
        votesIPhone: newIPhone
      };
    }));
  };

  const addComment = (battleId: string, author: string, text: string, reaction?: string) => {
    const newComment: BattleComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      battleId,
      author: author.trim() || 'Pilgrim & Photo Lover',
      text: text.trim(),
      reaction: reaction || '✨',
      createdAt: new Date().toISOString(),
      status: 'approved'
    };

    setComments(prev => ({
      ...prev,
      [battleId]: [newComment, ...(prev[battleId] || [])]
    }));
  };

  const addGuestbookEntry = async (
    name: string,
    city: string | undefined,
    message: string,
    reaction: string,
    favoriteMoment?: string
  ) => {
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      name: name.trim() || 'A Fellow Pilgrim',
      city: city?.trim() || undefined,
      message: message.trim(),
      reaction: reaction || '🙏',
      favoriteMoment: favoriteMoment?.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: 'approved'
    };

    try {
      await apiRequest<GuestbookEntry>('/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newEntry.name, city: newEntry.city, message: newEntry.message, reaction: newEntry.reaction, favoriteMoment: newEntry.favoriteMoment })
      });
      // New server entries are intentionally moderated before reaching the public wall.
      return true;
    } catch {
      // Keep the existing local experience usable when the optional API is offline.
      setGuestbook(prev => [newEntry, ...prev]);
      return false;
    }
  };

  const toggleAudio = useCallback(async () => {
    const audio = getAudio();

    if (isAudioPlaying) {
      setIsAudioMuted(true);
      setIsAudioPlaying(false);
      fadeAudioTo(0, () => audio.pause());
      return;
    }

    // Repeated taps can occur before play() resolves on slower mobile networks.
    // Keep that to one request and one media element.
    if (isAudioStartingRef.current) return;
    isAudioStartingRef.current = true;

    // play() is deliberately invoked from this user-triggered handler. This is required
    // by Safari and avoids attempting background playback before a visitor opts in.
    try {
      cancelAudioFade();
      audio.muted = false;
      audio.volume = 0;
      await audio.play();
      setAudioError(null);
      setIsAudioMuted(false);
      setIsAudioPlaying(true);
      fadeAudioTo(audioVolume);
    } catch (error) {
      audio.pause();
      setIsAudioMuted(true);
      setIsAudioPlaying(false);
      setAudioError('Playback was blocked or the instrumental soundscape could not be loaded. Please check your browser audio settings and try again.');
      console.warn('Sacred soundtrack playback failed:', error);
    } finally {
      isAudioStartingRef.current = false;
    }
  }, [audioVolume, cancelAudioFade, fadeAudioTo, getAudio, isAudioPlaying]);

  return (
    <JourneyContext.Provider
      value={{
        photos,
        favorites,
        toggleFavorite,
        isFavorite,
        battles,
        userVotes,
        castVote,
        comments,
        addComment,
        guestbook,
        addGuestbookEntry,
        isAudioPlaying,
        toggleAudio,
        audioVolume,
        setAudioVolume,
        audioError
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};
