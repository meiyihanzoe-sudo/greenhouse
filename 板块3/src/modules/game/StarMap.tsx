/**
 * 星球地图 — 替代列表式 GameHome 的视觉化地图
 *
 * 展示 4 颗语言星球的线性旅程：
 *   地球（起点）→ 问候星 → 感谢星 → 情绪星 → 表达星 → 回家（终点）
 *
 * 严肃温暖风格，星球间用连线连接。
 * ASD 友好：字体 ≥ 20px，按钮 ≥ 48px。
 */

import { useNavigate } from 'react-router-dom';
import { PlanetNode, type PlanetState } from './PlanetNode';
import { StarProgress } from '@/components/shared/StarProgress';
import { PLANET_NAMES, PLANET_EMOJIS, PLANET_SUBTITLES, DIFFICULTY_LABELS } from '@/types';
import type { PlanetProgress, DifficultyLevel } from '@/types';
import { useState } from 'react';

interface StarMapProps {
  stars: number;
  totalScenes: number;
  planetProgress: PlanetProgress[];
  collectibles: { type: string }[];
  currentSceneIndex: number;
  hasSeenIntro: boolean;
  hasAssessment: boolean;
  difficultyLevel?: DifficultyLevel;
  onStartScene: (sceneId: string) => void;
  onShowIntro: () => void;
  onParentReview: () => void;
  onReassess?: () => void;
}

const PLANET_ORDER = ['greeting', 'thanks', 'emotion', 'request'];

/** 获取星球状态 */
function getPlanetState(
  index: number,
  planetProgress: PlanetProgress[],
  currentSceneIndex: number
): PlanetState {
  const category = PLANET_ORDER[index];
  const planet = planetProgress.find((p) => p.category === category);

  if (planet?.completed) return 'completed';

  // 前一星球未完成 → locked（第一个星球始终 available）
  if (index > 0) {
    const prevPlanet = planetProgress.find((p) => p.category === PLANET_ORDER[index - 1]);
    if (!prevPlanet?.completed) return 'locked';
  }

  // 当前场景属于这个星球 → in_progress
  if (planet && planet.completedScenes > 0) return 'in_progress';

  return 'available';
}

