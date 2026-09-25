import React, { useState } from 'react';
import { Key, ShieldAlert } from 'lucide-react';
import { ToolComponentProps } from '../../types';
import { ToolWorkspace } from '../../common/ToolWorkspace';

export const JwtDebugger: React.FC<ToolComponentProps> = () => {
  const [token] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIFpvcmxpIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4z9gW...'
  );

  return (
    <ToolWorkspace
      title="JWT Inspector & Payload Decoder"
      sidebar={
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            Security Notice
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Tokens are decoded strictly in your local browser sandbox. Never paste production secrets or private keys into unverified sites.
          </p>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Encoded JWT Token
          </label>
          <textarea
            rows={4}
            defaultValue={token}
            className="w-full font-mono text-xs rounded-xl p-3 bg-slate-50 dark:bg-[#070B24] border border-slate-200 dark:border-white/10 text-emerald-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <h4 className="text-xs font-bold text-rose-500 mb-2 font-mono">HEADER: ALGORITHM & TOKEN TYPE</h4>
            <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
            </pre>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <h4 className="text-xs font-bold text-purple-500 mb-2 font-mono">PAYLOAD: DATA</h4>
            <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
{`{
  "sub": "1234567890",
  "name": "Alice Zorli",
  "iat": 1516239022
}`}
            </pre>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
};
