import { useState } from 'react';
import { ToolState } from '../types';

export function useTool() {
  const [state, setState] = useState<ToolState>({
    isLoading: false,
    error: null,
  });

  return { state, setState };
}
