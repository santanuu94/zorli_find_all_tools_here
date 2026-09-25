import { Tool } from '../../types';
import { SOCIAL_TOOL_MODULES } from '../../features/tools/social';

export const socialTools: Tool[] = SOCIAL_TOOL_MODULES.map((m) => m.metadata);
