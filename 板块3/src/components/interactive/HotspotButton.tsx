/**
 * HotspotButton — 插画中的单个可交互热点按钮
 *
 * ASD 友好设计：
 *   - 最小 48x48px 触摸目标
 *   - 温和脉冲动画（非闪烁）
 *   - 支持 prefers-reduced-motion
 *   - 高对比度模式下边框加粗
 */

import type { IllustrationHotspot } from '@/types';

interface HotspotButtonProps {
  hotspot: IllustrationHotspot;
  disabled: boolean;
  /** 容器实际宽度（px） */
  containerWidth: number;
  /** 容器实际高度（px） */
  containerHeight: number;
  onClick: () => void;
}

export function HotspotButton({
  hotspot,
  disabled,
  containerWidth,
  containerHeight,
  onClick,
}: HotspotButtonProps) {
  // 百分比坐标 → 实际像素
  const left = (hotspot.x / 100) * containerWidth;
  const top = (hotspot.y / 100) * containerHeight;
  const width = Math.max((hotspot.width / 100) * containerWidth, 48);
  const height = Math.max((hotspot.height / 100) * containerHeight, 48);

  const animClass =
    hotspot.hintAnimation === 'pulse'
      ? 'animate-hotspot-pulse'
      : hotspot.hintAnimation === 'bounce'
        ? 'animate-hotspot-bounce'
        : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hotspot-button absolute flex items-center justify-center rounded-full
        border-2 border-indigo-400/50 bg-indigo-400/15
        hover:bg-indigo-400/30 hover:border-indigo-400/80
        active:scale-110 active:bg-indigo-400/40
        disabled:opacity-30 disabled:cursor-not-allowed disabled:animate-none
        transition-all duration-300 cursor-pointer
        ${animClass}`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        fontSize: '20px',
      }}
      aria-label={hotspot.label}
      title={hotspot.label}
    >
      <span className="pointer-events-none text-xl" aria-hidden="true">
        {hotspot.label.split(' ')[0]}
      </span>
    </button>
  );
}
