/**
 * 每日任务系统
 *
 * 6 个任务池，每天基于日期种子伪随机抽取 3 个。
 * 同一天内任务不变，跨天自动刷新。
 */

import type { DailyTask, DailyTaskProgress, AchievementContext } from './types';

// ==================== 6 个任务定义 ====================

const TASK_POOL: DailyTask[] = [
  {
    id: 'daily-scenes-3',
    name: '练习小达人',
    description: '完成 3 个场景',
    icon: '🎮',
    target: 3,
    reward: 1,
    getProgress: (ctx) =>
      Math.min(ctx.gameProgress.filter((p) => p.completed).length, 3),
  },
  {
    id: 'daily-shining-1',
    name: '闪耀时刻',
    description: '获得 1 个闪耀星',
    icon: '🌟',
    target: 1,
    reward: 1,
    getProgress: (ctx) =>
      Math.min(ctx.collectibles.filter((c) => c.type === 'shining_star').length, 1),
  },
  {
    id: 'daily-greeting',
    name: '问候星练习',
    description: '在问候星完成 1 个场景',
    icon: '🌻',
    target: 1,
    reward: 1,
    getProgress: (ctx) =>
      Math.min(
        ctx.gameProgress.filter(
          (p) => p.completed && p.sceneId.startsWith('greet'),
        ).length,
        1,
      ),
  },
  {
    id: 'daily-thanks',
    name: '感谢星练习',
    description: '在感谢星完成 1 个场景',
    icon: '🙏',
    target: 1,
    reward: 1,
    getProgress: (ctx) =>
      Math.min(
        ctx.gameProgress.filter(
          (p) => p.completed && p.sceneId.startsWith('thanks'),
        ).length,
        1,
      ),
  },
  {
    id: 'daily-emotion',
    name: '情绪星练习',
    description: '在情绪星完成 1 个场景',
    icon: '💝',
    target: 1,
    reward: 1,
    getProgress: (ctx) =>
      Math.min(
        ctx.gameProgress.filter(
          (p) => p.completed && p.sceneId.startsWith('emotion'),
        ).length,
        1,
      ),
  },
  {
    id: 'daily-request',
    name: '表达星练习',
    description: '在表达星完成 1 个场景',
    icon: '🗣️',
    target: 1,
    reward: 1,
    getProgress: (ctx) =>
      Math.min(
        ctx.gameProgress.filter(
          (p) => p.completed && p.sceneId.startsWith('need'),
        ).length,
        1,
      ),
  },
];

// ==================== 日期种子随机 ====================

/** 获取今日日期字符串 YYYY-MM-DD */
export function getTodayStr(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** 基于日期字符串的简单哈希 */
function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Fisher-Yates 洗牌（使用日期种子） */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 获取今日任务列表
 * 基于日期种子从任务池中随机抽取 3 个
 */
export function getTodayTasks(): DailyTask[] {
  const today = getTodayStr();
  const seed = hashDate(today);
  const shuffled = seededShuffle(TASK_POOL, seed);
  return shuffled.slice(0, 3);
}

/**
 * 根据上下文计算今日任务进度
 */
export function computeTaskProgress(
  tasks: DailyTask[],
  ctx: AchievementContext,
): { taskId: string; current: number; target: number; completed: boolean; rewardClaimed: boolean }[] {
  return tasks.map((task) => ({
    taskId: task.id,
    current: task.getProgress(ctx),
    target: task.target,
    completed: task.getProgress(ctx) >= task.target,
    rewardClaimed: false,
  }));
}

/**
 * 合并新旧进度（保留已领取的奖励状态）
 */
export function mergeTaskProgress(
  tasks: DailyTask[],
  ctx: AchievementContext,
  existingProgress: DailyTaskProgress | null,
): DailyTaskProgress {
  const date = getTodayStr();
  const newTasks = computeTaskProgress(tasks, ctx);

  // 如果已有进度且是同一天，保留已领取的奖励状态
  if (existingProgress && existingProgress.date === date) {
    return {
      date,
      tasks: newTasks.map((t) => {
        const existing = existingProgress.tasks.find((e) => e.taskId === t.taskId);
        return {
          ...t,
          rewardClaimed: existing ? existing.rewardClaimed : false,
        };
      }),
    };
  }

  return { date, tasks: newTasks };
}

/** 获取全部任务池（供外部参考） */
export function getTaskPool(): DailyTask[] {
  return TASK_POOL;
}

/** 按 ID 查找任务 */
export function getTaskById(id: string): DailyTask | undefined {
  return TASK_POOL.find((t) => t.id === id);
}
