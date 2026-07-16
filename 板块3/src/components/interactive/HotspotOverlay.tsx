/**
 * HotspotOverlay — 插画上方的热点覆盖层
 *
 * 根据容器实际尺寸计算每个热点的像素位置。
 * 仅在 disabled=false（即 waitingForAnswer 状态）时渲染热点。
 */

import { useRef, useState, useEffect } from 'react';
import type { IllustrationAsset } from '@/types';
import { HotspotButton } from './HotspotButton';

interface HotspotOverlayProps {
  illustration: IllustrationAsset;
  disabled: boolean;
  onHotspotClick: (optionIndex: number) => void;
}

export function HotspotOverlay({
  illustration,
  disabled,
  onHotspotClick,
}: HotspotOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      setContainerSize({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 无有效尺寸时不渲染
  if (containerSize.width === 0 || containerSize.height === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      aria-label="互动区域：点击画面中的人物来做出选择"
    >
      {illustration.hotspots.map((hotspot) => (
        <HotspotButton
          key={hotspot.id}
          hotspot={hotspot}
          disabled={disabled}
          containerWidth={containerSize.width}
          containerHeight={containerSize.height}
          onClick={() => onHotspotClick(hotspot.linkedOptionIndex)}
        />
      ))}
    </div>
  );
}
