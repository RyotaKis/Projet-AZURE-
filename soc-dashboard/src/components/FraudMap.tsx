import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Info, Crosshair } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapMarker {
  id: string;
  coordinates: [number, number];
  severity: 'safe' | 'warning' | 'Critique';
  city: string;
}

const initialMarkers: MapMarker[] = [
  { id: '1', coordinates: [-74.006, 40.7128], severity: 'Critique', city: 'New York' },
  { id: '2', coordinates: [2.3522, 48.8566], severity: 'warning', city: 'Paris' },
  { id: '3', coordinates: [139.6503, 35.6762], severity: 'safe', city: 'Tokyo' },
  { id: '4', coordinates: [-0.1278, 51.5074], severity: 'safe', city: 'London' },
  { id: '5', coordinates: [-46.6333, -23.5505], severity: 'Critique', city: 'SÃ£o Paulo' },
  { id: '6', coordinates: [151.2093, -33.8688], severity: 'warning', city: 'Sydney' },
];

export const FraudMap: React.FC = () => {
  const [markers, setMarkers] = useState<MapMarker[]>(initialMarkers);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMarker: MapMarker = {
        id: Math.random().toString(),
        coordinates: [
          (Math.random() - 0.5) * 360,
          (Math.random() - 0.5) * 160
        ],
        severity: Math.random() > 0.8 ? 'Critique' : Math.random() > 0.6 ? 'warning' : 'safe',
        city: 'Roaming Event'
      };
      setMarkers(prev => [newMarker, ...prev.slice(0, 8)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0F172A] rounded border border-slate-800 overflow-hidden flex flex-col h-full shadow-2xl relative">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest leading-none flex items-center gap-2">
          <MapIcon className="w-3 h-3 text-blue-500" />
          Carte Globale des Fraudes <span className="font-normal text-slate-500">â€” Événements en direct</span>
        </h3>
      </div>

      <div className="flex-1 bg-[#0F172A]">
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#334155', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map(({ id, coordinates, severity }) => (
            <Marker key={id} coordinates={coordinates}>
              <motion.circle
                initial={{ r: 0 }}
                animate={{ 
                  r: severity === 'Critique' ? [4, 8, 4] : 3,
                }}
                transition={{ duration: 2, repeat: Infinity }}
                fill={severity === 'Critique' ? '#F43F5E' : severity === 'warning' ? '#F59E0B' : '#10B981'}
                stroke="white"
                strokeWidth={0.5}
              />
              {severity === 'Critique' && (
                <motion.circle
                  initial={{ r: 4, opacity: 1 }}
                  animate={{ r: 24, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth={1}
                />
              )}
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md p-2 rounded border border-slate-700/50 text-[8px] uppercase font-bold tracking-tighter text-slate-400 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Nominal
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Suspect
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Critique
        </div>
      </div>
    </div>
  );
};
