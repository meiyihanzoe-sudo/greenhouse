/**
 * 成就系统 — 统一导出
 */

export { AchievementBadge } from './AchievementBadge';
export { DailyTaskList } from './DailyTaskList';
export { AchievementToast } from './AchievementToast';
export { AchievementSummary } from './AchievementSummary';
export { default as AchievementPage } from './AchievementPage';
export { ALL_ACHIEVEMENTS, checkAchievements, getAchievementById } from './achievements';
export { getTodayTasks, getTodayStr, mergeTaskProgress, getTaskById } from './dailyTasks';
export type {
  Achievement,
  AchievementContext,
  AchievementProgress,
  AchievementUnlockEvent,
  DailyTask,
  DailyTaskProgress,
} from './types';
export { ACHIEVEMENT_CATEGORY_NAMES } from './types';
