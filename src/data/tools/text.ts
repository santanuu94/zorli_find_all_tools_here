import { Tool } from '../../types';
import { TEXT_TOOL_MODULES } from '../../features/tools/text';

export const textTools: Tool[] = TEXT_TOOL_MODULES.map((m) => m.metadata);
