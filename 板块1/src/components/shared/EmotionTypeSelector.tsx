/**
 * 情绪类型选择面板 — 板块1 使用
 *
 * 6 个大按钮（含 emoji + 文字），最小触摸目标 48×48px
 * 约束：这些是家长选择的分类，不是系统推测的情绪
 */

import { type EmotionType, EMOTION_TYPE_LABELS } from '@/types';

export interface EmotionTypeSelectorProps {
  onSelect: (type: EmotionType) => void;
  disabled?: boolean;
}

const EMOTION_TYPES: EmotionType[] = [
  'body_discomfort',
  'fear',
  'sad',
  'frustration',
  'over_excited',
  'unsure',
];

export function EmotionTypeSelector({ onSelect, disabled = false }: EmotionTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg text-gray-600">
        请选择孩子当前可能的情况（这是你的判断，不是系统推测）：
      </p>
      <div className="grid grid-cols-2 gap-3">
        {EMOTION_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            disabled={disabled}
            className="min-h-[56px] px-4 py-3 rounded-xl border-2 border-gray-200
                       bg-white hover:bg-gray-50 active:scale-[0.97]
                       text-xl font-medium text-gray-800
                       transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={EMOTION_TYPE_LABELS[type]}
          >
            {EMOTION_TYPE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
