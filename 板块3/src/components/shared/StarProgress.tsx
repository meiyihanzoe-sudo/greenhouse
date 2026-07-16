/**
 * 星星进度 — 板块3 实现
 *
 * 显示星星计数 + 进度条。
 * 约束：字体 ≥ 20px，触控区域 ≥ 48px。
 */

export interface StarProgressProps {
  current: number;
  total: number;
}

export function StarProgress({ current, total }: StarProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const completed = current >= total;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* 星星图标 + 数字 */}
      <div
        className="flex items-center gap-3"
        role="status"
        aria-label={`星星进度：${current} / ${total}`}
      >
        <span className="text-4xl" aria-hidden="true">
          {completed ? '🌟' : '⭐'}
        </span>
        <span
          className={`text-3xl font-bold tabular-nums ${
            completed ? 'text-yellow-500' : 'text-gray-700'
          }`}
          style={{ fontSize: '28px' }}
        >
          {current}
          <span className="text-lg text-gray-400 font-normal"> / {total}</span>
        </span>
      </div>

      {/* 进度条 */}
      <div className="w-full max-w-sm">
        <div
          className="h-3 rounded-full bg-gray-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`已完成 ${percentage}%`}
        >
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              completed
                ? 'bg-yellow-400'
                : 'bg-gradient-to-r from-yellow-400 to-orange-400'
            }`}
            style={{ width: `${percentage}%`, minWidth: current > 0 ? '8px' : '0' }}
          />
        </div>
      </div>

      {/* 文案 */}
      <p className="text-base text-gray-500" style={{ fontSize: '18px' }}>
        {completed
          ? '🎉 全部完成！你太厉害了！'
          : `还剩 ${total - current} 个场景，继续加油！`}
      </p>
    </div>
  );
}
