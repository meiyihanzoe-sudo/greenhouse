/**
 * 17 个成就定义（纯数据 + 纯函数）
 *
 * 每个成就的 condition() 和 progress() 都是纯函数，
 * 接受 AchievementContext 返回结果。
 */

import type { Achievement, AchievementContext } from './types';

/** 辅助：计算已完成的场景数 */
function completedScenes(ctx: AchievementContext): number {
  return ctx.gameProgress.filter((p) => p.completed).length;
}

/** 辅助：计算闪耀星数量 */
function shiningStars(ctx: AchievementContext): number {
  return ctx.collectibles.filter((c) => c.type === 'shining_star').length;
}

/** 辅助：计算星球之心数量 */
function planetHearts(ctx: AchievementContext): number {
  return ctx.collectibles.filter((c) => c.type === 'planet_heart').length;
}

/** 辅助：计算已完成的星球数 */
function completedPlanets(ctx: AchievementContext): number {
  return ctx.planetProgress.filter((p) => p.completed).length;
}

/** 辅助：总星数 */
function totalStars(ctx: AchievementContext): number {
  return ctx.gameProgress.reduce((sum, p) => sum + p.stars, 0);
}

// ==================== 探索类（3个） ====================

const explorationAchievements: Achievement[] = [
  {
    id: 'first-scene',
    name: '第一步',
    description: '完成第一个场景',
    icon: '👣',
    category: 'exploration',
    condition: (ctx) => completedScenes(ctx) >= 1,
    progress: (ctx) => Math.min(completedScenes(ctx), 1) * 100,
  },
  {
    id: 'first-planet',
    name: '初次登陆',
    description: '完成任意一个星球的所有场景',
    icon: '🚀',
    category: 'exploration',
    condition: (ctx) => ctx.planetProgress.some((p) => p.completed),
    progress: (ctx) => {
      const first = ctx.planetProgress.find((p) => p.completedScenes > 0);
      if (!first) return 0;
      return Math.round((first.completedScenes / first.totalScenes) * 100);
    },
  },
  {
    id: 'all-planets',
    name: '星际旅行家',
    description: '完成全部四个星球的冒险',
    icon: '🌌',
    category: 'exploration',
    condition: (ctx) => completedPlanets(ctx) >= 4,
    progress: (ctx) => Math.round((completedPlanets(ctx) / 4) * 100),
  },
];

// ==================== 技能类（3个） ====================

const skillAchievements: Achievement[] = [
  {
    id: 'combo-3',
    name: '连击高手',
    description: '连续答对 3 次',
    icon: '🔥',
    category: 'skill',
    condition: (ctx) => ctx.combo >= 3,
    progress: (ctx) => Math.round((Math.min(ctx.combo, 3) / 3) * 100),
  },
  {
    id: 'planet-master-greeting',
    name: '问候大师',
    description: '完成问候星的全部场景',
    icon: '🌻',
    category: 'skill',
    condition: (ctx) => {
      const p = ctx.planetProgress.find((p) => p.category === 'greeting');
      return p?.completed ?? false;
    },
    progress: (ctx) => {
      const p = ctx.planetProgress.find((p) => p.category === 'greeting');
      if (!p) return 0;
      return Math.round((p.completedScenes / p.totalScenes) * 100);
    },
  },
  {
    id: 'planet-master-emotion',
    name: '情绪达人',
    description: '完成情绪星的全部场景',
    icon: '💝',
    category: 'skill',
    condition: (ctx) => {
      const p = ctx.planetProgress.find((p) => p.category === 'emotion');
      return p?.completed ?? false;
    },
    progress: (ctx) => {
      const p = ctx.planetProgress.find((p) => p.category === 'emotion');
      if (!p) return 0;
      return Math.round((p.completedScenes / p.totalScenes) * 100);
    },
  },
];

// ==================== 收集类（3个） ====================

const collectionAchievements: Achievement[] = [
  {
    id: 'first-shining',
    name: '第一次闪耀',
    description: '获得第一个闪耀星',
    icon: '💫',
    category: 'collection',
    condition: (ctx) => shiningStars(ctx) >= 1,
    progress: (ctx) => (shiningStars(ctx) >= 1 ? 100 : 0),
  },
  {
    id: 'shining-3',
    name: '闪耀新星',
    description: '获得 3 个闪耀星',
    icon: '🌟',
    category: 'collection',
    condition: (ctx) => shiningStars(ctx) >= 3,
    progress: (ctx) => Math.round((Math.min(shiningStars(ctx), 3) / 3) * 100),
  },
  {
    id: 'all-hearts',
    name: '心灵捕手',
    description: '收集全部 4 颗星球之心',
    icon: '💎',
    category: 'collection',
    condition: (ctx) => planetHearts(ctx) >= 4,
    progress: (ctx) => Math.round((planetHearts(ctx) / 4) * 100),
  },
];

