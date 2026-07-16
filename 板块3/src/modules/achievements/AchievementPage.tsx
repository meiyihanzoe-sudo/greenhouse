/**
 * AchievementPage — 成就页面
 *
 * Tab 切换：成就墙 | 每日任务
 * 从 IndexedDB 读取进度数据，不依赖 Zustand。
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_ACHIEVEMENTS, getAchievementById } from '../achievements';
import { getTodayTasks, getTodayStr, mergeTaskProgress, getTaskById } from './dailyTasks';
import {
  getAchievementProgress,
  saveAllAchievementProgress,
  getDailyTaskProgress,
  saveDailyTaskProgress,
  getGameProgress,
  getCollectibles,
  getPlanetProgress,
  saveCollectible,
} from '@/lib/storage';
import { AchievementBadge } from './AchievementBadge';
import { DailyTaskList } from './DailyTaskList';
import { ACHIEVEMENT_CATEGORY_NAMES } from './types';
import type { AchievementProgress, AchievementContext } from './types';

export default function AchievementPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'achievements' | 'daily'>('achievements');
  const [progressMap, setProgressMap] = useState<Record<string, AchievementProgress>>({});
  const [dailyTasks, setDailyTasks] = useState<any[]>([]);
  const [dailyProgress, setDailyProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      const [apList, gameProgress, collectibles, planetProgress, dpData] = await Promise.all([
        getAchievementProgress(),
        getGameProgress(),
        getCollectibles(),
        getPlanetProgress(),
        getDailyTaskProgress(getTodayStr()),
      ]);

      // 成就进度映射
      const map: Record<string, AchievementProgress> = {};
      for (const ap of apList) {
        map[ap.achievementId] = ap;
      }
      setProgressMap(map);

      // 每日任务
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
      const todayTasks = getTodayTasks();
      const merged = mergeTaskProgress(todayTasks, ctx, dpData ?? null);
      setDailyTasks(todayTasks);
      setDailyProgress(merged);
    } catch {
      // 静默降级
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 领取每日任务奖励
  const handleClaimReward = useCallback(
    async (taskId: string) => {
      if (!dailyProgress) return;
      const task = getTaskById(taskId);
      if (!task) return;

      // 更新任务进度
      const updated = {
        ...dailyProgress,
        tasks: dailyProgress.tasks.map((t: any) =>
          t.taskId === taskId ? { ...t, rewardClaimed: true } : t,
        ),
      };
      setDailyProgress(updated);
      await saveDailyTaskProgress(updated);

      // 添加奖励星星
      await saveCollectible({
        type: 'star',
        sceneId: `daily-${taskId}-${getTodayStr()}`,
        earnedAt: Date.now(),
      });
    },
    [dailyProgress],
  );

  // 按分类分组成就
  const grouped = ALL_ACHIEVEMENTS.reduce(
    (acc, a) => {
      const cat = a.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(a);
      return acc;
    },
    {} as Record<string, typeof ALL_ACHIEVEMENTS>,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50">
        <p className="text-2xl text-gray-400" style={{ fontSize: '24px' }}>
          加载中...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/game')}
            className="flex items-center gap-2 px-4 py-2 text-base text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white/50 transition-colors"
            style={{ fontSize: '18px', minHeight: '48px' }}
          >
            ← 星球地图
          </button>
          <h1 className="text-xl font-bold text-gray-800" style={{ fontSize: '24px' }}>
            🏆 成就与任务
          </h1>
        </div>

        {/* Tab 切换 */}
        <div className="flex rounded-2xl bg-white p-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'achievements'
                ? 'bg-indigo-500 text-white shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ fontSize: '20px', minHeight: '48px' }}
          >
            🏅 成就墙
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'daily'
                ? 'bg-indigo-500 text-white shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ fontSize: '20px', minHeight: '48px' }}
          >
            📋 每日任务
          </button>
        </div>

        {/* 内容区 */}
        {activeTab === 'achievements' ? (
          <div className="space-y-6">
            {Object.entries(grouped).map(([cat, achievements]) => (
              <div key={cat}>
                <h2
                  className="font-bold text-gray-700 mb-3"
                  style={{ fontSize: '22px' }}
                >
                  {ACHIEVEMENT_CATEGORY_NAMES[cat] || cat}
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((a) => (
                    <AchievementBadge
                      key={a.id}
                      achievement={a}
                      progress={progressMap[a.id]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DailyTaskList
            tasks={dailyTasks}
            progress={dailyProgress}
            onClaimReward={handleClaimReward}
          />
        )}
      </div>
    </div>
  );
}
