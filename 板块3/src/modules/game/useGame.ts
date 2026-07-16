/**
 * 游戏逻辑 Hook v2
 *
 * 封装游戏操作，让 ScenePlay.tsx 和 GameHome.tsx 只消费 hook 接口。
 */

import { useEffect } from 'react';
import { useGameStore } from './gameStore';
import { isSttAvailable, probeStt, startListening } from '@/lib/stt';
import { clearAllGameData } from '@/lib/storage';

export function useGame() {
  const store = useGameStore();

  // 初始化时检测 STT 和麦克风
  useEffect(() => {
    store.initGame();

    // 先检查 API 是否可用
    if (!isSttAvailable()) {
      store.setSTTMode('click-only');
      return;
    }

    // 探测是否真的能工作（audio-capture/not-allowed 会快速返回 false）
    probeStt().then((works) => {
      if (!works) {
        store.setSTTMode('click-only');
      }
      // 探测成功 → 保持 voice 模式（默认）
    });
  }, []);

  /** 开始语音识别 */
  const startVoiceRecognition = async (): Promise<{ success: boolean; transcript?: string; error?: string }> => {
    if (!isSttAvailable()) {
      return { success: false, error: 'not_supported' };
    }
    try {
      const result = await startListening('zh-CN', 10000);
      // 成功后自动切回 voice 模式
      store.setSTTMode('voice');
      return { success: true, transcript: result.transcript };
    } catch (err: any) {
      const raw = err.message || 'unknown';
      return { success: false, error: raw };
    }
  };

  /** 获取庆祝级别（用于差异化庆祝动画） */
  const getCelebrationLevel = (): 'normal' | 'shining' | 'planet' => {
    const { combo, currentScene, planetProgress } = store;
    if (currentScene) {
      const planet = planetProgress.find((p) => p.category === currentScene.category);
      if (planet && planet.completedScenes + 1 >= planet.totalScenes && !planet.heartEarned) {
        return 'planet';
      }
    }
    if (combo >= 2) return 'shining';
    return 'normal';
  };

  /** 获取当前场景的分类星球是否即将完成 */
  const isPlanetCompleting = (): boolean => {
    const { currentScene, planetProgress } = store;
    if (!currentScene) return false;
    const planet = planetProgress.find((p) => p.category === currentScene.category);
    if (!planet) return false;
    return planet.completedScenes + 1 >= planet.totalScenes && !planet.heartEarned;
  };

  return {
    // 状态
    gameState: store.gameState,
    sttMode: store.sttMode,
    currentScene: store.currentScene,
    currentSceneIndex: store.currentSceneIndex,
    totalScenes: store.totalScenes,
    stars: store.stars,
    isCorrect: store.isCorrect,
    selectedOptionIndex: store.selectedOptionIndex,
    voicePromptMessage: store.voicePromptMessage,
    wrongAnswerHint: store.wrongAnswerHint,

    // v2 新增状态
    combo: store.combo,
    collectibles: store.collectibles,
    planetProgress: store.planetProgress,
    hasSeenIntro: store.hasSeenIntro,
    interactionMode: store.interactionMode,
    currentStepIndex: store.currentStepIndex,
    scenes: store.scenes,
    pendingAchievementUnlocks: store.pendingAchievementUnlocks,

    // v4 新增状态
    difficultyLevel: store.difficultyLevel,

    // 操作
    startScene: store.startScene,
    selectOption: store.selectOption,
    onCelebrationComplete: store.onCelebrationComplete,
    onVoiceComplete: store.onVoiceComplete,
    nextScene: store.nextScene,
    resetGame: store.resetGame,

    // v2 新增操作
    advanceStep: store.advanceStep,
    submitEmotion: store.submitEmotion,
    markIntroSeen: store.markIntroSeen,
    acknowledgeAchievement: store.acknowledgeAchievement,

    // 语音
    startVoiceRecognition,

    // 辅助
    getCelebrationLevel,
    isPlanetCompleting,

    /** 新建存档：清除所有数据并重新初始化 */
    async newArchive(): Promise<void> {
      await clearAllGameData();
      store.resetGame();
      await store.initGame();
    },
  };
}
