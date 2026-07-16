/**
 * 能力评估系统 — 类型定义
 *
 * 评估孩子在四个社交维度上的能力水平，
 * 输出难度等级建议，自动匹配合适的场景。
 */

// ========== 难度等级 ==========

/** 能力等级 */
export type AbilityLevel = 'sprout' | 'growing' | 'blooming';

/** 难度等级对应的中文名 */
export const ABILITY_LEVEL_LABELS: Record<AbilityLevel, string> = {
  sprout: '🌱 萌芽期',
  growing: '🌿 成长中',
  blooming: '🌳 熟练期',
};

/** 难度等级对应的描述 */
export const ABILITY_LEVEL_DESCRIPTIONS: Record<AbilityLevel, string> = {
  sprout: '星宝刚开始学习社交技能，需要更多引导和简单的选择。我们从最基础的问候和感谢开始吧！',
  growing: '星宝已经有一些社交基础了，可以尝试更多情境和稍复杂的选择。继续加油！',
  blooming: '星宝的社交能力很棒！可以挑战更多样的情境和更微妙的社交互动。',
};

// ========== 评估维度 ==========

/** 评估维度（对应4个星球） */
export type AssessmentDimension = 'greeting' | 'thanks' | 'emotion' | 'request';

/** 维度中文名 */
export const DIMENSION_LABELS: Record<AssessmentDimension, string> = {
  greeting: '问候能力',
  thanks: '感谢能力',
  emotion: '情绪识别',
  request: '需求表达',
};

/** 维度 emoji */
export const DIMENSION_EMOJIS: Record<AssessmentDimension, string> = {
  greeting: '👋',
  thanks: '🙏',
  emotion: '😊',
  request: '🗣️',
};

// ========== 评估题目 ==========

/** 单道评估题 */
export interface AssessmentQuestion {
  /** 题目 ID */
  id: string;
  /** 评估维度 */
  dimension: AssessmentDimension;
  /** 情境描述（简短、ASD友好） */
  scenario: string;
  /** 情境 emoji */
  emoji: string;
  /** 选项 */
  options: AssessmentOption[];
}

/** 评估选项 */
export interface AssessmentOption {
  /** 选项文字 */
  text: string;
  /** 该选项对应的能力分数（0-2） */
  score: number;
}

// ========== 评估结果 ==========

/** 单维度评估结果 */
export interface DimensionResult {
  dimension: AssessmentDimension;
  /** 原始得分 */
  rawScore: number;
  /** 最高可能得分 */
  maxScore: number;
  /** 百分比得分 */
  percentage: number;
  /** 该维度对应等级 */
  level: AbilityLevel;
}

/** 完整评估结果 */
export interface AssessmentResult {
  /** 各维度结果 */
  dimensions: DimensionResult[];
  /** 综合等级 */
  overallLevel: AbilityLevel;
  /** 综合百分比 */
  overallPercentage: number;
  /** 评估时间 */
  assessedAt: number;
  /** 评估版本（用于未来升级） */
  version: number;
}

// ========== 持久化 ==========

/** 存储在 IndexedDB 中的评估记录 */
export interface AssessmentRecord {
  /** 固定 key: 'current' */
  id: 'current';
  /** 评估结果 */
  result: AssessmentResult;
}
