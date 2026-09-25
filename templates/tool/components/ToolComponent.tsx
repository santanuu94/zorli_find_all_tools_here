import React from 'react';
import { ToolComponentProps } from '../../../src/features/tools/types';
import { ToolWorkspace } from '../../../src/features/tools/common/ToolWorkspace';
import { useTool } from '../hooks/useTool';

export const ToolComponent: React.FC<ToolComponentProps> = ({ tool }) => {
  const { state } = useTool();

  return (
    <ToolWorkspace
      title={tool?.name || 'Tool Workspace'}
      sidebar={
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Options</h4>
          <p className="text-xs text-slate-400">Configure parameters here.</p>
        </div>
      }
    >
      <div className="p-8 text-center border-2 border-dashed border-slate-300 dark:border-white/15 rounded-2xl">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Tool Interface</h3>
        <p className="text-xs text-slate-500">Add interaction logic and user inputs here.</p>
      </div>
    </ToolWorkspace>
  );
};
