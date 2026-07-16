/**
 * 能力评估系统 — 单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  calculateResult,
  getLevelFromPercentage,
  getDifficultyConfig,
  type UserAnswers,
} from '../modules/assessment/scoring';
import { ASSESSMENT_QUESTIONS, MAX_SCORE_PER_DIMENSION, MAX_TOTAL_SCORE } from '../modules/assessment/questions';
import type { AbilityLevel } from '../modules/assessment/types';

describe('评估题库', () => {
  it('共有 8 道题', () => {
    expect(ASSESSMENT_QUESTIONS).toHaveLength(8);
  });

  it('每个维度 2 道题', () => {
    const dimensions = ['greeting', 'thanks', 'emotion', 'request'];
    for (const dim of dimensions) {
      const count = ASSESSMENT_QUESTIONS.filter((q) => q.dimension === dim).length;
      expect(count).toBe(2);
    }
  });

  it('每题最高分为 2', () => {
    for (const q of ASSESSMENT_QUESTIONS) {
      const max = Math.max(...q.options.map((o) => o.score));
      expect(max).toBe(2);
    }
  });

  it('每维度最高 4 分', () => {
    expect(MAX_SCORE_PER_DIMENSION).toBe(4);
  });

  it('综合最高 16 分', () => {
    expect(MAX_TOTAL_SCORE).toBe(16);
  });
});

describe('等级判定', () => {
  it('0-40% → sprout', () => {
    expect(getLevelFromPercentage(0)).toBe('sprout');
    expect(getLevelFromPercentage(20)).toBe('sprout');
    expect(getLevelFromPercentage(40)).toBe('sprout');
  });

  it('41-75% → growing', () => {
    expect(getLevelFromPercentage(41)).toBe('growing');
    expect(getLevelFromPercentage(60)).toBe('growing');
    expect(getLevelFromPercentage(75)).toBe('growing');
  });

  it('76-100% → blooming', () => {
    expect(getLevelFromPercentage(76)).toBe('blooming');
    expect(getLevelFromPercentage(90)).toBe('blooming');
    expect(getLevelFromPercentage(100)).toBe('blooming');
  });
});

describe('评分算法', () => {
  it('全部最低分 → sprout', () => {
    const answers: UserAnswers = {};
    for (const q of ASSESSMENT_QUESTIONS) {
      // 选分数最低的选项 (score=0)
      const minIdx = q.options.findIndex((o) => o.score === 0);
      answers[q.id] = minIdx;
    }
    const result = calculateResult(answers);
    expect(result.overallLevel).toBe('sprout');
    expect(result.overallPercentage).toBe(0);
    for (const d of result.dimensions) {
      expect(d.level).toBe('sprout');
      expect(d.percentage).toBe(0);
    }
  });

  it('全部最高分 → blooming', () => {
    const answers: UserAnswers = {};
    for (const q of ASSESSMENT_QUESTIONS) {
      const maxIdx = q.options.findIndex((o) => o.score === 2);
      answers[q.id] = maxIdx;
    }
    const result = calculateResult(answers);
    expect(result.overallLevel).toBe('blooming');
    expect(result.overallPercentage).toBe(100);
    for (const d of result.dimensions) {
      expect(d.level).toBe('blooming');
      expect(d.percentage).toBe(100);
    }
  });

  it('混合分数 → growing', () => {
    const answers: UserAnswers = {};
    for (const q of ASSESSMENT_QUESTIONS) {
      // 选中间分数 (score=1)
      const midIdx = q.options.findIndex((o) => o.score === 1);
      answers[q.id] = midIdx >= 0 ? midIdx : 0;
    }
    const result = calculateResult(answers);
    expect(result.overallLevel).toBe('growing');
    expect(result.overallPercentage).toBe(50);
  });

  it('单个维度满分不影响其他维度', () => {
    const answers: UserAnswers = {};
    for (const q of ASSESSMENT_QUESTIONS) {
      if (q.dimension === 'greeting') {
        const maxIdx = q.options.findIndex((o) => o.score === 2);
        answers[q.id] = maxIdx;
      } else {
        const minIdx = q.options.findIndex((o) => o.score === 0);
        answers[q.id] = minIdx;
      }
    }
    const result = calculateResult(answers);
    const greeting = result.dimensions.find((d) => d.dimension === 'greeting')!;
    expect(greeting.percentage).toBe(100);
    expect(greeting.level).toBe('blooming');

    const thanks = result.dimensions.find((d) => d.dimension === 'thanks')!;
    expect(thanks.percentage).toBe(0);
    expect(thanks.level).toBe('sprout');

    // 综合：2维度满分(8分) + 2维度零分(0分) = 8/16 = 50%
    expect(result.overallPercentage).toBe(25);
    expect(result.overallLevel).toBe('sprout');
  });
});

describe('难度配置', () => {
  it('sprout → 减少选项 + 详细引导', () => {
    const config = getDifficultyConfig('sprout');
    expect(config.reducedOptions).toBe(true);
    expect(config.hintVerbosity).toBe('detailed');
    expect(config.voicePromptComplexity).toBe('simple');
  });

  it('growing → 标准配置', () => {
    const config = getDifficultyConfig('growing');
    expect(config.reducedOptions).toBe(false);
    expect(config.hintVerbosity).toBe('normal');
    expect(config.voicePromptComplexity).toBe('normal');
  });

  it('blooming → 更多自主', () => {
    const config = getDifficultyConfig('blooming');
    expect(config.reducedOptions).toBe(false);
    expect(config.hintVerbosity).toBe('minimal');
    expect(config.voicePromptComplexity).toBe('extended');
    expect(config.showIntro).toBe(false);
  });
});
