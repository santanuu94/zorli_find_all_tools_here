import React, { ReactNode } from 'react';
import { Clock, Shield, Sparkles } from 'lucide-react';

interface ToolWorkspaceProps {
  title: string;
  badge?: string;
  statusText?: string;
  children: ReactNode;
  sidebar?: ReactNode;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  title,
  badge = 'Architecture Ready',
  statusText = 'Modular workspace loaded. Client-side processing engine activates in the next phase.',
  children,
  sidebar,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#0D1438] border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden p-6 sm:p-8 md:p-10 transition-colors">
      {/* Workspace Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-slate-800 dark:text-slate-100 mb-8">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                100% Client-Side
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{statusText}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
            {badge}
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className={`grid grid-cols-1 ${sidebar ? 'lg:grid-cols-12 gap-8' : 'gap-6'}`}>
        <div className={sidebar ? 'lg:col-span-8' : ''}>{children}</div>
        {sidebar && <div className="lg:col-span-4 space-y-6">{sidebar}</div>}
      </div>
    </div>
  );
};
