/**
 * AchievementSummary — 家长回顾页底部成就摘要区块
 *
 * 显示：已解锁成就数、最近解锁的3个、今日任务完成情况
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_ACHIEVEMENTS } from '../achievements';
import { getTodayStr, getTodayTasks, mergeTaskProgress } from './dailyTasks';
import {
  getAchievementProgress,
  getDailyTaskProgress,
  getGameProgress,
  getCollectibles,
  getPlanetProgress,
} from '@/lib/storage';
import type { AchievementProgress, AchievementContext } from './types';

export function AchievementSummary() {
  const navigate = useNavigate();
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [recentIcons, setRecentIcons] = useState<string[]>([]);
  const [todayDone, setTodayDone] = useState(0);
  const [todayTotal, setTodayTotal] = useState(3);

  useEffect(() => {
    (async () => {
      try {
        const [progressList, gameProgress, collectibles, planetProgress, dailyProgress] =
          await Promise.all([
            getAchievementProgress(),
            getGameProgress(),
            getCollectibles(),
            getPlanetProgress(),
            getDailyTaskProgress(getTodayStr()),
          ]);

        // 解锁数
        const unlocked = progressList.filter((p) => p.unlocked);
        setUnlockedCount(unlocked.length);

        // 最近3个解锁的
        const sorted = [...unlocked].sort(
          (a, b) => (b.unlockedAt ?? 0) - (a.unlockedAt ?? 0),
        );
        const icons = sorted.slice(0, 3).map((p) => {
          const ach = ALL_ACHIEVEMENTS.find((a) => a.id === p.achievementId);
          return ach?.icon ?? '⭐';
        });
        setRecentIcons(icons);

        // 今日任务
        const todayTasks = getTodayTasks();
        const ctx: AchievementContext = {
          gameProgress,
          collectibles,
          planetProgress,
          currentSceneId: '',
          currentCategory: '',
          combo: 0,
          todayCompletedScenes: gameProgress.filter((p) => p.completed).length,
          todayVisitedPlanets: [],
        };
        const merged = mergeTaskProgress(todayTasks, ctx, dailyProgress ?? null);
        setTodayTotal(merged.tasks.length);
        setTodayDone(merged.tasks.filter((t) => t.completed).length);
      } catch {
        // 静默降级
      }
    })();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <h3 className="font-bold text-gray-800" style={{ fontSize: '22px' }}>
        🏆 成就摘要
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <p className="text-3xl font-bold text-indigo-600" style={{ fontSize: '32px' }}>
            {unlockedCount}
          </p>
          <p className="text-sm text-indigo-500" style={{ fontSize: '16px' }}>
            已解锁成就
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-3xl font-bold text-green-600" style={{ fontSize: '32px' }}>
            {todayDone}/{todayTotal}
          </p>
          <p className="text-sm text-green-500" style={{ fontSize: '16px' }}>
            今日任务
          </p>
        </div>
      </div>

      {recentIcons.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500" style={{ fontSize: '16px' }}>
            最近获得：
          </span>
          {recentIcons.map((icon, i) => (
            <span key={i} className="text-2xl">{icon}</span>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/game/achievements')}
        className="w-full py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium transition-colors"
        style={{ fontSize: '20px', minHeight: '52px' }}
      >
        查看全部成就 →
      </button>
    </div>
  );
}
