export interface SocialPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  aspectRatioLabel: string;
  description: string;
}

export interface SocialPlatform {
  id: string;
  name: string;
  presets: SocialPreset[];
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    presets: [
      {
        id: 'youtube-video',
        name: 'YouTube Video',
        width: 1920,
        height: 1080,
        aspectRatioLabel: '16:9',
        description: 'Standard 1080p Landscape Video Canvas',
      },
      {
        id: 'youtube-shorts',
        name: 'YouTube Shorts',
        width: 1080,
        height: 1920,
        aspectRatioLabel: '9:16',
        description: 'Vertical Full Screen Video / Short',
      },
      {
        id: 'youtube-thumbnail',
        name: 'YouTube Thumbnail',
        width: 1280,
        height: 720,
        aspectRatioLabel: '16:9',
        description: 'Standard HD 720p Video Thumbnail',
      },
      {
        id: 'youtube-banner',
        name: 'YouTube Channel Banner',
        width: 2560,
        height: 1440,
        aspectRatioLabel: '16:9',
        description: 'Desktop & TV Channel Art Header',
      },
      {
        id: 'youtube-avatar',
        name: 'YouTube Profile Picture',
        width: 800,
        height: 800,
        aspectRatioLabel: '1:1',
        description: 'Circular Profile Picture / Channel Icon',
      },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    presets: [
      {
        id: 'instagram-post-square',
        name: 'Instagram Post — Square',
        width: 1080,
        height: 1080,
        aspectRatioLabel: '1:1',
        description: 'Standard Feed Square Photo',
      },
      {
        id: 'instagram-post-portrait',
        name: 'Instagram Post — Portrait',
        width: 1080,
        height: 1350,
        aspectRatioLabel: '4:5',
        description: 'Vertical Feed Post (Maximum Screen Real Estate)',
      },
      {
        id: 'instagram-post-landscape',
        name: 'Instagram Post — Landscape',
        width: 1080,
        height: 566,
        aspectRatioLabel: '1.91:1',
        description: 'Wide Horizontal Feed Post',
      },
      {
        id: 'instagram-story',
        name: 'Instagram Story',
        width: 1080,
        height: 1920,
        aspectRatioLabel: '9:16',
        description: 'Full Screen 24h Vertical Story',
      },
      {
        id: 'instagram-reel',
        name: 'Instagram Reel',
        width: 1080,
        height: 1920,
        aspectRatioLabel: '9:16',
        description: 'Vertical Reels & Highlights Cover',
      },
      {
        id: 'instagram-avatar',
        name: 'Instagram Profile Picture',
        width: 320,
        height: 320,
        aspectRatioLabel: '1:1',
        description: 'Circular Account Avatar',
      },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    presets: [
      {
        id: 'facebook-post',
        name: 'Facebook Post',
        width: 1200,
        height: 630,
        aspectRatioLabel: '1.91:1',
        description: 'Standard Timeline & Feed Shared Image',
      },
      {
        id: 'facebook-story',
        name: 'Facebook Story',
        width: 1080,
        height: 1920,
        aspectRatioLabel: '9:16',
        description: 'Vertical Mobile Story',
      },
      {
        id: 'facebook-cover',
        name: 'Facebook Cover Photo',
        width: 820,
        height: 312,
        aspectRatioLabel: '2.63:1',
        description: 'Page & Profile Header Banner',
      },
      {
        id: 'facebook-avatar',
        name: 'Facebook Profile Picture',
        width: 170,
        height: 170,
        aspectRatioLabel: '1:1',
        description: 'Profile Icon on Desktop & Mobile',
      },
      {
        id: 'facebook-event-cover',
        name: 'Facebook Event Cover',
        width: 1920,
        height: 1005,
        aspectRatioLabel: '1.91:1',
        description: 'Event Page Banner Header',
      },
      {
        id: 'facebook-ad',
        name: 'Facebook Ad / Feed Image',
        width: 1080,
        height: 1080,
        aspectRatioLabel: '1:1',
        description: 'Square Sponsored & Carousel Feed Ad',
      },
    ],
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    presets: [
      {
        id: 'twitter-post',
        name: 'X Post Image',
        width: 1200,
        height: 675,
        aspectRatioLabel: '16:9',
        description: 'In-Stream Tweet & Post Image',
      },
      {
        id: 'twitter-header',
        name: 'X Header / Cover',
        width: 1500,
        height: 500,
        aspectRatioLabel: '3:1',
        description: 'Profile Header Banner',
      },
      {
        id: 'twitter-avatar',
        name: 'X Profile Picture',
        width: 400,
        height: 400,
        aspectRatioLabel: '1:1',
        description: 'Circular Profile Picture',
      },
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    presets: [
      {
        id: 'linkedin-post',
        name: 'LinkedIn Post',
        width: 1200,
        height: 627,
        aspectRatioLabel: '1.91:1',
        description: 'Feed Landscape Shared Image',
      },
      {
        id: 'linkedin-cover',
        name: 'LinkedIn Cover Banner',
        width: 1584,
        height: 396,
        aspectRatioLabel: '4:1',
        description: 'Personal Profile Background Banner',
      },
      {
        id: 'linkedin-avatar',
        name: 'LinkedIn Profile Picture',
        width: 400,
        height: 400,
        aspectRatioLabel: '1:1',
        description: 'Square / Round Professional Avatar',
      },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    presets: [
      {
        id: 'tiktok-video',
        name: 'TikTok Video / Story',
        width: 1080,
        height: 1920,
        aspectRatioLabel: '9:16',
        description: 'Full-Screen Vertical Video',
      },
      {
        id: 'tiktok-avatar',
        name: 'TikTok Profile Picture',
        width: 200,
        height: 200,
        aspectRatioLabel: '1:1',
        description: 'Profile Avatar Photo',
      },
    ],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    presets: [
      {
        id: 'pinterest-pin-standard',
        name: 'Pinterest Standard Pin',
        width: 1000,
        height: 1500,
        aspectRatioLabel: '2:3',
        description: 'Optimal Vertical Pin Format',
      },
      {
        id: 'pinterest-pin-square',
        name: 'Pinterest Square Pin',
        width: 1000,
        height: 1000,
        aspectRatioLabel: '1:1',
        description: 'Square Product & Carousel Pin',
      },
      {
        id: 'pinterest-board-cover',
        name: 'Pinterest Board Cover',
        width: 600,
        height: 600,
        aspectRatioLabel: '1:1',
        description: 'Board Display Cover Tile',
      },
    ],
  },
];
