import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { ParsedMetadataReport } from '../types';

interface MetadataSummaryBannerProps {
  report: ParsedMetadataReport;
}

export const MetadataSummaryBanner: React.FC<MetadataSummaryBannerProps> = ({ report }) => {
  const hasMetadata = report.hasSupportedMetadata;
  const hasSensitive = (report.sensitiveFieldCount || 0) > 0 || Boolean(report.gps);

  if (!hasMetadata) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-800 dark:text-slate-100 flex items-start gap-3.5 animate-in fade-in duration-200">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            No supported metadata detected
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            This image does not contain EXIF, GPS, camera, or author metadata recognized by Zorli's scanner. Your image is clean of supported tracking tags.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200 ${
        hasSensitive
          ? 'bg-amber-500/10 border-amber-500/20 text-slate-800 dark:text-slate-100'
          : 'bg-indigo-500/10 border-indigo-500/20 text-slate-800 dark:text-slate-100'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            hasSensitive
              ? 'bg-amber-500/20 text-amber-500'
              : 'bg-indigo-500/20 text-indigo-400'
          }`}
        >
          {hasSensitive ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <ShieldAlert className="w-5 h-5" />
          )}
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={`text-sm font-bold ${
                hasSensitive
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-indigo-700 dark:text-indigo-400'
              }`}
            >
              {hasSensitive
                ? 'Privacy-sensitive information detected'
                : 'Metadata detected'}
            </h4>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                hasSensitive
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                  : 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              {report.totalFieldCount} {report.totalFieldCount === 1 ? 'field' : 'fields'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {hasSensitive
              ? 'Exact GPS coordinates or personal identity tags were found embedded in this file.'
              : 'Camera settings, technical profiles, and device information are embedded in this file.'}
          </p>

          {/* Quick Category Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
            {report.categories.map((c) => (
              <span
                key={c.id}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                  c.isSensitive
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                    : 'bg-slate-200/60 dark:bg-white/5 border-slate-300/80 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                {c.title} ({c.fields.length})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
