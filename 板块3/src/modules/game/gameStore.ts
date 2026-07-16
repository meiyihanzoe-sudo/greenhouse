/**
 * 游戏状态管理 — Zustand Store v2
 *
 * 8 状态游戏状态机：
 *   idle → sceneLoading → presenting → waitingForAnswer
 *   → judging → celebrating → voicePrompt → progressUpdate
 *   → nextScene | completed
 *
 * v2 新增：
 *   - 连击计数（combo）→ 闪耀星
 *   - 星球完成状态 → 星球之心
 *   - 收集物系统
 *   - 多步场景支持（multi-step）
 *   - 情绪识别模式（emotion-recognition）
 *   - 首次访问标记（hasSeenIntro）
 */

import { create } from 'zustand';
import { getActiveScenes, getRecommendedSceneOrder, getSceneForDifficulty, type SceneData } from '@/data/scenes';
import { saveGameProgress, getGameProgress, saveCollectible, getCollectibles, savePlanetProgress, clearAllGameData, saveAchievementProgress, getAchievementProgress, getDailyTaskProgress, saveDailyTaskProgress, saveAllAchievementProgress } from '@/lib/storage';
import type { GameProgress, Collectible, PlanetProgress, DifficultyLevel } from '@/types';
import { checkAchievements, ALL_ACHIEVEMENTS, getTodayTasks, getTodayStr, mergeTaskProgress } from '@/modules/achievements';
import type { AchievementUnlockEvent, AchievementContext } from '@/modules/achievements/types';
import { getAssessmentResult } from '@/modules/assessment/storage';
import type { AbilityLevel } from '@/modules/assessment/types';

// ==================== 游戏状态 ====================

export type GameState =
  | 'idle'
  | 'sceneLoading'
  | 'presenting'
  | 'waitingForAnswer'
  | 'judging'
  | 'celebrating'
  | 'voicePrompt'
  | 'progressUpdate'
  | 'completed';

export type STTMode = 'voice' | 'click-only';

/** 当前场景的交互模式 */
export type InteractionMode = 'single-choice' | 'multi-step' | 'emotion-recognition';

// ==================== Store 类型 ====================

export interface GameStore {
  // 状态机
  gameState: GameState;
  sttMode: STTMode;

  // 场景
  scenes: SceneData[];
  currentSceneIndex: number;
  currentScene: SceneData | null;

  // 进度
  stars: number;
  totalScenes: number;
  voiceAttempts: number;

  // 当前回合
  selectedOptionIndex: number | null;
  isCorrect: boolean | null;
  voicePromptMessage: string;

  // 错误提示
  wrongAnswerHint: string | null;

  // ---- v2 新增 ----

  /** 连击计数（连续答对次数） */
  combo: number;
  /** 收集物列表 */
  collectibles: Collectible[];
  /** 星球完成状态 */
  planetProgress: PlanetProgress[];
  /** 首次访问（是否已看过开场故事） */
  hasSeenIntro: boolean;
  /** 当前交互模式 */
  interactionMode: InteractionMode;
  /** 多步场景：当前步骤索引 */
  currentStepIndex: number;
  /** 多步场景：步骤是否全部正确 */
  allStepsCorrect: boolean | null;
  /** v3: 待展示的成就解锁 */
  pendingAchievementUnlocks: AchievementUnlockEvent[];
  /** v4: 当前难度等级 */
  difficultyLevel: DifficultyLevel;
  /** v4: 是否已完成评估 */
  hasAssessment: boolean;
  /** v4: 是否正在显示评估 */
  showAssessment: boolean;

  // 初始化
  initGame: () => Promise<void>;

  // 状态转换
  startScene: () => void;
  selectOption: (optionIndex: number) => void;
  onCelebrationComplete: () => void;
  onVoiceComplete: () => void;
  nextScene: () => void;

