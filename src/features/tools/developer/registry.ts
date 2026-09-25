import { ToolModule, ToolFamilyRegistry } from '../types';
import * as JsonFormatter from './json-formatter';
import * as Base64EncodeDecode from './base64-encode-decode';
import * as UrlEncoderDecoder from './url-encoder-decoder';
import * as JwtDebugger from './jwt-debugger';

export const DEVELOPER_TOOL_MODULES: ToolModule[] = [
  JsonFormatter,
  Base64EncodeDecode,
  UrlEncoderDecoder,
  JwtDebugger,
];

export const DEVELOPER_FAMILY: ToolFamilyRegistry = {
  family: 'developer',
  name: 'Developer Tools',
  description: 'Clean, format, debug, validate, and encode payloads right from your browser.',
  tools: DEVELOPER_TOOL_MODULES,
};
