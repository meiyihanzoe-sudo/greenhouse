/**
 * AchievementBadge — 单个成就徽章
 *
 * 三种状态：
 *   locked  — 灰色，隐藏成就显示「？」
 *   in_progress — 半透明 + 进度环
 *   unlocked — 全彩色 + 图标 + 名称 + 解锁日期
 */

import type { Achievement, AchievementProgress } from './types';

interface AchievementBadgeProps {
  achievement: Achievement;
  progress: AchievementProgress | undefined;
}

export function AchievementBadge({ achievement, progress }: AchievementBadgeProps) {
  const unlocked = progress?.unlocked ?? false;
  const pct = progress?.progress ?? 0;
  const unlockedAt = progress?.unlockedAt;

  // 隐藏成就且未解锁
  if (achievement.hidden && !unlocked) {
    return (
      <div
        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-100 border-2 border-gray-200 min-h-[110px]"
        style={{ minWidth: '80px' }}
      >
        <span className="text-3xl text-gray-400" aria-hidden="true">❓</span>
        <span className="text-sm text-gray-400 mt-1" style={{ fontSize: '16px' }}>
          神秘成就
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all min-h-[110px] ${
        unlocked
          ? 'bg-gradient-to-b from-yellow-50 to-amber-50 border-yellow-300 shadow-sm'
          : 'bg-gray-50 border-gray-200 opacity-80'
      }`}
      style={{ minWidth: '80px' }}
    >
      {/* 图标 */}
      <span
        className={`text-3xl mb-1 ${unlocked ? '' : 'grayscale opacity-50'}`}
        aria-hidden="true"
      >
        {achievement.icon}
      </span>

      {/* 名称 */}
      <span
        className={`font-semibold text-center ${
          unlocked ? 'text-yellow-700' : 'text-gray-500'
        }`}
        style={{ fontSize: '16px' }}
      >
        {unlocked ? achievement.name : achievement.name}
      </span>

      {/* 进度环（未解锁时） */}
      {!unlocked && pct > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-400 h-2 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* 解锁日期 */}
      {unlocked && unlockedAt && (
        <span className="text-xs text-yellow-500 mt-1" style={{ fontSize: '13px' }}>
          {new Date(unlockedAt).toLocaleDateString('zh-CN')}
        </span>
      )}

      {/* 描述（解锁后） */}
      {unlocked && (
        <span className="text-xs text-gray-500 text-center mt-1" style={{ fontSize: '13px' }}>
          {achievement.description}
        </span>
      )}
    </div>
  );
}
