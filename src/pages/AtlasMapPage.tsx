import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TRIP_BOUNDS, TRIP_CENTER, VERIFIED_LOCATIONS } from '../data/locations';
import { LocationMemory } from '../types';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight, Compass, MapPin, Pause, Play, RotateCcw, SkipForward, X } from 'lucide-react';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const REPLAY_DWELL_MS = 4300;

// The data file is maintained in visit order. It has no road-by-road transit trace.
const JOURNEY_STOPS = VERIFIED_LOCATIONS;

const makeRouteGeoJson = (stops: LocationMemory[]) => ({
  type: 'FeatureCollection' as const,
  features: stops.length > 1
    ? [{
        type: 'Feature' as const,
        properties: { name: 'Verified visit sequence' },
        geometry: { type: 'LineString' as const, coordinates: stops.map((stop) => stop.coordinates) }
      }]
    : []
});

const FULL_JOURNEY_ROUTE = makeRouteGeoJson(JOURNEY_STOPS);

const polishBasemap = (atlasMap: maplibregl.Map) => {
  atlasMap.getStyle().layers?.forEach((layer) => {
    const id = layer.id.toLowerCase();
    try {
      if (layer.type === 'background') atlasMap.setPaintProperty(layer.id, 'background-color', '#09090b');
      else if (id.includes('water') && layer.type === 'fill') atlasMap.setPaintProperty(layer.id, 'fill-color', '#0a1d2b');
      else if (id.includes('water') && layer.type === 'line') atlasMap.setPaintProperty(layer.id, 'line-color', '#17405a');
      else if (/(road|highway|street)/.test(id) && layer.type === 'line') atlasMap.setPaintProperty(layer.id, 'line-color', '#5c554a');
      else if (id.includes('label') && layer.type === 'symbol') {
        atlasMap.setPaintProperty(layer.id, 'text-color', '#d7d1c1');
        atlasMap.setPaintProperty(layer.id, 'text-halo-color', '#09090b');
        atlasMap.setPaintProperty(layer.id, 'text-halo-width', 1);
      }
    } catch {
      // The public style can change layer properties; ignore unsupported overrides.
    }
  });
};

const addAtlasLayers = (atlasMap: maplibregl.Map) => {
  atlasMap.addSource('verified-journey-route', { type: 'geojson', data: FULL_JOURNEY_ROUTE });
  atlasMap.addSource('replayed-journey-route', { type: 'geojson', data: makeRouteGeoJson([JOURNEY_STOPS[0]]) });

  atlasMap.addLayer({
    id: 'journey-route-halo', type: 'line', source: 'verified-journey-route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#d4af37', 'line-width': 8, 'line-opacity': 0.2, 'line-blur': 4 }
  });
  atlasMap.addLayer({
    id: 'journey-route-reference', type: 'line', source: 'verified-journey-route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#b99745', 'line-width': 1.25, 'line-opacity': 0.7, 'line-dasharray': [1.5, 1.5] }
  });
  atlasMap.addLayer({
    id: 'journey-route-progress', type: 'line', source: 'replayed-journey-route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#f7e3a7', 'line-width': 3, 'line-opacity': 1, 'line-blur': 0.25 }
  });
};

type ReplayState = 'idle' | 'playing' | 'paused' | 'complete';
type SelectionSource = 'marker' | 'dock' | 'replay' | 'filter';

