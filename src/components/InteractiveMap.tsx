import React, { useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import { useLanguage } from '../contexts/LanguageContext';

const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // User needs to provide this
const MASJID_POSITION = { lat: 9.0617, lng: 38.7178 };

const MapController = ({ onUpdate }: { onUpdate: (pitch: number, bearing: number) => void }) => {
  const map = useMap();
  const { t } = useLanguage();

  const handle3DView = useCallback(() => {
    if (!map) return;
    
    // In Google Maps: pitch is tilt, bearing is heading
    map.setTilt(60);
    map.setHeading(-20);
    onUpdate(60, -20);
  }, [map, onUpdate]);

  const handleReset = useCallback(() => {
    if (!map) return;
    map.setTilt(0);
    map.setHeading(0);
    onUpdate(0, 0);
  }, [map, onUpdate]);

  return (
    <div className="absolute top-16 left-4 z-10 flex flex-col gap-2">
      <div className="flex gap-2">
        <button 
          onClick={handle3DView}
          className="bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px] text-white px-3 py-2 rounded-[8px] text-[12px] font-medium border border-transparent hover:bg-black transition-all flex items-center gap-2 shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
          {t('map.3d')}
        </button>
        <button 
          onClick={handleReset}
          className="bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px] text-white px-3 py-2 rounded-[8px] text-[12px] font-medium border border-transparent hover:bg-black transition-all flex items-center gap-2 shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          {t('map.reset')}
        </button>
      </div>
    </div>
  );
};

const InteractiveMap = () => {
  const [pitch, setPitch] = useState(0);
  const [bearing, setBearing] = useState(0);

  const updateStats = useCallback((p: number, b: number) => {
    setPitch(p);
    setBearing(b);
  }, []);

  return (
    <div className="relative w-full h-full">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={MASJID_POSITION}
          defaultZoom={17}
          mapId="bf51a910020fa566" // Need a valid Map ID for 3D/Advanced Markers
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          className="w-full h-full"
        >
          <MapController onUpdate={updateStats} />
          <AdvancedMarker position={MASJID_POSITION}>
            <Pin background={'#0071e3'} glyphColor={'#fff'} borderColor={'#0066cc'} />
          </AdvancedMarker>
        </Map>
      </APIProvider>

      {/* Stats Box overlay */}
      <div className="absolute top-[110px] left-4 z-10">
        <div className="bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px] rounded-[8px] border border-transparent px-3 py-2 font-mono text-[10px] text-white/80 shadow-xl min-w-[150px]">
          <div className="flex justify-between gap-4">
            <span>Pitch: <span className="text-white">{pitch}°</span></span>
            <span>Bearing: <span className="text-white">{bearing}°</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