export default function StarMap({
  stars,
  totalScenes,
  planetProgress,
  collectibles,
  currentSceneIndex,
  hasSeenIntro,
  hasAssessment,
  difficultyLevel = 'sprout',
  onStartScene,
  onShowIntro,
  onParentReview,
  onReassess,
}: StarMapProps) {
  const navigate = useNavigate();
  const [pressTimer, setPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [pressProgress, setPressProgress] = useState(0);

  // 统计收集物
  const shiningStars = collectibles.filter((c) => c.type === 'shining_star').length;
  const planetHearts = collectibles.filter((c) => c.type === 'planet_heart').length;

  const handlePlanetClick = (category: string, state: PlanetState) => {
    if (state === 'locked') return;
    // 直接导航到该星球的场景（跳过详情卡中间步骤）
    const sceneId = `${category === 'greeting' ? 'greet' : category === 'thanks' ? 'thanks' : category === 'emotion' ? 'emotion' : 'need'}-01`;
    navigate(`/game/${sceneId}`);
  };

  // 家长入口长按逻辑
  const handleParentPressStart = () => {
    const timer = setInterval(() => {
      setPressProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          onParentReview();
          return 0;
        }
        return p + 5;
      });
    }, 150);
    setPressTimer(timer);
  };

  const handleParentPressEnd = () => {
    if (pressTimer) clearInterval(pressTimer);
    setPressTimer(null);
    setPressProgress(0);
  };

  const allPlanetsCompleted = planetProgress.every((p) => p.completed);
  const planetHeartsFull = planetHearts >= 4;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-6">
        {/* 标题 */}
        <div className="text-center space-y-1">
          <h1
            className="text-3xl font-bold text-gray-800"
            style={{ fontSize: '32px' }}
          >
            🚀 星语冒险
          </h1>
          <p
            className="text-gray-400"
            style={{ fontSize: '18px' }}
          >
            星宝的宇宙旅程
          </p>
        </div>

        {/* 状态栏 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span
              className="font-semibold text-gray-700"
              style={{ fontSize: '20px' }}
            >
              星光能量
            </span>
            <span style={{ fontSize: '18px' }}>
              ⭐ {stars}
              {shiningStars > 0 && <span className="text-yellow-500 ml-1">🌟 {shiningStars}</span>}
              <span className="text-purple-400 ml-1">💎 {planetHearts}/4</span>
            </span>
          </div>
          <StarProgress current={stars} total={totalScenes} />
          {/* v4: 难度等级 + 重新评估 */}
          <div className="flex items-center gap-2">
            {hasAssessment && (
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700"
                style={{ fontSize: '16px' }}
              >
                {DIFFICULTY_LABELS[difficultyLevel]}
              </span>
            )}
            {onReassess && (
              <button
                onClick={onReassess}
                className="ml-auto px-3 py-1 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 text-sm transition-colors"
                style={{ fontSize: '16px', minHeight: '36px' }}
              >
                🔄 重新评估
              </button>
            )}
          </div>
          {/* v3: 成就入口 */}
          <button
            onClick={() => navigate('/game/achievements')}
            className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-medium transition-colors"
            style={{ fontSize: '20px', minHeight: '48px' }}
          >
            🏆 成就与任务
          </button>
        </div>

        {/* 故事回看按钮 */}
        {hasSeenIntro && (
          <div className="text-center">
            <button
              onClick={onShowIntro}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              style={{ fontSize: '18px', minHeight: '48px' }}
            >
              📜 回看星宝的故事
            </button>
          </div>
        )}

        {/* 星球地图 */}
        <div className="relative space-y-0">
          {/* 起点：地球 */}
          <div className="flex justify-center py-3">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-green-50 border border-green-200">
              <span className="text-2xl" aria-hidden="true">🏠</span>
              <span className="font-semibold text-green-700" style={{ fontSize: '20px' }}>
                地球 · 起点
              </span>
              <span className="text-sm text-green-500">✅</span>
            </div>
          </div>

          {/* 星球列表 + 连线 */}
          {PLANET_ORDER.map((category, index) => {
            const state = getPlanetState(index, planetProgress, currentSceneIndex);
            const planet = planetProgress.find((p) => p.category === category);

            return (
              <div key={category}>
                {/* 连线 */}
                <div className="flex justify-center py-1">
                  <div className="relative flex flex-col items-center">
                    {/* 竖线 */}
                    <div
                      className="w-0.5 h-8"
                      style={{
                        background:
                          state === 'completed' || state === 'in_progress'
                            ? 'linear-gradient(180deg, #667eea, #764ba2)'
                            : 'linear-gradient(180deg, #d1d5db, #e5e7eb)',
                        borderStyle: state === 'locked' ? 'dashed' : 'solid',
                      }}
                    />
                    {/* 小圆点 */}
                    <div
                      className={`w-3 h-3 rounded-full ${
                        state === 'completed'
                          ? 'bg-yellow-400'
                          : state === 'in_progress'
                            ? 'bg-indigo-400'
                            : 'bg-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* 星球节点 */}
                <div className="px-2">
                  <PlanetNode
                    category={category}
                    state={state}
                    progress={planet}
                    onClick={() => handlePlanetClick(category, state)}
                  />
                </div>
              </div>
            );
          })}

          {/* 终点：回家 */}
          <div className="flex justify-center py-1">
            <div className="relative flex flex-col items-center">
              <div
                className={`w-0.5 h-8 ${
                  allPlanetsCompleted
                    ? 'bg-gradient-to-b from-yellow-400 to-yellow-200'
                    : 'bg-gray-200 border-dashed'
                }`}
                style={{ borderStyle: allPlanetsCompleted ? 'solid' : 'dashed' }}
              />
              <div
                className={`w-3 h-3 rounded-full ${
                  allPlanetsCompleted ? 'bg-yellow-400' : 'bg-gray-300'
                }`}
              />
            </div>
          </div>
          <div className="flex justify-center py-3">
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
                allPlanetsCompleted
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {allPlanetsCompleted ? '🏠' : '🔒'}
              </span>
              <span
                className="font-semibold"
                style={{ fontSize: '20px', color: allPlanetsCompleted ? '#b45309' : '#9ca3af' }}
              >
                回家！
              </span>
              {allPlanetsCompleted && (
                <span className="text-sm text-yellow-500">✨</span>
              )}
            </div>
          </div>
        </div>

        {/* 全部完成 — 结局提示 */}
        {allPlanetsCompleted && planetHeartsFull && (
          <div
            className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl border-2 border-yellow-300 p-6 text-center space-y-3"
            style={{ animation: 'fadeInUp 0.5s ease-out' }}
          >
            <p className="text-4xl">🏆</p>
            <p
              className="text-2xl font-bold text-yellow-700"
              style={{ fontSize: '26px' }}
            >
              四颗星球全部点亮！
            </p>
            <p
              className="text-gray-600"
              style={{ fontSize: '20px' }}
            >
              星宝收集了满满的星光能量，可以回家了！
            </p>
            <button
              onClick={() => navigate('/game')}
              className="w-full py-4 text-xl font-bold rounded-2xl text-white shadow-md"
              style={{
                fontSize: '22px',
                minHeight: '56px',
                background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
              }}
            >
              🏠 回家！
            </button>
          </div>
        )}

        {/* 家长入口 */}
        <div className="text-center pt-4 pb-8">
          <button
            onMouseDown={handleParentPressStart}
            onMouseUp={handleParentPressEnd}
            onMouseLeave={handleParentPressEnd}
            onTouchStart={handleParentPressStart}
            onTouchEnd={handleParentPressEnd}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 text-gray-400 hover:text-gray-600 transition-colors"
            style={{ fontSize: '18px', minHeight: '48px' }}
            aria-label="家长入口，长按3秒进入"
          >
            <span>👨‍👩‍👧</span>
            <span>家长入口</span>
            {pressProgress > 0 && (
              <div className="absolute bottom-0 left-0 h-1 bg-indigo-400 rounded-full transition-all" style={{ width: `${pressProgress}%` }} />
            )}
          </button>
          <p className="text-xs text-gray-300 mt-1" style={{ fontSize: '14px' }}>
            长按 3 秒进入
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
