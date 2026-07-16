/**
 * SceneIllustration — 场景插画渲染 + 热点覆盖
 *
 * 功能：
 *   - 渲染 AI 生成的插画（WebP，缩略图预加载）
 *   - 在插画上方覆盖可交互热点
 *   - 无插画时降级显示大号 emoji
 *   - 加载中显示缩略图 + 模糊过渡
 */

import { useState } from 'react';
import type { IllustrationAsset } from '@/types';
import { HotspotOverlay } from './HotspotOverlay';

interface SceneIllustrationProps {
  illustration: IllustrationAsset | undefined;
  emoji: string;
  title: string;
  disabled: boolean;
  onHotspotClick: (optionIndex: number) => void;
}

export function SceneIllustration({
  illustration,
  emoji,
  title,
  disabled,
  onHotspotClick,
}: SceneIllustrationProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // 无插画 → 降级为 emoji
  if (!illustration || illustration.generatedBy === 'none') {
    return (
      <div className="text-center py-4">
        <span className="text-6xl" aria-hidden="true">
          {emoji}
        </span>
        <h2
          className="text-2xl font-bold text-gray-800 mt-2"
          style={{ fontSize: '28px' }}
        >
          {title}
        </h2>
      </div>
    );
  }

  const aspectRatio = illustration.width / illustration.height;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ aspectRatio: `${aspectRatio}` }}
    >
      {/* 缩略图占位（模糊背景） */}
      {illustration.thumbnailUrl && !imageLoaded && (
        <img
          src={illustration.thumbnailUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
        />
      )}

      {/* 主图 */}
      <img
        src={illustration.imageUrl}
        alt={illustration.alt}
        loading="lazy"
        decoding="async"
        className={`relative w-full h-full object-cover rounded-2xl transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
      />

      {/* 热点覆盖层 */}
      {imageLoaded && (
        <HotspotOverlay
          illustration={illustration}
          disabled={disabled}
          onHotspotClick={onHotspotClick}
        />
      )}
    </div>
  );
}
