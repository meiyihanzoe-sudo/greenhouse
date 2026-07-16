/**
 * 成就系统 + 每日任务 — 类型定义
 */

import type { GameProgress, Collectible, PlanetProgress } from '@/types';

// ==================== 成就 ====================

/** 成就解锁条件上下文 */
export interface AchievementContext {
  gameProgress: GameProgress[];
  collectibles: Collectible[];
  planetProgress: PlanetProgress[];
  currentSceneId: string;
  currentCategory: string;
  combo: number;
  todayCompletedScenes: number;
  todayVisitedPlanets: string[];
  planetPerfectRun?: boolean;
  planetPerfectCategory?: string;
}

/** 成就定义 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'exploration' | 'skill' | 'collection' | 'persistence' | 'special';
  /** 解锁条件 — 纯函数 */
  condition: (ctx: AchievementContext) => boolean;
  /** 进度 0-100 — 纯函数 */
  progress: (ctx: AchievementContext) => number;
  /** 隐藏成就？未解锁时不展示详情 */
  hidden?: boolean;
}

/** 成就进度 — 持久化在 IndexedDB */
export interface AchievementProgress {
  achievementId: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
}

/** 成就解锁事件 — 用于弹窗通知 */
export interface AchievementUnlockEvent {
  achievementId: string;
  timestamp: number;
}

// ==================== 每日任务 ====================

/** 每日任务定义 */
export interface DailyTask {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  reward: number;
  getProgress: (ctx: AchievementContext) => number;
}

/** 每日任务进度 */
export interface DailyTaskProgress {
  date: string;
  tasks: {
    taskId: string;
    current: number;
    target: number;
    completed: boolean;
    rewardClaimed: boolean;
  }[];
}

// ==================== 辅助 ====================

/** 成就分类中文名 */
export const ACHIEVEMENT_CATEGORY_NAMES: Record<string, string> = {
  exploration: '🌍 探索',
  skill: '🎯 技能',
  collection: '💎 收集',
  persistence: '🔥 毅力',
  special: '⭐ 特殊',
};