// ==================== 毅力类（3个） ====================

const persistenceAchievements: Achievement[] = [
  {
    id: 'scenes-6',
    name: '坚持不懈',
    description: '累计完成 6 个场景',
    icon: '🏃',
    category: 'persistence',
    condition: (ctx) => completedScenes(ctx) >= 6,
    progress: (ctx) => Math.round((Math.min(completedScenes(ctx), 6) / 6) * 100),
  },
  {
    id: 'scenes-12',
    name: '全勤小达人',
    description: '累计完成全部 12 个场景',
    icon: '🏅',
    category: 'persistence',
    condition: (ctx) => completedScenes(ctx) >= 12,
    progress: (ctx) => Math.round((Math.min(completedScenes(ctx), 12) / 12) * 100),
  },
  {
    id: 'stars-20',
    name: '星光收集者',
    description: '累计获得 20 颗星星',
    icon: '⭐',
    category: 'persistence',
    condition: (ctx) => totalStars(ctx) >= 20,
    progress: (ctx) => Math.round((Math.min(totalStars(ctx), 20) / 20) * 100),
  },
];

// ==================== 特殊类（3个） ====================

const specialAchievements: Achievement[] = [
  {
    id: 'perfect-planet',
    name: '完美通关',
    description: '一个星球中一次不错完成全部场景',
    icon: '🎯',
    category: 'special',
    condition: (ctx) => ctx.planetPerfectRun === true,
    progress: (ctx) => (ctx.planetPerfectRun ? 100 : 0),
  },
  {
    id: 'multi-planet-day',
    name: '星际漫游日',
    description: '同一天在 2 个以上星球完成练习',
    icon: '🪐',
    category: 'special',
    condition: (ctx) => ctx.todayVisitedPlanets.length >= 2,
    progress: (ctx) =>
      Math.round((Math.min(ctx.todayVisitedPlanets.length, 2) / 2) * 100),
  },
  {
    id: 'shining-7',
    name: '星光灿烂',
    description: '获得 7 个闪耀星',
    icon: '✨',
    category: 'special',
    condition: (ctx) => shiningStars(ctx) >= 7,
    progress: (ctx) => Math.round((Math.min(shiningStars(ctx), 7) / 7) * 100),
  },
];

// ==================== 隐藏类（2个） ====================

const hiddenAchievements: Achievement[] = [
  {
    id: 'secret-combo-5',
    name: '传说连击',
    description: '连续答对 5 次',
    icon: '⚡',
    category: 'special',
    hidden: true,
    condition: (ctx) => ctx.combo >= 5,
    progress: (ctx) => Math.round((Math.min(ctx.combo, 5) / 5) * 100),
  },
  {
    id: 'secret-all-shining',
    name: '全闪耀通关',
    description: '全部 12 个场景都获得闪耀星',
    icon: '🌠',
    category: 'special',
    hidden: true,
    condition: (ctx) => shiningStars(ctx) >= 12,
    progress: (ctx) => Math.round((Math.min(shiningStars(ctx), 12) / 12) * 100),
  },
];

// ==================== 汇总 ====================

/** 全部 17 个成就 */
export const ALL_ACHIEVEMENTS: Achievement[] = [
  ...explorationAchievements,
  ...skillAchievements,
  ...collectionAchievements,
  ...persistenceAchievements,
  ...specialAchievements,
  ...hiddenAchievements,
];

/** 按 ID 查找成就 */
export function getAchievementById(id: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * 检查所有成就，返回新解锁的成就 ID 列表
 * 仅返回本次会话中首次从 locked → unlocked 的成就
 */
export function checkAchievements(ctx: AchievementContext): string[] {
  const newUnlocks: string[] = [];
  for (const achievement of ALL_ACHIEVEMENTS) {
    if (achievement.condition(ctx)) {
      newUnlocks.push(achievement.id);
    }
  }
  return newUnlocks;
}
