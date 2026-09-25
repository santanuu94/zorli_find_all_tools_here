import { ToolModule, ToolFamilyRegistry } from '../types';

export const CONVERTER_TOOL_MODULES: ToolModule[] = [];

export const CONVERTER_FAMILY: ToolFamilyRegistry = {
  family: 'converter',
  name: 'Converter Tools',
  description: 'Convert between file formats, document types, and digital encodings.',
  tools: CONVERTER_TOOL_MODULES,
};