  // v2 新增操作
  /** 多步场景：进入下一步 */
  advanceStep: () => void;
  /** 情绪识别模式：提交表情选择 */
  submitEmotion: (emojiIndex: number) => void;
  /** 标记已看过开场故事 */
  markIntroSeen: () => void;
  /** v3: 确认已展示成就弹窗 */
  acknowledgeAchievement: (achievementId: string) => void;
  /** v4: 设置难度等级 */
  setDifficultyLevel: (level: DifficultyLevel) => void;
  /** v4: 标记评估完成 */
  setHasAssessment: (value: boolean) => void;
  /** v4: 显示/隐藏评估 */
  setShowAssessment: (value: boolean) => void;
  /** v4: 根据评估结果初始化场景顺序 */
  applyAssessment: (level: AbilityLevel) => void;

  // 工具
  setSTTMode: (mode: STTMode) => void;
  resetGame: () => void;
}

// ==================== 合法状态转换表 ====================

const VALID_TRANSITIONS: Record<GameState, GameState[]> = {
  idle: ['sceneLoading'],
  sceneLoading: ['presenting'],
  presenting: ['waitingForAnswer'],
  waitingForAnswer: ['judging'],
  judging: ['celebrating', 'waitingForAnswer'], // 正确→庆祝, 错误→重试
  celebrating: ['voicePrompt'],
  voicePrompt: ['progressUpdate'],
  progressUpdate: ['sceneLoading', 'completed'],
  completed: ['sceneLoading'], // 重新开始
};

