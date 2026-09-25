import { Tool } from '../../types';
import { PDF_TOOL_MODULES } from '../../features/tools/pdf';

export const pdfTools: Tool[] = PDF_TOOL_MODULES.map((m) => m.metadata);
