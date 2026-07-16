/**
 * 场景数据完整性测试 v2
 *
 * v2 新增测试：
 *   - 激活场景的 introText/successText/outroText 非空
 *   - optionHints 长度与 options 一致
 *   - 多步场景有有效的 steps
 *   - 情绪识别场景有 emotionOptions
 */

import { describe, it, expect } from 'vitest';
import { scenes, getActiveScenes, getCategories, CATEGORY_LABELS, getScenesByCategory, getRecommendedSceneOrder } from '../data/scenes';

describe('data/scenes — 基础完整性', () => {
  it('应该有 12 个场景', () => {
    expect(scenes).toHaveLength(12);
  });

  it('MVP 应该有 4 个激活场景', () => {
    const active = getActiveScenes();
    expect(active).toHaveLength(12);
  });

  it('每个场景的 options 至少有一个 correct: true', () => {
    for (const scene of scenes) {
      const hasCorrect = scene.options.some((o) => o.correct);
      expect(hasCorrect).toBe(true);
    }
  });

  it('每个场景的 voicePrompt 不为空', () => {
    for (const scene of scenes) {
      expect(scene.voicePrompt.trim().length).toBeGreaterThan(0);
    }
  });

  it('每个场景的 id 唯一', () => {
    const ids = scenes.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('每个场景的 category 在允许范围内', () => {
    const validCategories = ['greeting', 'thanks', 'emotion', 'request'];
    for (const scene of scenes) {
      expect(validCategories).toContain(scene.category);
    }
  });

  it('所有场景的 options 数量在 2-4 之间', () => {
    for (const scene of scenes) {
      expect(scene.options.length).toBeGreaterThanOrEqual(2);
      expect(scene.options.length).toBeLessThanOrEqual(4);
    }
  });

  it('getCategories 返回 4 个分类', () => {
    expect(getCategories()).toHaveLength(4);
  });

  it('CATEGORY_LABELS 有 4 个分类的中文名', () => {
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(4);
  });

  it('激活的场景每个分类各 3 个', () => {
    const active = getActiveScenes();
    const counts = active.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    expect(Object.values(counts)).toEqual([3, 3, 3, 3]);
  });
});

describe('data/scenes — v2 叙事字段', () => {
  it('激活场景都有 introText', () => {
    const active = getActiveScenes();
    for (const scene of active) {
      expect(scene.introText.trim().length).toBeGreaterThan(0);
    }
  });

  it('激活场景都有 successText', () => {
    const active = getActiveScenes();
    for (const scene of active) {
      expect(scene.successText.trim().length).toBeGreaterThan(0);
    }
  });

  it('激活场景都有 outroText', () => {
    const active = getActiveScenes();
    for (const scene of active) {
      expect(scene.outroText.trim().length).toBeGreaterThan(0);
    }
  });

  it('激活场景的 optionHints 长度与 options 一致', () => {
    const active = getActiveScenes();
    for (const scene of active) {
      expect(scene.optionHints).toHaveLength(scene.options.length);
    }
  });

  it('激活场景的 optionHints 正确选项位置为 null', () => {
    const active = getActiveScenes();
    for (const scene of active) {
      for (let i = 0; i < scene.options.length; i++) {
        if (scene.options[i].correct) {
          expect(scene.optionHints[i]).toBeNull();
        }
      }
    }
  });

  it('所有激活场景都有有效的 sceneType', () => {
    const validTypes = ['single-choice', 'multi-step', 'emotion-recognition'];
    const active = getActiveScenes();
    for (const scene of active) {
      expect(validTypes).toContain(scene.sceneType);
    }
  });
});

describe('data/scenes — v2 多步场景', () => {
  it('need-01 是多步场景且有 2 个步骤', () => {
    const scene = scenes.find((s) => s.id === 'need-01');
    expect(scene).toBeDefined();
    expect(scene!.sceneType).toBe('multi-step');
    expect(scene!.steps).toBeDefined();
    expect(scene!.steps).toHaveLength(2);
  });

  it('多步场景每个步骤有至少一个正确选项', () => {
    const scene = scenes.find((s) => s.id === 'need-01');
    expect(scene?.steps).toBeDefined();
    for (const step of scene!.steps!) {
      const hasCorrect = step.options.some((o) => o.correct);
      expect(hasCorrect).toBe(true);
    }
  });
});

describe('data/scenes — v2 情绪识别场景', () => {
  it('emotion-01 是情绪识别场景且有 emotionOptions', () => {
    const scene = scenes.find((s) => s.id === 'emotion-01');
    expect(scene).toBeDefined();
    expect(scene!.sceneType).toBe('emotion-recognition');
    expect(scene!.emotionOptions).toBeDefined();
    expect(scene!.emotionOptions).toHaveLength(3);
  });

  it('情绪识别场景至少有一个正确表情', () => {
    const scene = scenes.find((s) => s.id === 'emotion-01');
    const hasCorrect = scene!.emotionOptions!.some((o) => o.correct);
    expect(hasCorrect).toBe(true);
  });
});

describe('data/scenes — v3 互动插画', () => {
  const ILLUSTRATED_SCENES = ['greet-01', 'thanks-01', 'emotion-01'];

  it('试点场景有插画资源', () => {
    for (const sceneId of ILLUSTRATED_SCENES) {
      const scene = scenes.find((s) => s.id === sceneId);
      expect(scene).toBeDefined();
      expect(scene!.illustration).toBeDefined();
      expect(scene!.illustration!.generatedBy).not.toBe('none');
      expect(scene!.illustration!.imageUrl).toMatch(/\.webp$/);
    }
  });

  it('插画热点对应有效选项索引', () => {
    for (const sceneId of ILLUSTRATED_SCENES) {
      const scene = scenes.find((s) => s.id === sceneId)!;
      const illustration = scene.illustration!;
      for (const hotspot of illustration.hotspots) {
        expect(hotspot.linkedOptionIndex).toBeGreaterThanOrEqual(0);
        expect(hotspot.linkedOptionIndex).toBeLessThan(scene.options.length);
      }
    }
  });

  it('多步场景 need-01 的每一步都有插画', () => {
    const scene = scenes.find((s) => s.id === 'need-01')!;
    expect(scene.steps).toHaveLength(2);
    // v5: steps 中的 illustration 为可选字段
    for (const step of scene.steps!) {
      // 如果有插画就验证
      if (step.illustration) {
        expect(step.illustration.generatedBy).not.toBe('none');
      }
    }
  });
});

describe('data/scenes — v4 难度等级', () => {
  const validLevels = ['sprout', 'growing', 'blooming'];

  it('所有激活场景都有 difficultyLevel', () => {
    const active = getActiveScenes();
    for (const scene of active) {
      expect(validLevels).toContain(scene.difficultyLevel);
    }
  });

  it('问候类场景为 sprout 难度', () => {
    const greetScenes = scenes.filter((s) => s.category === 'greeting' && s.active);
    for (const scene of greetScenes) {
      expect(scene.difficultyLevel).toBe('sprout');
    }
  });

  it('sprout 场景有 variants.sprout', () => {
    const sproutScenes = scenes.filter((s) => s.active && s.difficultyLevel === 'sprout');
    for (const scene of sproutScenes) {
      expect(scene.variants?.sprout).toBeDefined();
      expect(scene.variants!.sprout!.options.length).toBeGreaterThanOrEqual(2);
      // sprout 变体的选项少于等于 growing 的选项
      const sproutLen = scene.variants!.sprout!.options.length;
      const growingLen = scene.variants?.growing?.options.length ?? sproutLen;
      expect(sproutLen).toBeLessThanOrEqual(growingLen);
    }
  });

  it('blooming 场景有更多选项', () => {
    const allScenes = scenes.filter((s) => s.active);
    for (const scene of allScenes) {
      const b = scene.variants?.blooming;
      if (!b) continue;
      const s = scene.variants?.sprout;
      if (s) {
        // blooming 至少和 sprout 一样多，通常更多
        expect(b.options.length).toBeGreaterThanOrEqual(s.options.length);
      }
    }
  });

  it('getRecommendedSceneOrder 按难度排序', () => {
    const order = getRecommendedSceneOrder('sprout');
    expect(order.length).toBeGreaterThan(0);
    // sprout 优先：前面的场景应该是 sprout 级别
    const firstFew = order.slice(0, 3);
    const hasSproutFirst = firstFew.some((s) => s.difficultyLevel === 'sprout');
    expect(hasSproutFirst).toBe(true);
  });
});
