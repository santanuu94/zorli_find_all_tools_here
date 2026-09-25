import { ToolModule, ToolFamilyRegistry } from '../types';

export const DOWNLOADER_TOOL_MODULES: ToolModule[] = [];

export const DOWNLOADER_FAMILY: ToolFamilyRegistry = {
  family: 'downloader',
  name: 'Downloader Tools',
  description: 'Download and save media securely. Each utility undergoes independent review.',
  tools: DOWNLOADER_TOOL_MODULES,
};
