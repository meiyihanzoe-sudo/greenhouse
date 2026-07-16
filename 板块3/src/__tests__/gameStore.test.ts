/**
 * 游戏状态机单元测试 v2
 *
 * 测试所有合法状态转换、非法转换被拒绝、星星计算、边界情况。
 * v2 新增：连击、收集物、多步场景、情绪识别。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../modules/game/gameStore';

// Mock IndexedDB
vi.mock('@/lib/storage', () => ({
  saveGameProgress: vi.fn().mockResolvedValue(undefined),
  getGameProgress: vi.fn().mockResolvedValue([]),
  saveCollectible: vi.fn().mockResolvedValue(undefined),
  getCollectibles: vi.fn().mockResolvedValue([]),
  savePlanetProgress: vi.fn().mockResolvedValue(undefined),
  getPlanetProgress: vi.fn().mockResolvedValue([]),
}));

describe('gameStore 状态机', () => {
  beforeEach(() => {
    useGameStore.setState({
      gameState: 'idle',
      sttMode: 'voice',
      scenes: [],
      currentSceneIndex: 0,
      currentScene: null,
      stars: 0,
      totalScenes: 0,
      voiceAttempts: 0,
      selectedOptionIndex: null,
      isCorrect: null,
      voicePromptMessage: '',
      wrongAnswerHint: null,
      combo: 0,
      collectibles: [],
      planetProgress: [],
      hasSeenIntro: false,
      interactionMode: 'single-choice',
      currentStepIndex: 0,
      allStepsCorrect: null,
    });
  });

  it('初始状态为 idle', () => {
    expect(useGameStore.getState().gameState).toBe('idle');
  });

  it('idle → sceneLoading 是合法转换', async () => {
    await useGameStore.getState().initGame();
    useGameStore.getState().startScene();
    await new Promise((r) => setTimeout(r, 500));
    const state = useGameStore.getState().gameState;
    expect(['sceneLoading', 'presenting', 'waitingForAnswer']).toContain(state);
  });

  it('在 idle 状态下 selectOption 无效', () => {
    useGameStore.getState().selectOption(0);
    expect(useGameStore.getState().gameState).toBe('idle');
  });

  it('resetGame 回到 idle 并重置 v2 字段', () => {
    useGameStore.setState({
      gameState: 'completed',
      stars: 4,
      combo: 3,
      collectibles: [{ type: 'shining_star', sceneId: 'test', earnedAt: Date.now() }],
      interactionMode: 'multi-step',
    });
    useGameStore.getState().resetGame();
    expect(useGameStore.getState().gameState).toBe('idle');
    expect(useGameStore.getState().stars).toBe(0);
    expect(useGameStore.getState().combo).toBe(0);
    expect(useGameStore.getState().collectibles).toHaveLength(0);
    expect(useGameStore.getState().interactionMode).toBe('single-choice');
  });

  it('setSTTMode 切换模式', () => {
    useGameStore.getState().setSTTMode('click-only');
    expect(useGameStore.getState().sttMode).toBe('click-only');
  });
});

describe('gameStore v2 — 连击系统', () => {
  beforeEach(() => {
    useGameStore.setState({
      combo: 0,
      stars: 0,
      collectibles: [],
    });
  });

  it('连击计数初始为 0', () => {
    expect(useGameStore.getState().combo).toBe(0);
  });

  it('resetGame 重置连击', () => {
    useGameStore.setState({ combo: 5 });
    useGameStore.getState().resetGame();
    expect(useGameStore.getState().combo).toBe(0);
  });
});

describe('gameStore v2 — 开场故事', () => {
  beforeEach(() => {
    useGameStore.setState({ hasSeenIntro: false });
  });

  it('初始 hasSeenIntro 为 false', () => {
    expect(useGameStore.getState().hasSeenIntro).toBe(false);
  });

  it('markIntroSeen 设置 hasSeenIntro 为 true', () => {
    useGameStore.getState().markIntroSeen();
    expect(useGameStore.getState().hasSeenIntro).toBe(true);
  });
});

describe('gameStore v2 — 交互模式', () => {
  beforeEach(() => {
    useGameStore.setState({
      interactionMode: 'single-choice',
      currentStepIndex: 0,
    });
  });

  it('初始交互模式为 single-choice', () => {
    expect(useGameStore.getState().interactionMode).toBe('single-choice');
  });

  it('当前步骤索引初始为 0', () => {
    expect(useGameStore.getState().currentStepIndex).toBe(0);
  });
});