function canTransition(from: GameState, to: GameState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// ==================== 从 localStorage 同步读取（避免 initGame 异步延迟） ====================

const DIFFICULTY_STORAGE_KEY = 'star-adventure-difficulty';

function getStoredDifficulty(): DifficultyLevel {
  try {
    const stored = localStorage.getItem(DIFFICULTY_STORAGE_KEY);
    if (stored === 'sprout' || stored === 'growing' || stored === 'blooming') return stored;
  } catch {}
  return 'sprout';
}

// ==================== Store 实现 ====================

export const useGameStore = create<GameStore>((set, get) => ({
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

  // v2
  combo: 0,
  collectibles: [],
  planetProgress: [],
  hasSeenIntro: false,
  interactionMode: 'single-choice',
  currentStepIndex: 0,
  allStepsCorrect: null,
  pendingAchievementUnlocks: [],
  difficultyLevel: getStoredDifficulty(),
  hasAssessment: false,
  showAssessment: false,

  // ---- 初始化 ----
  initGame: async () => {
    const activeScenes = getActiveScenes();

    // 从 IndexedDB 恢复数据
    let savedStars = 0;
    let savedCollectibles: Collectible[] = [];
    let savedPlanetProgress: PlanetProgress[] = [];
    let savedHasSeenIntro = false;

    // ---- 构建版本检测：版本变化时自动清档 ----
    const currentVersion = document.querySelector('meta[name="build-version"]')?.getAttribute('content') || '0';
    const storedVersion = localStorage.getItem('star-adventure-build-version');

    if (storedVersion !== currentVersion) {
      // 版本变化 → 清除所有旧数据
      try { await clearAllGameData(); } catch {}
      localStorage.setItem('star-adventure-build-version', currentVersion);
      // 数据已清，跳过恢复逻辑
    } else {
      try {
        const progress = await getGameProgress();

        // 防御：过期场景自动清档
        const completedIds = progress.filter((p) => p.completed).map((p) => p.sceneId);
        const activeIds = new Set(activeScenes.map((s) => s.id));
        const staleRecords = completedIds.filter((id) => !activeIds.has(id));

        if (staleRecords.length > 0 || completedIds.length > activeScenes.length) {
          await clearAllGameData();
          savedStars = 0;
          savedCollectibles = [];
          savedHasSeenIntro = false;
        } else {
          savedStars = progress.reduce((sum, p) => sum + p.stars, 0);
          savedCollectibles = await getCollectibles();
          savedHasSeenIntro = localStorage.getItem('star-adventure-intro-seen') === 'true';

          // 根据实际 game_progress 重新计算星球进度
          const categories = ['greeting', 'thanks', 'emotion', 'request'] as const;
          savedPlanetProgress = categories.map((cat) => {
            const catScenes = activeScenes.filter((s) => s.category === cat);
            const completedScenes = catScenes.filter((s) =>
              progress.some((p) => p.sceneId === s.id && p.completed)
            ).length;
            const totalScenes = catScenes.length;
            const allDone = completedScenes >= totalScenes && totalScenes > 0;
            return {
              category: cat,
              completed: allDone,
              completedScenes,
              totalScenes,
              heartEarned: savedCollectibles.some(
                (c) => c.type === 'planet_heart' && c.sceneId === `planet-${cat}`
              ),
            };
          });
        }
      } catch {
        // IndexedDB 不可用时静默降级
      }
    }

    // 兜底：如果没有任何进度数据，初始化空白星球进度
    if (savedPlanetProgress.length === 0) {
      const categories = ['greeting', 'thanks', 'emotion', 'request'] as const;
      savedPlanetProgress = categories.map((cat) => ({
        category: cat,
        completed: false,
        completedScenes: 0,
        totalScenes: getActiveScenes().filter((s) => s.category === cat).length,
        heartEarned: false,
      }));
    }

    // v4: 加载评估结果
    let savedDifficultyLevel: DifficultyLevel = 'sprout';
    let savedHasAssessment = false;
    try {
      const assessmentResult = await getAssessmentResult();
      if (assessmentResult) {
        savedHasAssessment = true;
        // 将 AbilityLevel 映射为 DifficultyLevel（两者值相同）
        savedDifficultyLevel = assessmentResult.overallLevel as unknown as DifficultyLevel;
        // 根据评估结果重新排列场景顺序
        activeScenes.length = 0;
        activeScenes.push(...getRecommendedSceneOrder(savedDifficultyLevel));
      }
    } catch {
      // 静默降级
    }

    set({
      gameState: 'idle',
      scenes: activeScenes,
      currentSceneIndex: 0,
      currentScene: activeScenes[0] ?? null,
      stars: savedStars,
      totalScenes: activeScenes.length,
      voiceAttempts: 0,
      selectedOptionIndex: null,
      isCorrect: null,
      voicePromptMessage: '',
      wrongAnswerHint: null,
      combo: 0,
      collectibles: savedCollectibles,
      planetProgress: savedPlanetProgress,
      hasSeenIntro: savedHasSeenIntro,
      interactionMode: 'single-choice',
      currentStepIndex: 0,
      allStepsCorrect: null,
      pendingAchievementUnlocks: [],
      difficultyLevel: savedDifficultyLevel,
      hasAssessment: savedHasAssessment,
      showAssessment: false,
    });
  },

  // ---- 开始场景 ----
  startScene: () => {
    const { gameState, scenes, currentSceneIndex, difficultyLevel } = get();
    if (!canTransition(gameState, 'sceneLoading')) return;

    // 如果 store.scenes 尚未初始化（initGame 异步未完成），回退到 getActiveScenes()
    const effectiveScenes = scenes.length > 0 ? scenes : getActiveScenes();
    const rawScene = effectiveScenes[currentSceneIndex] ?? null;
    // v5: 根据难度等级调整场景配置
    const scene = rawScene ? getSceneForDifficulty(rawScene, difficultyLevel) : null;

    // 确定交互模式
    let interactionMode: InteractionMode = 'single-choice';
    if (scene?.sceneType === 'multi-step') interactionMode = 'multi-step';
    else if (scene?.sceneType === 'emotion-recognition') interactionMode = 'emotion-recognition';

    set({
      gameState: 'sceneLoading',
      currentScene: scene,
      selectedOptionIndex: null,
      isCorrect: null,
      voicePromptMessage: '',
      wrongAnswerHint: null,
      interactionMode,
      currentStepIndex: 0,
      allStepsCorrect: null,
      pendingAchievementUnlocks: [],
    });

    // 短暂加载后展示
    setTimeout(() => {
      if (get().gameState === 'sceneLoading') {
        set({ gameState: 'presenting' });
        // 自动进入等待回答
        setTimeout(() => {
          if (get().gameState === 'presenting') {
            set({ gameState: 'waitingForAnswer' });
          }
        }, 1200); // 给 intro 文案更多展示时间
      }
    }, 400);
  },

  // ---- 选择选项 ----
  selectOption: (optionIndex: number) => {
    const { gameState, currentScene, interactionMode, currentStepIndex } = get();
    if (gameState !== 'waitingForAnswer') return;
    if (!currentScene) return;

    let option: { text: string; correct: boolean };

    if (interactionMode === 'multi-step' && currentScene.steps) {
      const step = currentScene.steps[currentStepIndex];
      if (!step) return;
      option = step.options[optionIndex];
      if (!option) return;
    } else {
      option = currentScene.options[optionIndex];
      if (!option) return;
    }

    set({
      gameState: 'judging',
      selectedOptionIndex: optionIndex,
      isCorrect: option.correct,
    });

    if (option.correct) {
      // ---- 正确 ----
      const newStars = get().stars + 1;
      const newCombo = get().combo + 1;

      // 检查是否有闪耀星（连击 ≥ 2）
      const collectibles = [...get().collectibles];
      if (newCombo >= 2) {
        const alreadyEarnedShining = collectibles.some(
          (c) => c.type === 'shining_star' && c.sceneId === currentScene.id
        );
        if (!alreadyEarnedShining) {
          collectibles.push({
            type: 'shining_star',
            sceneId: currentScene.id,
            earnedAt: Date.now(),
          });
          saveCollectible({
            type: 'shining_star',
            sceneId: currentScene.id,
            earnedAt: Date.now(),
          }).catch(() => {});
        }
      }

      set({
        stars: newStars,
        combo: newCombo,
        collectibles,
        voicePromptMessage: currentScene.voicePrompt || '太棒了！你也来说一遍吧！🎉',
        wrongAnswerHint: null,
      });

      // 自动进入庆祝
      setTimeout(() => {
        if (get().gameState === 'judging' && get().isCorrect) {
          set({ gameState: 'celebrating' });
        }
      }, 300);
    } else {
      // ---- 错误 ----
      // 连击中断
      const wasCombo = get().combo;
      set({ combo: 0 });

      // 获取引导提示
      let hint: string | null = '再试试看～选一个更好的回答吧！💪';
      if (interactionMode === 'multi-step' && currentScene.steps) {
        const step = currentScene.steps[currentStepIndex];
        if (step?.hints?.[optionIndex]) {
          hint = step.hints[optionIndex];
        }
      } else if (currentScene.optionHints?.[optionIndex]) {
        hint = currentScene.optionHints[optionIndex];
      }

      // 连击断了给一个温和提示
      if (wasCombo >= 2) {
        hint = (hint || '') + ' （连击断了也没关系，下次继续加油！💪）';
      }

      set({ wrongAnswerHint: hint });

      // 短暂展示后回到等待状态
      setTimeout(() => {
        if (get().gameState === 'judging' && !get().isCorrect) {
          set({
            gameState: 'waitingForAnswer',
            selectedOptionIndex: null,
            isCorrect: null,
          });
        }
      }, 2000);
    }
  },

  // ---- 庆祝动画完成 ----
  onCelebrationComplete: () => {
    const { gameState } = get();
    if (gameState !== 'celebrating') return;

    // 多步场景：检查是否还有下一步
    const { interactionMode, currentScene, currentStepIndex } = get();
    if (interactionMode === 'multi-step' && currentScene?.steps) {
      if (currentStepIndex + 1 < currentScene.steps.length) {
        // 还有下一步 → 推进步骤
        get().advanceStep();
        return;
      }
    }

    set({ gameState: 'voicePrompt' });
  },

  // ---- 多步场景：推进步骤 ----
  advanceStep: () => {
    const { currentScene, currentStepIndex } = get();
    if (!currentScene?.steps) return;

    const nextStepIdx = currentStepIndex + 1;
    if (nextStepIdx >= currentScene.steps.length) return;

    set({
      currentStepIndex: nextStepIdx,
      gameState: 'presenting',
      selectedOptionIndex: null,
      isCorrect: null,
      wrongAnswerHint: null,
    });

    // 展示新步骤
    setTimeout(() => {
      if (get().gameState === 'presenting') {
        set({ gameState: 'waitingForAnswer' });
      }
    }, 800);
  },

  // ---- 情绪识别模式：提交表情选择 ----
  submitEmotion: (emojiIndex: number) => {
    const { gameState, currentScene } = get();
    if (gameState !== 'waitingForAnswer') return;
    if (!currentScene?.emotionOptions) return;

    const selected = currentScene.emotionOptions[emojiIndex];
    if (!selected) return;

    const isCorrect = selected.correct;
    set({
      gameState: 'judging',
      selectedOptionIndex: emojiIndex,
      isCorrect,
    });

    if (isCorrect) {
      // 情绪识别正确 → 进入后续的场景选择题
      setTimeout(() => {
        if (get().gameState === 'judging' && get().isCorrect) {
          set({
            gameState: 'presenting',
            interactionMode: 'single-choice',
            selectedOptionIndex: null,
            isCorrect: null,
            wrongAnswerHint: null,
          });
          setTimeout(() => {
            if (get().gameState === 'presenting') {
              set({ gameState: 'waitingForAnswer' });
            }
          }, 800);
        }
      }, 600);
    } else {
      // 情绪识别错误 → 提示重试
      set({
        wrongAnswerHint: '再认一认，哪个表情是开心的呢？😊',
      });
      setTimeout(() => {
        if (get().gameState === 'judging' && !get().isCorrect) {
          set({
            gameState: 'waitingForAnswer',
            selectedOptionIndex: null,
            isCorrect: null,
          });
        }
      }, 2000);
    }
  },

  // ---- 语音环节完成 ----
  onVoiceComplete: () => {
    const { gameState } = get();
    if (gameState !== 'voicePrompt') return;

    set((s) => ({
      gameState: 'progressUpdate',
      voiceAttempts: s.voiceAttempts + 1,
    }));

    // 持久化当前场景进度
    const { currentScene, stars, combo, collectibles } = get();
    if (currentScene) {
      saveGameProgress({
        sceneId: currentScene.id,
        completed: true,
        stars: 1,
        attempts: get().voiceAttempts,
      }).catch(() => {});

      // 更新星球进度
      const planetProgress = [...get().planetProgress];
      const planet = planetProgress.find((p) => p.category === currentScene.category);
      if (planet) {
        planet.completedScenes += 1;
        if (planet.completedScenes >= planet.totalScenes && !planet.heartEarned) {
          planet.completed = true;
          planet.heartEarned = true;
          // 添加星球之心收集物
          const newCollectibles = [...get().collectibles];
          newCollectibles.push({
            type: 'planet_heart',
            sceneId: `planet-${currentScene.category}`,
            earnedAt: Date.now(),
          });
          set({ collectibles: newCollectibles });
          saveCollectible({
            type: 'planet_heart',
            sceneId: `planet-${currentScene.category}`,
            earnedAt: Date.now(),
          }).catch(() => {});
        }
        set({ planetProgress });
        savePlanetProgress(planetProgress).catch(() => {});
      }
    }

    // v3: 成就检查 + 每日任务更新（异步，不阻塞）
    const state = get();
    const ctx: AchievementContext = {
      gameProgress: [{ sceneId: state.currentScene!.id, completed: true, stars: 1, attempts: state.voiceAttempts }],
      collectibles: state.collectibles,
      planetProgress: state.planetProgress,
      currentSceneId: state.currentScene!.id,
      currentCategory: state.currentScene!.category,
      combo: state.combo,
      todayCompletedScenes: 0,
      todayVisitedPlanets: [state.currentScene!.category],
    };

    // 异步：检查成就
    Promise.all([getGameProgress(), getAchievementProgress()])
      .then(async ([gameProgress, apList]) => {
        ctx.gameProgress = gameProgress;
        ctx.todayCompletedScenes = gameProgress.filter((p) => p.completed).length;

        // 检查成就
        const newUnlockIds = checkAchievements(ctx);
        const now = Date.now();
        const updatedList = apList.map((ap) => {
          if (newUnlockIds.includes(ap.achievementId) && !ap.unlocked) {
            return { ...ap, unlocked: true, unlockedAt: now, progress: 100 };
          }
          // 更新进度
          const ach = ALL_ACHIEVEMENTS.find((a) => a.id === ap.achievementId);
          if (ach) {
            return { ...ap, progress: ach.progress(ctx) };
          }
          return ap;
        });

        // 补充新成就（首次遇到）
        for (const id of newUnlockIds) {
          if (!updatedList.find((p) => p.achievementId === id)) {
            updatedList.push({ achievementId: id, unlocked: true, unlockedAt: now, progress: 100 });
          }
        }

        await saveAllAchievementProgress(updatedList);

        // 如果有新解锁，通知 UI
        const newlyUnlocked = updatedList.filter(
          (p) => p.unlocked && p.unlockedAt === now,
        );
        if (newlyUnlocked.length > 0) {
          set({
            pendingAchievementUnlocks: newlyUnlocked.map((p) => ({
              achievementId: p.achievementId,
              timestamp: now,
            })),
          });
        }
      })
      .catch(() => {});

    // 异步：更新每日任务
    getDailyTaskProgress(getTodayStr())
      .then((existing) => {
        const tasks = getTodayTasks();
        const merged = mergeTaskProgress(tasks, ctx, existing ?? null);
        return saveDailyTaskProgress(merged);
      })
      .catch(() => {});
  },

  // ---- 下一场景 ----
  nextScene: () => {
    const { gameState, scenes, currentSceneIndex } = get();
    if (gameState !== 'progressUpdate' && gameState !== 'completed') return;

    const effectiveScenes = scenes.length > 0 ? scenes : getActiveScenes();
    const nextIndex = currentSceneIndex + 1;
    if (nextIndex < effectiveScenes.length) {
      set({
        currentSceneIndex: nextIndex,
        currentScene: effectiveScenes[nextIndex],
        wrongAnswerHint: null,
        selectedOptionIndex: null,
        isCorrect: null,
        interactionMode: 'single-choice',
        currentStepIndex: 0,
        allStepsCorrect: null,
  pendingAchievementUnlocks: [],
      });
      // 触发新场景加载
      setTimeout(() => {
        get().startScene();
      }, 100);
    } else {
      set({ gameState: 'completed' });
    }
  },

  // ---- 标记已看过开场故事 ----
  markIntroSeen: () => {
    set({ hasSeenIntro: true });
    localStorage.setItem('star-adventure-intro-seen', 'true');
  },

  // ---- v3: 确认成就弹窗 ----
  acknowledgeAchievement: (achievementId: string) => {
    set((s) => ({
      pendingAchievementUnlocks: s.pendingAchievementUnlocks.filter(
        (e) => e.achievementId !== achievementId,
      ),
    }));
  },

  // ---- 工具 ----
  setSTTMode: (mode: STTMode) => set({ sttMode: mode }),

  // ---- v4: 难度等级 ----
  setDifficultyLevel: (level: DifficultyLevel) => set({ difficultyLevel: level }),
  setHasAssessment: (value: boolean) => set({ hasAssessment: value }),
  setShowAssessment: (value: boolean) => set({ showAssessment: value }),

  applyAssessment: (level: AbilityLevel) => {
    const dl = level as unknown as DifficultyLevel;
    const orderedScenes = getRecommendedSceneOrder(dl);
    // 同步写入 localStorage，确保页面刷新后立即可用（不等 IndexedDB）
    try { localStorage.setItem(DIFFICULTY_STORAGE_KEY, dl); } catch {}
    set({
      difficultyLevel: dl,
      hasAssessment: true,
      showAssessment: false,
      scenes: orderedScenes,
      currentSceneIndex: 0,
      currentScene: orderedScenes[0] ?? null,
    });
  },

  resetGame: () => {
    set({
      gameState: 'idle',
      currentSceneIndex: 0,
      currentScene: get().scenes[0] ?? null,
      stars: 0,
      voiceAttempts: 0,
      combo: 0,
      collectibles: [],
      planetProgress: get().planetProgress.map((p) => ({
        ...p,
        completed: false,
        completedScenes: 0,
        heartEarned: false,
      })),
      interactionMode: 'single-choice',
      currentStepIndex: 0,
      allStepsCorrect: null,
      pendingAchievementUnlocks: [],
      selectedOptionIndex: null,
      isCorrect: null,
      voicePromptMessage: '',
      wrongAnswerHint: null,
    });
  },
}));
