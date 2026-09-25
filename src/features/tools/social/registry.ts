import { ToolModule, ToolFamilyRegistry } from '../types';
import * as InstagramGridMaker from './instagram-grid-maker';

export const SOCIAL_TOOL_MODULES: ToolModule[] = [
  InstagramGridMaker,
];

export const SOCIAL_FAMILY: ToolFamilyRegistry = {
  family: 'social',
  name: 'Social Media Tools',
  description: 'Design banners, split profile grids, and optimize graphics for social channels.',
  tools: SOCIAL_TOOL_MODULES,
};
