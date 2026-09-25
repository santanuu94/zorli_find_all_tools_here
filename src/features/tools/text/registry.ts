import { ToolModule, ToolFamilyRegistry } from '../types';
import * as WordCounter from './word-counter';
import * as CaseConverter from './case-converter';
import * as LoremIpsumGenerator from './lorem-ipsum-generator';

export const TEXT_TOOL_MODULES: ToolModule[] = [
  WordCounter,
  CaseConverter,
  LoremIpsumGenerator,
];

export const TEXT_FAMILY: ToolFamilyRegistry = {
  family: 'text',
  name: 'Text Tools',
  description: 'Analyze, count, convert casing, and generate mock content for your writing.',
  tools: TEXT_TOOL_MODULES,
};
