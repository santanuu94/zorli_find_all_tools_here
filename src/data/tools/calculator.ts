import { Tool } from '../../types';
import { CALCULATOR_TOOL_MODULES } from '../../features/tools/calculator';

export const calculatorTools: Tool[] = CALCULATOR_TOOL_MODULES.map((m) => m.metadata);
