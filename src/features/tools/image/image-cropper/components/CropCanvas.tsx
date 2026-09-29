import React, { useEffect, useRef, useState } from 'react';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { CroppedImageItem, CropTransformSettings } from '../types';
import { createTransformedCanvas } from '../lib/cropper';
import { Maximize2, ZoomIn, ZoomOut, Eye } from 'lucide-react';

interface CropCanvasProps {
  item: CroppedImageItem;
  settings: CropTransformSettings;
  crop: Crop | undefined;
  completedCrop: PixelCrop | undefined;
  onCropChange: (crop: Crop) => void;
  onCropComplete: (crop: PixelCrop) => void;
  onImageLoaded?: (img: HTMLImageElement) => void;
  onSeeOutput?: () => void;
  disabled?: boolean;
}

// Helper to center initial crop box
function createInitialCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect?: number
): Crop {
  if (aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  // Free crop: 85% centered
  return {
    unit: '%',
    x: 7.5,
    y: 7.5,
    width: 85,
    height: 85,
  };
}

export const CropCanvas: React.FC<CropCanvasProps> = ({
  item,
  settings,
  crop,
  completedCrop,
  onCropChange,
  onCropComplete,
  onImageLoaded,
  onSeeOutput,
  disabled = false,
}) => {
  const [editorSrc, setEditorSrc] = useState<string>(item.previewUrl);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeBlobUrlRef = useRef<string | null>(null);

  // Generate transformed image source whenever rotation or flip changes
  useEffect(() => {
    let isCancelled = false;

    if (settings.rotation === 0 && !settings.flipH && !settings.flipV) {
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
        activeBlobUrlRef.current = null;
      }
      setEditorSrc(item.previewUrl);
      return;
    }

    const baseImg = new Image();
    baseImg.onload = () => {
      if (isCancelled) return;
      try {
        const transformedCanvas = createTransformedCanvas(
          baseImg,
          settings.rotation,
          settings.flipH,
          settings.flipV
        );
        transformedCanvas.toBlob((blob) => {
          if (isCancelled || !blob) return;
          if (activeBlobUrlRef.current) {
            URL.revokeObjectURL(activeBlobUrlRef.current);
          }
          const tempUrl = URL.createObjectURL(blob);
          activeBlobUrlRef.current = tempUrl;
          setEditorSrc(tempUrl);
        }, 'image/png');
      } catch (err) {
        setEditorSrc(item.previewUrl);
      }
    };
    baseImg.src = item.previewUrl;

    return () => {
      isCancelled = true;
    };
  }, [item.previewUrl, settings.rotation, settings.flipH, settings.flipV]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
    };
  }, []);

  // Handle image load inside the crop view
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    imgRef.current = img;
    if (onImageLoaded) {
      onImageLoaded(img);
    }

    const { width, height, naturalWidth, naturalHeight } = img;
    if (width > 0 && height > 0 && naturalWidth > 0 && naturalHeight > 0) {
      const initial = createInitialCrop(width, height, settings.aspectRatio);
      onCropChange(initial);
      const naturalCrop = convertToPixelCrop(initial, naturalWidth, naturalHeight);
      onCropComplete(naturalCrop);
    }
  };

  // Re-adjust crop when aspect ratio changes
  useEffect(() => {
    if (imgRef.current) {
      const img = imgRef.current;
      const { width, height, naturalWidth, naturalHeight } = img;
      if (width > 0 && height > 0 && naturalWidth > 0 && naturalHeight > 0) {
        const updated = createInitialCrop(width, height, settings.aspectRatio);
        onCropChange(updated);
        const naturalCrop = convertToPixelCrop(updated, naturalWidth, naturalHeight);
        onCropComplete(naturalCrop);
      }
    }
  }, [settings.aspectRatio, settings.aspectRatioId, onCropChange, onCropComplete]);

  // Real crop dimensions for display
  const cropWidth = completedCrop ? Math.round(completedCrop.width) : 0;
  const cropHeight = completedCrop ? Math.round(completedCrop.height) : 0;

  return (
    <div className="flex flex-col rounded-3xl bg-slate-900/90 border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-2xl">
      {/* Editor Canvas Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/60 border-b border-white/10 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
            {item.originalName}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-mono uppercase">
            {item.originalFormat}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {cropWidth > 0 && cropHeight > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>
                {cropWidth} × {cropHeight} px
              </span>
            </div>
          )}
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Zoom: {Math.round(settings.zoom * 100)}%
          </span>

          {onSeeOutput && (
            <button
              type="button"
              onClick={onSeeOutput}
              disabled={disabled}
              className="py-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              title="See output preview and download"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>See Output</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Image Cropper Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex-1 p-4 sm:p-8 min-h-[360px] sm:min-h-[480px] max-h-[680px] overflow-auto flex items-center justify-center bg-slate-950/40 select-none"
      >
        <div
          style={{
            transform: `scale(${settings.zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative inline-block max-w-full"
        >
          <ReactCrop
            crop={crop}
            onChange={(c) => onCropChange(c)}
            onComplete={(c, percentCrop) => {
              if (imgRef.current && percentCrop && percentCrop.width && percentCrop.height) {
                const naturalCrop = convertToPixelCrop(
                  percentCrop,
                  imgRef.current.naturalWidth,
                  imgRef.current.naturalHeight
                );
                onCropComplete(naturalCrop);
              } else {
                onCropComplete(c);
              }
            }}
            aspect={settings.aspectRatio}
            disabled={disabled}
            className="rounded-lg overflow-hidden shadow-2xl"
          >
            <img
              ref={imgRef}
              src={editorSrc}
              alt={item.originalName}
              onLoad={handleImageLoad}
              crossOrigin="anonymous"
              className="max-h-[55vh] max-w-full object-contain block"
              style={{
                pointerEvents: disabled ? 'none' : 'auto',
              }}
            />
          </ReactCrop>
        </div>
      </div>
    </div>
  );
};
