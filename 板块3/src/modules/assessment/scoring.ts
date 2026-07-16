/**
 * 能力评估 — 评分与等级判定
 *
 * 纯函数，不依赖外部状态，便于测试。
 */

import type {
  AbilityLevel,
  AssessmentDimension,
  AssessmentResult,
  DimensionResult,
} from './types';
import {
  ASSESSMENT_QUESTIONS,
  MAX_SCORE_PER_DIMENSION,
  MAX_TOTAL_SCORE,
} from './questions';

// ========== 等级阈值 ==========

/**
 * 根据百分比判定等级
 * - 0-40%  → sprout（萌芽期）
 * - 41-75% → growing（成长中）
 * - 76-100% → blooming（熟练期）
 */
export function getLevelFromPercentage(pct: number): AbilityLevel {
  if (pct <= 40) return 'sprout';
  if (pct <= 75) return 'growing';
  return 'blooming';
}

// ========== 评分 ==========

/** 用户答案：题目ID → 选择的选项索引 */
export type UserAnswers = Record<string, number>;

/**
 * 计算评估结果
 */
export function calculateResult(answers: UserAnswers): AssessmentResult {
  const dimensions: AssessmentDimension[] = ['greeting', 'thanks', 'emotion', 'request'];

  const dimensionResults: DimensionResult[] = dimensions.map((dim) => {
    const dimQuestions = ASSESSMENT_QUESTIONS.filter((q) => q.dimension === dim);
    let rawScore = 0;

    for (const q of dimQuestions) {
      const selectedIdx = answers[q.id];
      if (selectedIdx !== undefined && q.options[selectedIdx]) {
        rawScore += q.options[selectedIdx].score;
      }
    }

    const percentage = Math.round((rawScore / MAX_SCORE_PER_DIMENSION) * 100);
    const level = getLevelFromPercentage(percentage);

    return {
      dimension: dim,
      rawScore,
      maxScore: MAX_SCORE_PER_DIMENSION,
      percentage,
      level,
    };
  });

  // 综合分数
  const totalRaw = dimensionResults.reduce((sum, d) => sum + d.rawScore, 0);
  const overallPercentage = Math.round((totalRaw / MAX_TOTAL_SCORE) * 100);
  const overallLevel = getLevelFromPercentage(overallPercentage);

  return {
    dimensions: dimensionResults,
    overallLevel,
    overallPercentage,
    assessedAt: Date.now(),
    version: 1,
  };
}

/**
 * 根据评估结果获取推荐的难度等级（用于场景匹配）
 * 直接使用综合等级
 */
export function getRecommendedLevel(result: AssessmentResult): AbilityLevel {
  return result.overallLevel;
}

/**
 * 根据难度等级获取场景配置调整
 *
 * 不同难度下：
 * - sprout: 只显示 2 个选项（去掉最干扰项），更多引导提示
 * - growing: 显示所有选项，标准引导
 * - blooming: 显示所有选项，更少引导，鼓励自主判断
 */
export interface DifficultyConfig {
  /** 是否减少选项数量 */
  reducedOptions: boolean;
  /** 引导提示详细度 */
  hintVerbosity: 'detailed' | 'normal' | 'minimal';
  /** 跟读句子复杂度 */
  voicePromptComplexity: 'simple' | 'normal' | 'extended';
  /** 是否展示场景 intro */
  showIntro: boolean;
  /** 庆祝动画强度 */
  celebrationIntensity: 'gentle' | 'normal' | 'enthusiastic';
}

export function getDifficultyConfig(level: AbilityLevel): DifficultyConfig {
  switch (level) {
    case 'sprout':
      return {
        reducedOptions: true,
        hintVerbosity: 'detailed',
        voicePromptComplexity: 'simple',
        showIntro: true,
        celebrationIntensity: 'gentle',
      };
    case 'growing':
      return {
        reducedOptions: false,
        hintVerbosity: 'normal',
        voicePromptComplexity: 'normal',
        showIntro: true,
        celebrationIntensity: 'normal',
      };
    case 'blooming':
      return {
        reducedOptions: false,
        hintVerbosity: 'minimal',
        voicePromptComplexity: 'extended',
        showIntro: false,
        celebrationIntensity: 'enthusiastic',
      };
  }
}
