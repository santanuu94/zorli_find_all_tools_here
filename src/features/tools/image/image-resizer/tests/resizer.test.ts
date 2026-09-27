import {
  calculateTargetDimensions,
  generateResizedFilename,
  getOutputMimeType,
  PRESET_DIMENSIONS,
  SOCIAL_PLATFORMS,
} from '../lib/resizer';
import { ResizeSettings } from '../types';

describe('Image Resizer Math & Logic', () => {
  const defaultSettings: ResizeSettings = {
    mode: 'custom',
    customWidth: 1200,
    customHeight: 900,
    lockAspectRatio: true,
    primaryDimension: 'width',
    percentage: 100,
    presetId: 'common-1080p',
    socialPlatformId: 'youtube',
    presetFitMode: 'fit',
    dontEnlarge: false,
    quality: 90,
  };

  test('Mode A: Custom dimensions with aspect ratio locked (calculates height from width)', () => {
    // 4000x3000 (4:3), user requests 1200 width
    const result = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'custom',
      customWidth: 1200,
      primaryDimension: 'width',
      lockAspectRatio: true,
    });

    expect(result.targetWidth).toBe(1200);
    expect(result.targetHeight).toBe(900);
  });

  test('Mode A: Custom dimensions with aspect ratio locked (calculates width from height)', () => {
    // 4000x3000 (4:3), user requests 600 height
    const result = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'custom',
      customHeight: 600,
      primaryDimension: 'height',
      lockAspectRatio: true,
    });

    expect(result.targetWidth).toBe(800);
    expect(result.targetHeight).toBe(600);
  });

  test('Mode A: Custom dimensions unlocked allows freeform dimensions', () => {
    const result = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'custom',
      customWidth: 1200,
      customHeight: 500,
      lockAspectRatio: false,
    });

    expect(result.targetWidth).toBe(1200);
    expect(result.targetHeight).toBe(500);
  });

  test('Mode B: Percentage scaling scales both dimensions correctly', () => {
    // 4000x3000 at 50%
    const half = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'percentage',
      percentage: 50,
    });
    expect(half.targetWidth).toBe(2000);
    expect(half.targetHeight).toBe(1500);

    // 4000x3000 at 25%
    const quarter = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'percentage',
      percentage: 25,
    });
    expect(quarter.targetWidth).toBe(1000);
    expect(quarter.targetHeight).toBe(750);
  });

  test('Mode C: Presets with aspect ratio locked fits proportionally within bounds', () => {
    // 4000x3000 (4:3) into 1920x1080 (16:9 preset)
    const result = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'preset',
      presetId: 'common-1080p', // 1920x1080
      lockAspectRatio: true,
      presetFitMode: 'fit',
    });

    // 1080 * (4/3) = 1440 <= 1920
    expect(result.targetWidth).toBe(1440);
    expect(result.targetHeight).toBe(1080);
  });

  test('Mode C: Presets unlocked stretches to exact preset dimensions', () => {
    const result = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'preset',
      presetId: 'common-1080p', // 1920x1080
      lockAspectRatio: false,
      presetFitMode: 'stretch',
    });

    expect(result.targetWidth).toBe(1920);
    expect(result.targetHeight).toBe(1080);
  });

  test('Social Media mode: Instagram Post (1080x1080) targets exact 1080x1080 social canvas', () => {
    // 4000x3000 (4:3) into 1080x1080 square
    const fitResult = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'social',
      presetId: 'social-ig-post', // 1080x1080
      presetFitMode: 'fit',
    });

    // Exact 1080x1080 square canvas for Instagram
    expect(fitResult.targetWidth).toBe(1080);
    expect(fitResult.targetHeight).toBe(1080);

    // Stretch forces exact 1080x1080 canvas
    const stretchResult = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'social',
      presetId: 'social-ig-post',
      presetFitMode: 'stretch',
    });

    expect(stretchResult.targetWidth).toBe(1080);
    expect(stretchResult.targetHeight).toBe(1080);
  });

  test('16:9 image into 9:16 Instagram Reel yields exact 1080x1920 vertical canvas', () => {
    // 1920x1080 (16:9) into Instagram Reel (1080x1920, 9:16)
    const reelResult = calculateTargetDimensions(1920, 1080, {
      ...defaultSettings,
      mode: 'social',
      presetId: 'instagram-reel',
      presetFitMode: 'fit',
    });

    expect(reelResult.targetWidth).toBe(1080);
    expect(reelResult.targetHeight).toBe(1920);
  });

  test('Web mode: Website Hero (1600x900) calculates correctly', () => {
    const heroResult = calculateTargetDimensions(3200, 1800, {
      ...defaultSettings,
      mode: 'web',
      presetId: 'web-hero', // 1600x900
      presetFitMode: 'fit',
    });

    expect(heroResult.targetWidth).toBe(1600);
    expect(heroResult.targetHeight).toBe(900);
  });

  test('"Don\'t enlarge" option prevents upscaling when image is smaller than target', () => {
    // Original 800x600, requested 1200x900 with dontEnlarge = true
    const prevented = calculateTargetDimensions(800, 600, {
      ...defaultSettings,
      mode: 'custom',
      customWidth: 1200,
      customHeight: 900,
      lockAspectRatio: true,
      dontEnlarge: true,
    });

    expect(prevented.targetWidth).toBe(800);
    expect(prevented.targetHeight).toBe(600);

    // When dontEnlarge = false, upscaling IS allowed
    const allowed = calculateTargetDimensions(800, 600, {
      ...defaultSettings,
      mode: 'custom',
      customWidth: 1200,
      customHeight: 900,
      lockAspectRatio: true,
      dontEnlarge: false,
    });

    expect(allowed.targetWidth).toBe(1200);
    expect(allowed.targetHeight).toBe(900);
  });

  test('"Don\'t enlarge" in percentage mode prevents scaling > 100%', () => {
    const result = calculateTargetDimensions(800, 600, {
      ...defaultSettings,
      mode: 'percentage',
      percentage: 150,
      dontEnlarge: true,
    });

    expect(result.targetWidth).toBe(800);
    expect(result.targetHeight).toBe(600);
  });

  test('Input sanitization never produces zero, negative, or NaN dimensions', () => {
    const zeroResult = calculateTargetDimensions(0, -50, {
      ...defaultSettings,
      customWidth: -100,
      customHeight: 0,
    });

    expect(zeroResult.targetWidth).toBeGreaterThanOrEqual(1);
    expect(zeroResult.targetHeight).toBeGreaterThanOrEqual(1);
    expect(Number.isFinite(zeroResult.targetWidth)).toBe(true);
    expect(Number.isFinite(zeroResult.targetHeight)).toBe(true);
  });

  test('generateResizedFilename generates clean filenames', () => {
    expect(generateResizedFilename('photo.jpg', 'image/jpeg')).toBe('photo-resized.jpg');
    expect(generateResizedFilename('banner.png', 'image/png')).toBe('banner-resized.png');
    expect(generateResizedFilename('graphic.webp', 'image/webp')).toBe('graphic-resized.webp');
    expect(generateResizedFilename('complex.name.with.dots.jpg', 'image/jpeg')).toBe(
      'complex.name.with.dots-resized.jpg'
    );
  });

  test('getOutputMimeType preserves input format', () => {
    expect(getOutputMimeType('image/png', 'icon.png')).toBe('image/png');
    expect(getOutputMimeType('image/webp', 'photo.webp')).toBe('image/webp');
    expect(getOutputMimeType('image/jpeg', 'portrait.jpg')).toBe('image/jpeg');
    expect(getOutputMimeType('', 'fallback.png')).toBe('image/png');
  });

  test('Preset dimensions table has expected core presets', () => {
    const ids = PRESET_DIMENSIONS.map((p) => p.id);
    expect(ids).toContain('common-1080p');
    expect(ids).toContain('common-720p');
    expect(ids).toContain('common-1200x630');
    expect(ids).toContain('common-1080x1080');
    expect(ids).toContain('social-ig-post');
    expect(ids).toContain('social-ig-story');
    expect(ids).toContain('social-yt-thumb');
    expect(ids).toContain('social-fb-cover');
    expect(ids).toContain('social-li-post');
    expect(ids).toContain('web-hero');
    expect(ids).toContain('web-blog-image');
    expect(ids).toContain('web-blog-thumb');
  });

  test('SOCIAL_PLATFORMS contains valid scalable data for all major networks', () => {
    const platformIds = SOCIAL_PLATFORMS.map((p) => p.id);
    expect(platformIds).toContain('youtube');
    expect(platformIds).toContain('instagram');
    expect(platformIds).toContain('facebook');
    expect(platformIds).toContain('twitter');
    expect(platformIds).toContain('linkedin');
    expect(platformIds).toContain('tiktok');
    expect(platformIds).toContain('pinterest');

    // Every platform has at least 2 presets with positive integer dimensions
    SOCIAL_PLATFORMS.forEach((platform) => {
      expect(platform.presets.length).toBeGreaterThanOrEqual(2);
      platform.presets.forEach((preset) => {
        expect(preset.width).toBeGreaterThan(0);
        expect(preset.height).toBeGreaterThan(0);
        expect(preset.aspectRatioLabel).toBeDefined();
        expect(preset.name.length).toBeGreaterThan(0);
      });
    });
  });

  test('YouTube Thumbnail preset calculates exact 1280x720 in stretch mode and proportional in fit mode', () => {
    // 1920x1080 (16:9) into YouTube Thumbnail (1280x720, also 16:9)
    const fitSameRatio = calculateTargetDimensions(1920, 1080, {
      ...defaultSettings,
      mode: 'social',
      presetId: 'youtube-thumbnail',
      presetFitMode: 'fit',
    });
    expect(fitSameRatio.targetWidth).toBe(1280);
    expect(fitSameRatio.targetHeight).toBe(720);

    // 4000x3000 (4:3) into YouTube Thumbnail with stretch
    const stretchResult = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'social',
      presetId: 'youtube-thumbnail',
      presetFitMode: 'stretch',
    });
    expect(stretchResult.targetWidth).toBe(1280);
    expect(stretchResult.targetHeight).toBe(720);
  });

  test('Instagram Reel preset calculates 1080x1920 canvas', () => {
    const reelResult = calculateTargetDimensions(1080, 1920, {
      ...defaultSettings,
      mode: 'social',
      presetId: 'instagram-reel',
      presetFitMode: 'fit',
    });
    expect(reelResult.targetWidth).toBe(1080);
    expect(reelResult.targetHeight).toBe(1920);
  });

  test('Manual override in preset mode respects custom width/height when manualOverride is true', () => {
    const overrideResult = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'social',
      presetId: 'youtube-thumbnail',
      presetFitMode: 'stretch',
      manualOverride: true,
      customWidth: 1000,
      customHeight: 600,
    });
    expect(overrideResult.targetWidth).toBe(1000);
    expect(overrideResult.targetHeight).toBe(600);
  });

  test('Web & Display mode: All core web presets return exact canvas dimensions', () => {
    const webHero = calculateTargetDimensions(1920, 1080, {
      ...defaultSettings,
      mode: 'web',
      presetId: 'web-hero',
    });
    expect(webHero.targetWidth).toBe(1600);
    expect(webHero.targetHeight).toBe(900);

    const webBanner = calculateTargetDimensions(1920, 1080, {
      ...defaultSettings,
      mode: 'web',
      presetId: 'web-banner',
    });
    expect(webBanner.targetWidth).toBe(1200);
    expect(webBanner.targetHeight).toBe(675);

    const blogImage = calculateTargetDimensions(1920, 1080, {
      ...defaultSettings,
      mode: 'web',
      presetId: 'web-blog-image',
    });
    expect(blogImage.targetWidth).toBe(1200);
    expect(blogImage.targetHeight).toBe(630);

    const blogThumb = calculateTargetDimensions(1920, 1080, {
      ...defaultSettings,
      mode: 'web',
      presetId: 'web-blog-thumb',
    });
    expect(blogThumb.targetWidth).toBe(600);
    expect(blogThumb.targetHeight).toBe(400);

    const common1080 = calculateTargetDimensions(4000, 3000, {
      ...defaultSettings,
      mode: 'web',
      presetId: 'common-1080p',
    });
    expect(common1080.targetWidth).toBe(1920);
    expect(common1080.targetHeight).toBe(1080);
  });

  test('Exact Pixels mode: preserves exact custom width and height without letterbox distortion', () => {
    // Unlocked freeform
    const freeform = calculateTargetDimensions(1920, 1080, {
      ...defaultSettings,
      mode: 'custom',
      customWidth: 800,
      customHeight: 600,
      lockAspectRatio: false,
    });
    expect(freeform.targetWidth).toBe(800);
    expect(freeform.targetHeight).toBe(600);

    // Locked aspect ratio from width
    const lockedWidth = calculateTargetDimensions(1920, 1080, {
      ...defaultSettings,
      mode: 'custom',
      customWidth: 960,
      primaryDimension: 'width',
      lockAspectRatio: true,
    });
    expect(lockedWidth.targetWidth).toBe(960);
    expect(lockedWidth.targetHeight).toBe(540);

    // Locked aspect ratio from height
    const lockedHeight = calculateTargetDimensions(1920, 1080, {
      ...defaultSettings,
      mode: 'custom',
      customHeight: 540,
      primaryDimension: 'height',
      lockAspectRatio: true,
    });
    expect(lockedHeight.targetWidth).toBe(960);
    expect(lockedHeight.targetHeight).toBe(540);
  });
});

