/**
 * 星球节点 — 星球地图上的单个星球
 *
 * 四种状态：locked / available / in_progress / completed
 * ASD 友好：字体 ≥ 20px，按钮 ≥ 48px。
 */

import type { PlanetProgress } from '@/types';
import { PLANET_NAMES, PLANET_EMOJIS, PLANET_SUBTITLES } from '@/types';

export type PlanetState = 'locked' | 'available' | 'in_progress' | 'completed';

interface PlanetNodeProps {
  category: string;
  state: PlanetState;
  progress: PlanetProgress | undefined;
  onClick?: () => void;
}

export function PlanetNode({ category, state, progress, onClick }: PlanetNodeProps) {
  const name = PLANET_NAMES[category] || category;
  const emoji = PLANET_EMOJIS[category] || '🌍';
  const subtitle = PLANET_SUBTITLES[category] || '';

  const completedScenes = progress?.completedScenes ?? 0;
  const totalScenes = progress?.totalScenes ?? 1;

  const isInteractive = state !== 'locked';

  return (
    <button
      onClick={isInteractive ? onClick : undefined}
      disabled={!isInteractive}
      className={`relative w-full max-w-sm mx-auto p-5 rounded-3xl transition-all duration-500 ${
        state === 'locked'
          ? 'bg-gray-100 cursor-not-allowed opacity-60'
          : state === 'completed'
            ? 'bg-yellow-50 border-2 border-yellow-300 shadow-md'
            : state === 'in_progress'
              ? 'bg-indigo-50 border-2 border-indigo-300 shadow-lg'
              : 'bg-white border-2 border-indigo-200 shadow-md hover:shadow-lg hover:border-indigo-400'
      }`}
      style={{ minHeight: '96px' }}
      aria-label={`${name}：${subtitle}${state === 'locked' ? '（未解锁）' : state === 'completed' ? '（已完成）' : ''}`}
    >
      {/* 呼吸光晕（进行中） */}
      {state === 'in_progress' && (
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            animation: 'planetPulse 2s ease-in-out infinite',
            background: 'transparent',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
          }}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* 星球图标 */}
        <div className="relative shrink-0">
          <span
            className={`text-4xl transition-all duration-300 ${
              state === 'completed' ? 'scale-110' : ''
            }`}
            aria-hidden="true"
          >
            {state === 'locked' ? '🔒' : state === 'completed' ? '⭐' : emoji}
          </span>
          {/* 完成标记 */}
          {state === 'completed' && (
            <span
              className="absolute -top-1 -right-1 text-sm"
              aria-hidden="true"
            >
              ✅
            </span>
          )}
        </div>

        {/* 星球信息 */}
        <div className="flex-1 text-left min-w-0">
          <p
            className="font-bold text-gray-800"
            style={{ fontSize: '22px' }}
          >
            {name}
          </p>
          <p
            className="text-gray-500 mt-0.5"
            style={{ fontSize: '18px' }}
          >
            {state === 'locked' ? '先完成上一个星球' : subtitle}
          </p>
          {/* 进度条 */}
          {state !== 'locked' && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round((completedScenes / totalScenes) * 100)}%`,
                    background:
                      state === 'completed'
                        ? 'linear-gradient(90deg, #f6d365, #fda085)'
                        : 'linear-gradient(90deg, #667eea, #764ba2)',
                  }}
                />
              </div>
              <span
                className="text-sm text-gray-400 shrink-0"
                style={{ fontSize: '16px' }}
              >
                {completedScenes}/{totalScenes}
              </span>
            </div>
          )}
        </div>

        {/* 状态图标 */}
        <span className="text-2xl shrink-0" aria-hidden="true">
          {state === 'completed' ? '💎' : state === 'in_progress' ? '▶' : state === 'available' ? '🚀' : ''}
        </span>
      </div>

      <style>{`
        @keyframes planetPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </button>
  );
}
