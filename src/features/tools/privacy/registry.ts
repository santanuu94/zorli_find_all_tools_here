import { ToolModule, ToolFamilyRegistry } from '../types';

export const PRIVACY_TOOL_MODULES: ToolModule[] = [];

export const PRIVACY_FAMILY: ToolFamilyRegistry = {
  family: 'privacy',
  name: 'Privacy & Security Tools',
  description: 'Password generators, hash generators, metadata strippers, and privacy helpers.',
  tools: PRIVACY_TOOL_MODULES,
};
