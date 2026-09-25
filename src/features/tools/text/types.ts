import { Tool } from '../../../types';

export interface TextToolOptions {
  caseFormat?: 'uppercase' | 'lowercase' | 'title' | 'camel' | 'snake' | 'kebab';
  paragraphs?: number;
  countSpaces?: boolean;
}

export type TextToolMetadata = Tool;
