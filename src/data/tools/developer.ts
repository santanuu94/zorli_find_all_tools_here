import { Tool } from '../../types';
import { DEVELOPER_TOOL_MODULES } from '../../features/tools/developer';

export const developerTools: Tool[] = DEVELOPER_TOOL_MODULES.map((m) => m.metadata);
