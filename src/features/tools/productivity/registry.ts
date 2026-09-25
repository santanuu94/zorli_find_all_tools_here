import { ToolModule, ToolFamilyRegistry } from '../types';

export const PRODUCTIVITY_TOOL_MODULES: ToolModule[] = [];

export const PRODUCTIVITY_FAMILY: ToolFamilyRegistry = {
  family: 'productivity',
  name: 'Productivity Tools',
  description: 'Timers, checklists, converters, and quick daily workflow helpers.',
  tools: PRODUCTIVITY_TOOL_MODULES,
};
