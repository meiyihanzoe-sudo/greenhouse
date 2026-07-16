/**
 * 激烈程度徽章 — 板块1 使用
 *
 * 视觉：L0🟢 / L1🟡 / L2🟠 / L3🔴 + 脉动动画
 * 约束：字体 ≥ 20px，高对比度
 */

import type { ArousalLevel } from '@/types';

export interface ArousalBadgeProps {
  level: ArousalLevel;
  /** 是否显示脉动动画（L2/L3 时推荐开启） */
  pulse?: boolean;
}

const LEVEL_CONFIG: Record<ArousalLevel, { label: string; bg: string; text: string; dot: string }> = {
  L0: { label: '平静', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  L1: { label: '轻度', bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  L2: { label: '中度', bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  L3: { label: '高度', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
};

export function ArousalBadge({ level, pulse = false }: ArousalBadgeProps) {
  const config = LEVEL_CONFIG[level];
  const pulseClass = pulse && (level === 'L2' || level === 'L3')
    ? 'animate-pulse'
    : '';

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xl font-bold ${config.bg} ${config.text} ${pulseClass}`}
      role="status"
      aria-label={`激烈程度：${config.label}`}
    >
      <span className={`w-3 h-3 rounded-full ${config.dot}`} />
      <span>{level}</span>
      <span className="text-base font-normal opacity-75">{config.label}</span>
    </div>
  );
}
