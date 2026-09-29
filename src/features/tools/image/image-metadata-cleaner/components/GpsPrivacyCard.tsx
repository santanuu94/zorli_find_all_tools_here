import React from 'react';
import { MapPin, ShieldAlert, Compass } from 'lucide-react';
import { GpsCoordinates } from '../types';

interface GpsPrivacyCardProps {
  gps: GpsCoordinates;
}

export const GpsPrivacyCard: React.FC<GpsPrivacyCardProps> = ({ gps }) => {
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-slate-800 dark:text-slate-100 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <span>⚠ Precise Location Information Found</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Anyone with access to this photo can determine the exact geographic coordinates where it was taken.
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 text-[10px] font-bold uppercase tracking-wider">
          High Sensitivity
        </span>
      </div>

      {/* Coordinate Values Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
        <div className="p-3 rounded-2xl bg-white/60 dark:bg-black/30 border border-rose-500/20">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
            Latitude
          </span>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
            {gps.formattedLat}
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            {gps.latitude.toFixed(6)}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white/60 dark:bg-black/30 border border-rose-500/20">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
            Longitude
          </span>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
            {gps.formattedLng}
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            {gps.longitude.toFixed(6)}
          </span>
        </div>

        {gps.altitude !== undefined && (
          <div className="p-3 rounded-2xl bg-white/60 dark:bg-black/30 border border-rose-500/20">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
              Altitude / Elevation
            </span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {Math.round(gps.altitude)} meters
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              above sea level
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 italic">
        <Compass className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        <span>Coordinates are displayed locally. Zorli never sends your location data to any external mapping or tracking API.</span>
      </div>
    </div>
  );
};