export const AtlasMapPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const markerElementsRef = useRef(new Map<string, HTMLButtonElement>());

  const [selectedPlace, setSelectedPlace] = useState<LocationMemory | null>(JOURNEY_STOPS[0]);
  const [selectionSource, setSelectionSource] = useState<SelectionSource>('marker');
  const [activeCity, setActiveCity] = useState<'All' | 'Varanasi' | 'Ayodhya'>('All');
  const [replayState, setReplayState] = useState<ReplayState>('idle');
  const [replayIndex, setReplayIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const displayedLocations = useMemo(() => (
    JOURNEY_STOPS.filter((location) => activeCity === 'All' || location.city === activeCity)
  ), [activeCity]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  const focusLocation = useCallback((location: LocationMemory, source: SelectionSource) => {
    setSelectedPlace(location);
    setSelectionSource(source);
    map.current?.flyTo({
      center: location.coordinates,
      zoom: 13.1,
      pitch: reducedMotion ? 0 : 42,
      bearing: reducedMotion ? 0 : 16,
      duration: reducedMotion ? 0 : 1800,
      essential: false
    });
  }, [reducedMotion]);

  const handleSelectLocation = useCallback((location: LocationMemory, source: SelectionSource = 'marker') => {
    focusLocation(location, source);
  }, [focusLocation]);

  const updateReplayRoute = useCallback((stopIndex: number, state: ReplayState) => {
    const source = map.current?.getSource('replayed-journey-route') as maplibregl.GeoJSONSource | undefined;
    if (!source) return;
    const visibleStops = state === 'idle' || state === 'complete' ? JOURNEY_STOPS : JOURNEY_STOPS.slice(0, stopIndex + 1);
    source.setData(makeRouteGeoJson(visibleStops));
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    const markerElements = markerElementsRef.current;

    maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs');
    const atlasMap = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: TRIP_CENTER,
      zoom: 7.8,
      pitch: 28,
      bearing: 8,
      attributionControl: false,
      fadeDuration: 180
    });
    map.current = atlasMap;
    atlasMap.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    atlasMap.on('load', () => {
      polishBasemap(atlasMap);
      addAtlasLayers(atlasMap);
      updateReplayRoute(0, 'idle');
    });
    atlasMap.on('error', () => setMapError('The map tiles could not be loaded. Check your connection and reload the atlas.'));

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      markerElements.clear();
      atlasMap.remove();
      map.current = null;
    };
  }, [updateReplayRoute]);

  useEffect(() => {
    if (!map.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    markerElementsRef.current.clear();

    displayedLocations.forEach((location, index) => {
      const markerElement = document.createElement('button');
      markerElement.type = 'button';
      markerElement.className = 'custom-atlas-marker';
      markerElement.setAttribute('aria-label', `Show ${location.name}, stop ${JOURNEY_STOPS.indexOf(location) + 1}`);
      markerElement.setAttribute('data-location-id', location.id);
      markerElement.innerHTML = `
        <span class="atlas-marker-halo"></span>
        <span class="atlas-marker-ring"><span class="atlas-marker-core"></span></span>
        <span class="atlas-marker-number">${JOURNEY_STOPS.indexOf(location) + 1}</span>
        <span class="atlas-marker-label">${location.name}</span>
      `;
      markerElement.style.setProperty('--marker-delay', `${(index % 5) * 180}ms`);
      markerElement.addEventListener('click', () => handleSelectLocation(location, 'marker'));
      markerElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelectLocation(location, 'marker');
        }
      });

      const marker = new maplibregl.Marker({ element: markerElement, anchor: 'center' })
        .setLngLat(location.coordinates)
        .addTo(map.current!);
      markersRef.current.push(marker);
      markerElementsRef.current.set(location.id, markerElement);
    });
  }, [displayedLocations, handleSelectLocation]);

  useEffect(() => {
    markerElementsRef.current.forEach((markerElement, id) => {
      const isSelected = id === selectedPlace?.id;
      markerElement.classList.toggle('is-selected', isSelected);
      markerElement.setAttribute('aria-pressed', String(isSelected));
    });
  }, [selectedPlace]);

  useEffect(() => {
    updateReplayRoute(replayIndex, replayState);
  }, [replayIndex, replayState, updateReplayRoute]);

  useEffect(() => {
    if (replayState !== 'playing') return;
    const stop = JOURNEY_STOPS[replayIndex];
    focusLocation(stop, 'replay');
    const timer = window.setTimeout(() => {
      if (replayIndex === JOURNEY_STOPS.length - 1) setReplayState('complete');
      else setReplayIndex((index) => index + 1);
    }, reducedMotion ? 2800 : REPLAY_DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [focusLocation, reducedMotion, replayIndex, replayState]);

  const startOrResumeReplay = () => {
    if (replayState === 'playing') setReplayState('paused');
    else if (replayState === 'paused') setReplayState('playing');
    else {
      setActiveCity('All');
      setReplayIndex(0);
      setReplayState('playing');
    }
  };

  const restartReplay = () => {
    setActiveCity('All');
    setReplayIndex(0);
    setReplayState('playing');
  };

  const skipReplayStop = () => {
    if (replayState === 'complete') return;
    const nextIndex = Math.min(replayIndex + 1, JOURNEY_STOPS.length - 1);
    setReplayIndex(nextIndex);
    focusLocation(JOURNEY_STOPS[nextIndex], 'replay');
    if (nextIndex === JOURNEY_STOPS.length - 1) setReplayState('complete');
  };

  const handleCityFilter = (city: 'All' | 'Varanasi' | 'Ayodhya') => {
    setReplayState('idle');
    setActiveCity(city);
    const cityStops = city === 'All' ? JOURNEY_STOPS : JOURNEY_STOPS.filter((location) => location.city === city);
    if (!cityStops.length) return;
    setSelectedPlace(cityStops[0]);
    setSelectionSource('filter');
    const bounds = new maplibregl.LngLatBounds(cityStops[0].coordinates, cityStops[0].coordinates);
    cityStops.slice(1).forEach((location) => bounds.extend(location.coordinates));
    map.current?.fitBounds(bounds, {
      padding: { top: 190, bottom: 190, left: 50, right: 50 },
      maxZoom: city === 'All' ? 8 : 12,
      duration: reducedMotion ? 0 : 1300,
      essential: false
    });
  };

  const resetView = () => {
    setReplayState('idle');
    setActiveCity('All');
    map.current?.fitBounds(TRIP_BOUNDS, {
      padding: { top: 150, bottom: 150, left: 50, right: 50 },
      maxZoom: 8,
      duration: reducedMotion ? 0 : 1300,
      essential: false
    });
  };

  const replayStop = JOURNEY_STOPS[replayIndex];
  const replayIsActive = replayState === 'playing' || replayState === 'paused';

  return (
    <div className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#09090b] text-[#f7f4ee]">
      <div ref={mapContainer} className="atlas-map h-full w-full" />

      {mapError && <div role="alert" className="absolute inset-x-4 top-24 z-30 mx-auto max-w-md rounded-xl border border-[#c86d51]/60 bg-[#09090b]/95 px-4 py-3 text-center text-xs text-[#f4b4a1] shadow-2xl">{mapError}</div>}

      <div className="pointer-events-none absolute left-4 right-4 top-20 z-10 flex flex-wrap items-start justify-between gap-3 sm:left-8 sm:right-8">
        <div className="pointer-events-auto max-w-md rounded-2xl border border-[#d4af37]/30 bg-[#09090b]/88 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-cinzel font-bold uppercase tracking-widest text-[#d4af37]"><Compass size={14} /><span>Interactive Sacred Atlas</span></div>
          <h1 className="mt-0.5 font-cinzel text-lg font-bold text-[#f7f4ee] sm:text-xl">Kashi × Ayodhya Geographic Explorer</h1>
          <p className="mt-1 text-[11px] leading-relaxed text-[#b8b3a5]">Verified places and visit order, October 16–20, 2026. The gold line shows the documented sequence; road-level transit data is not available.</p>
        </div>

        <div className="pointer-events-auto flex max-w-full flex-col gap-2 rounded-2xl border border-white/10 bg-[#09090b]/88 p-2 shadow-2xl backdrop-blur-md sm:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl border border-white/5 bg-black/40 p-1 text-xs">
              {(['All', 'Varanasi', 'Ayodhya'] as const).map((city) => (
                <button key={city} onClick={() => handleCityFilter(city)} aria-pressed={activeCity === city} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${activeCity === city ? 'bg-[#d4af37] font-bold text-[#09090b] shadow' : 'text-[#b8b3a5] hover:text-[#f7f4ee]'}`}>{city}</button>
              ))}
            </div>
            <button onClick={resetView} title="Reset overview view" className="rounded-xl border border-white/10 bg-white/5 p-2 text-[#b8b3a5] transition-colors hover:bg-white/10 hover:text-[#f7f4ee]" aria-label="Reset overview view"><RotateCcw size={15} /></button>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Journey replay controls">
            <button onClick={startOrResumeReplay} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-cinzel font-bold uppercase tracking-wider transition-all ${replayState === 'playing' ? 'bg-[#c86d51] text-white' : 'bg-[#d4af37] text-[#09090b] hover:bg-[#e5c378]'}`}>
              {replayState === 'playing' ? <Pause size={14} /> : <Play size={14} />}<span>{replayState === 'playing' ? 'Pause' : replayState === 'paused' ? 'Resume' : 'Replay journey'}</span>
            </button>
            <button onClick={restartReplay} title="Restart replay" className="rounded-xl border border-white/10 bg-white/5 p-2 text-[#b8b3a5] transition-colors hover:bg-white/10 hover:text-[#f7f4ee]" aria-label="Restart replay"><RotateCcw size={14} /></button>
            <button onClick={skipReplayStop} disabled={replayState === 'complete'} title="Skip to next verified stop" className="rounded-xl border border-white/10 bg-white/5 p-2 text-[#b8b3a5] transition-colors hover:bg-white/10 hover:text-[#f7f4ee] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Skip to next verified stop"><SkipForward size={14} /></button>
            <span className="ml-1 text-[10px] text-[#c5a059]" aria-live="polite">{replayState === 'complete' ? 'Journey complete' : `${replayIndex + 1} / ${JOURNEY_STOPS.length}`}</span>
          </div>
        </div>
      </div>

      {selectedPlace && (
        <aside className="absolute bottom-4 left-4 right-4 z-20 rounded-3xl border border-[#d4af37]/40 bg-[#09090b]/95 p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:bottom-6 sm:left-8 sm:right-auto sm:w-[420px] sm:p-5">
          <button onClick={() => setSelectedPlace(null)} className="absolute right-3 top-3 rounded-full bg-white/5 p-1.5 text-[#b8b3a5] transition-colors hover:bg-white/10 hover:text-white" aria-label="Close location preview"><X size={16} /></button>
          <div className="mb-3 flex items-center gap-2 pr-8 text-[10px] font-cinzel uppercase tracking-[0.16em] text-[#d4af37]"><span className="h-px w-5 bg-[#d4af37]" /><MapPin size={12} /><span>{selectionSource === 'replay' ? 'Replay stop linked to marker' : 'Selected map marker'}</span></div>
          <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            <img src={selectedPlace.coverImage} alt={selectedPlace.name} className="h-full w-full object-cover" />
            <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-black/65 px-2.5 py-1 text-[10px] font-cinzel uppercase tracking-wider text-[#d4af37] backdrop-blur-md"><CalendarDays size={11} /><span>{selectedPlace.date}</span></div>
            {selectedPlace.timeOfDay && <div className="absolute bottom-2.5 right-2.5 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] text-[#f7f4ee]">{selectedPlace.timeOfDay}</div>}
          </div>
          {replayIsActive && selectedPlace.id === replayStop.id && <div className="mb-3 flex items-center justify-between rounded-xl border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-2 text-[11px] text-[#f3e5ab]"><span className="font-cinzel">Replay stop {replayIndex + 1} of {JOURNEY_STOPS.length}</span><span>{selectedPlace.city}</span></div>}
          <h2 className="font-cinzel text-lg font-bold text-[#f7f4ee] sm:text-xl">{selectedPlace.name}</h2>
          <div className="mt-0.5 mb-2 font-devanagari text-sm font-medium text-[#c5a059]">{selectedPlace.hindiName}</div>
          <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-[#b8b3a5]">{selectedPlace.summary}</p>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-[#b8b3a5]"><span className="font-mono text-[#c5a059]">{selectedPlace.coordinates[1].toFixed(4)}° N, {selectedPlace.coordinates[0].toFixed(4)}° E</span><Link to={`/places/${selectedPlace.slug}`} className="flex items-center gap-1 text-xs font-cinzel font-semibold text-[#d4af37] hover:underline"><span>View Full Place</span><ChevronRight size={14} /></Link></div>
        </aside>
      )}

      <div className="absolute bottom-6 right-8 z-10 hidden max-w-lg gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#09090b]/80 p-2 backdrop-blur-md md:flex">
        {displayedLocations.map((location) => <button key={location.id} onClick={() => handleSelectLocation(location, 'dock')} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition-all ${selectedPlace?.id === location.id ? 'bg-[#d4af37] font-bold text-[#09090b] shadow' : 'bg-white/5 text-[#b8b3a5] hover:bg-white/10 hover:text-[#f7f4ee]'}`}><span className={`h-2 w-2 rounded-full ${selectedPlace?.id === location.id ? 'bg-[#09090b]' : 'bg-[#d4af37]'}`} /><span>{location.name.split(' ')[0]}</span></button>)}
      </div>
    </div>
  );
};
