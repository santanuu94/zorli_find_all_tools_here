import { Tool } from '../../../types';

export interface SocialToolOptions {
  gridRows?: number;
  gridCols?: number;
  platform?: 'instagram' | 'tiktok' | 'twitter' | 'youtube';
}

export type SocialToolMetadata = Tool;
