import { ToolModule, ToolFamilyRegistry } from '../types';
import * as PercentageCalculator from './percentage-calculator';
import * as AspectRatioCalculator from './aspect-ratio-calculator';

export const CALCULATOR_TOOL_MODULES: ToolModule[] = [
  PercentageCalculator,
  AspectRatioCalculator,
];

export const CALCULATOR_FAMILY: ToolFamilyRegistry = {
  family: 'calculators',
  name: 'Calculators',
  description: 'Fast, accurate calculation tools for percentages, ratios, finances, and measurements.',
  tools: CALCULATOR_TOOL_MODULES,
};
