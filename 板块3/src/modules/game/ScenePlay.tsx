/**
 * 场景互动页面 — 板块3 实现 v2
 *
 * 支持三种交互模式：
 *   1. single-choice — 3选1单选题（原有逻辑）
 *   2. multi-step — 多步对话（如"想喝水"）
 *   3. emotion-recognition — 情绪脸谱识别（如"感到开心"）
 *
 * v2 新增叙事节拍：introText / successText / outroText
 *
 * ASD 友好约束：字体 ≥ 20px、无闪烁动画、WCAG AA 对比度。
 * STT 降级：统一通过 lib/stt.ts 处理。
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useGame } from './useGame';
import { CelebrationAnimation } from '@/components/shared/CelebrationAnimation';
import { StarProgress } from '@/components/shared/StarProgress';
import { InteractiveScene } from '@/components/interactive';
import { AchievementToast } from '@/modules/achievements';
import { getAchievementById } from '@/modules/achievements';
import { getActiveScenes, getSceneForDifficulty } from '@/data/scenes';
import { PLANET_EMOJIS, PLANET_NAMES } from '@/types';

export default function ScenePlay() {
  const { sceneId } = useParams<{ sceneId: string }>();
  const navigate = useNavigate();

  const {
    gameState,
    sttMode,
    currentScene,
    currentSceneIndex,
    totalScenes,
    stars,
    combo,
    isCorrect,
    selectedOptionIndex,
    voicePromptMessage,
    wrongAnswerHint,
    interactionMode,
    currentStepIndex,
    difficultyLevel,
    startScene,
    selectOption,
    submitEmotion,
    onCelebrationComplete,
    onVoiceComplete,
    nextScene,
    startVoiceRecognition,
    getCelebrationLevel,
    isPlanetCompleting,
    pendingAchievementUnlocks,
    acknowledgeAchievement,
  } = useGame();

  const [voiceState, setVoiceState] = useState<
    'idle' | 'listening' | 'success' | 'failed' | 'click_confirm'
  >('idle');
  const [voiceError, setVoiceError] = useState<string>('');

  // 确保场景已加载 — 始终应用难度变体
  const activeScenes = getActiveScenes();
  const rawScene = currentScene
    || activeScenes.find((s) => s.id === sceneId)
    || activeScenes[currentSceneIndex];
  // v5: 无论场景来源，始终应用难度变体
  const scene = rawScene ? getSceneForDifficulty(rawScene, difficultyLevel) : null;

  // 当前星球信息
  const planetCategory = scene?.category;
  const planetName = planetCategory ? PLANET_NAMES[planetCategory] : '';
  const planetEmoji = planetCategory ? PLANET_EMOJIS[planetCategory] : '';

  // 初始化场景
  useEffect(() => {
    if (gameState === 'idle' && scene) {
      startScene();
      setVoiceState('idle');
    }
  }, [gameState, scene]);

  // ---- 处理语音鼓励 ----
  const handleVoicePrompt = useCallback(async () => {
    setVoiceState('listening');
    setVoiceError('');

    const result = await startVoiceRecognition();

    if (result.success) {
      setVoiceState('success');
      setTimeout(() => {
        setVoiceState('idle');
        onVoiceComplete();
      }, 800);
    } else {
      // 根据具体错误码给出友好提示
      const errorMsg =
        result.error === 'not_supported'
          ? '当前浏览器不支持语音识别'
          : result.error === 'timeout'
            ? '没有听到声音，点一下按钮代替吧'
            : result.error === 'no_speech'
              ? '没有听到声音，再试一次或点按钮跳过'
              : result.error === 'permission_denied'
                ? '麦克风权限未开启，请在浏览器设置中允许'
              : result.error === 'no_audio_device'
                ? '未检测到麦克风，请检查设备'
              : result.error === 'network_error'
                ? '网络连接问题，语音识别需要联网'
              : '语音识别出了点问题，点一下按钮代替吧';

      setVoiceState('failed');
      setVoiceError(errorMsg);
    }
  }, [sttMode, startVoiceRecognition, onVoiceComplete]);

  // 手动确认（降级路径）
  const handleManualConfirm = useCallback(() => {
    setVoiceState('idle');
    onVoiceComplete();
  }, [onVoiceComplete]);

  // 处理庆祝完成
  const handleCelebrationDone = useCallback(() => {
    onCelebrationComplete();
  }, [onCelebrationComplete]);

  // 处理下一场景
  const handleNextScene = useCallback(() => {
    nextScene();
  }, [nextScene]);

  // 当 gameState 变为 sceneLoading 且 currentSceneIndex 变化时，自动导航
  const prevSceneIndexRef = useRef(currentSceneIndex);
  useEffect(() => {
    if (gameState === 'completed') {
      navigate('/game');
    } else if (prevSceneIndexRef.current !== currentSceneIndex) {
      const nextSceneData = activeScenes[currentSceneIndex];
      if (nextSceneData) {
        navigate(`/game/${nextSceneData.id}`, { replace: true });
      }
      prevSceneIndexRef.current = currentSceneIndex;
    }
  }, [gameState, currentSceneIndex, activeScenes, navigate]);

  // 返回主页
  const handleBackHome = useCallback(() => {
    navigate('/game');
  }, [navigate]);

  // ---- 渲染 ----

  if (!scene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50">
        <div className="text-center space-y-4">
          <p className="text-6xl">🔍</p>
          <p className="text-2xl text-gray-600" style={{ fontSize: '24px' }}>
            场景未找到
          </p>
          <button
            onClick={handleBackHome}
            className="px-6 py-3 text-xl rounded-2xl bg-indigo-500 text-white"
            style={{ fontSize: '22px', minHeight: '56px' }}
          >
            返回星球地图
          </button>
        </div>
      </div>
    );
  }

  const isShowingScene =
    gameState === 'sceneLoading' ||
    gameState === 'presenting' ||
    gameState === 'waitingForAnswer' ||
    gameState === 'judging';
  const showJudging = gameState === 'judging';
  const showCelebrating = gameState === 'celebrating';
  const showVoicePrompt = gameState === 'voicePrompt';
  const showProgressUpdate = gameState === 'progressUpdate';
  const showCompleted = gameState === 'completed';

  // 多步场景：获取当前步骤
  const currentStep = interactionMode === 'multi-step' && scene.steps
    ? scene.steps[currentStepIndex]
    : null;

  // 庆祝级别
  const celebrationLevel = getCelebrationLevel();

  // 庆祝消息
  const celebrationMessage =
    celebrationLevel === 'planet'
      ? `💎 ${planetName}的能量充满了！获得星球之心！`
      : celebrationLevel === 'shining'
        ? `🌟 连击 x${combo}！获得闪耀星！`
        : '太棒了！获得了一颗星星！⭐';

  // 从 voicePrompt 中提取要练习的句子
  const practiceSentence = (() => {
    if (!scene) return '';
    const vp = scene.voicePrompt;
    // 提取中文引号中的内容
    const quoted = vp.match(/[""「」]([^""「」]+)[""「」]/);
    if (quoted) return quoted[1];
    // 去掉常见前后缀和 emoji
    return vp
      .replace(/^[^"「]*?(?="|「)/, '')
      .replace(/[🎤🙏😊💧🌅🚽🧸👋😨😢]/g, '')
      .replace(/吧！.*$/, '')
      .trim()
      .replace(/^[""「」]|[""「」]$/g, '');
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackHome}
            className="flex items-center gap-2 px-4 py-2 text-base text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white/50 transition-colors"
            style={{ fontSize: '18px', minHeight: '48px' }}
          >
            ← 星球地图
          </button>
          <div className="flex items-center gap-2">
            {planetEmoji && (
              <span className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
                {planetEmoji} {planetName}
              </span>
            )}
            <span className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
              第 {currentSceneIndex + 1} / {totalScenes} 关
            </span>
          </div>
        </div>

        {/* ========== 互动式场景（插画 + 热点 + 场景卡片 + 选项） ========== */}
        {isShowingScene && (
          <InteractiveScene
            scene={scene}
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            gameState={gameState}
            interactionMode={interactionMode}
            stars={stars}
            totalScenes={totalScenes}
            onSelectOption={selectOption}
            onSubmitEmotion={submitEmotion}
          />
        )}

        {/* ========== 判断结果 ========== */}
        {showJudging && (
          <div
            className={`rounded-3xl p-6 text-center space-y-4 transition-all duration-300 ${
              isCorrect
                ? 'bg-green-50 border-2 border-green-300'
                : 'bg-orange-50 border-2 border-orange-300'
            }`}
            style={{ animation: 'fadeInUp 0.3s ease-out' }}
          >
            {isCorrect ? (
              <>
                <p className="text-5xl" aria-hidden="true">
                  {interactionMode === 'emotion-recognition' && selectedOptionIndex !== null
                    ? '🎉'
                    : '🎉'}
                </p>
                <p className="text-2xl font-bold text-green-700" style={{ fontSize: '26px' }}>
                  {interactionMode === 'multi-step' && currentStep
                    ? `第 ${currentStepIndex + 1} 步完成！`
                    : interactionMode === 'emotion-recognition'
                      ? '认对了！'
                      : '答对了！'}
                </p>
                {/* 答对后的叙事 */}
                {scene.successText && interactionMode !== 'multi-step' && (
                  <p
                    className="text-lg text-green-600 leading-relaxed"
                    style={{ fontSize: '20px', lineHeight: '1.7' }}
                  >
                    {scene.successText}
                  </p>
                )}
                {combo >= 2 && (
                  <p className="text-sm text-yellow-600 font-semibold" style={{ fontSize: '18px' }}>
                    🔥 连击 x{combo}！
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-4xl" aria-hidden="true">💪</p>
                <p className="text-xl font-semibold text-orange-600" style={{ fontSize: '22px' }}>
                  {wrongAnswerHint || '再试试看～'}
                </p>
              </>
            )}
          </div>
        )}

        {/* ========== 庆祝动画 ========== */}
        <CelebrationAnimation
          show={showCelebrating}
          message={celebrationMessage}
          onComplete={handleCelebrationDone}
          level={celebrationLevel}
        />

        {/* ========== 跟读练习环节 ========== */}
        {showVoicePrompt && (
          <div
            className="bg-white rounded-3xl shadow-lg border-2 border-indigo-200 p-6 space-y-5 text-center"
            style={{ animation: 'fadeInUp 0.3s ease-out' }}
          >
            <p className="text-4xl" aria-hidden="true">🗣️</p>
            <p className="text-2xl font-bold text-indigo-700" style={{ fontSize: '26px' }}>
              {voicePromptMessage}
            </p>

            {/* 要练习的句子 — 大字突出显示 */}
            <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 border-dashed">
              <p className="text-sm text-yellow-600 mb-2" style={{ fontSize: '16px' }}>
                💬 请大声说出下面这句话：
              </p>
              <p
                className="text-3xl font-bold text-yellow-700 leading-relaxed"
                style={{ fontSize: '32px', lineHeight: '1.6' }}
              >
                「{practiceSentence}」
              </p>
            </div>

            {/* 语音按钮（可选的麦克风输入） */}
            {sttMode === 'voice' && voiceState !== 'click_confirm' && (
              <div className="space-y-3">
                <button
                  onClick={handleVoicePrompt}
                  disabled={voiceState === 'listening' || voiceState === 'success'}
                  className={`w-full py-4 text-xl font-bold rounded-2xl text-white shadow-md transition-all duration-300 ${
                    voiceState === 'listening'
                      ? 'bg-indigo-300 animate-pulse'
                      : voiceState === 'success'
                        ? 'bg-green-400'
                        : 'bg-indigo-400 hover:bg-indigo-500 hover:shadow-lg active:scale-95'
                  }`}
                  style={{ fontSize: '22px', minHeight: '56px' }}
                >
                  {voiceState === 'listening'
                    ? '🎙️ 正在听...'
                    : voiceState === 'success'
                      ? '✅ 听到了！'
                      : voiceState === 'failed'
                        ? '🔄 再试一次'
                        : '🎤 用麦克风说'}
                </button>

                {voiceState === 'listening' && (
                  <p className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
                    请对着麦克风说出上面的句子～
                  </p>
                )}

                {voiceState === 'failed' && (
                  <p className="text-base text-orange-500" style={{ fontSize: '18px' }}>
                    {voiceError}
                  </p>
                )}
              </div>
            )}

            {/* 确认按钮（主体操作） */}
            <div className={sttMode === 'voice' ? 'pt-2 border-t border-gray-100' : ''}>
              {sttMode === 'click-only' && (
                <p className="text-sm text-gray-400 mb-3" style={{ fontSize: '16px' }}>
                  💡 大声说出来，然后点击下方按钮继续～
                </p>
              )}
              <button
                onClick={handleManualConfirm}
                className="w-full py-5 text-2xl font-bold rounded-2xl text-white shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
                style={{
                  fontSize: '26px',
                  minHeight: '68px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                👍 我说完了！
              </button>
            </div>
          </div>
        )}

        {/* ========== 进度更新 → 下一场景 ========== */}
        {showProgressUpdate && (
          <div className="space-y-4 text-center" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
            {/* outro 文案 */}
            {scene.outroText && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p
                  className="text-lg leading-relaxed text-gray-600"
                  style={{ fontSize: '20px', lineHeight: '1.8' }}
                >
                  {scene.outroText}
                </p>
              </div>
            )}
            <StarProgress current={stars} total={totalScenes} />
            <button
              onClick={handleNextScene}
              className="w-full py-5 text-2xl font-bold rounded-2xl text-white shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
              style={{
                fontSize: '24px',
                minHeight: '64px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {currentSceneIndex + 1 < totalScenes ? '🚀 下一个冒险' : '🏆 查看成绩'}
            </button>
          </div>
        )}

        {/* ========== 全部完成 ========== */}
        {showCompleted && (
          <div
            className="bg-white rounded-3xl shadow-lg border-2 border-yellow-300 p-8 text-center space-y-6"
            style={{ animation: 'fadeInUp 0.5s ease-out' }}
          >
            <p className="text-6xl" aria-hidden="true">🏆</p>
            <h2 className="text-3xl font-bold text-yellow-600" style={{ fontSize: '32px' }}>
              全部通关！
            </h2>
            <p className="text-xl text-gray-600" style={{ fontSize: '22px' }}>
              四颗星球全部点亮，星宝可以回家了！
            </p>
            <p className="text-lg text-gray-500" style={{ fontSize: '20px' }}>
              他学会了打招呼、说谢谢、表达感受和说出需求。
              妈妈在家里等着给他一个大大的拥抱。
            </p>
            <StarProgress current={stars} total={totalScenes} />
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBackHome}
                className="flex-1 py-4 text-xl font-bold rounded-2xl bg-indigo-500 text-white shadow-md hover:shadow-lg transition-all"
                style={{ fontSize: '22px', minHeight: '56px' }}
              >
                🗺️ 星球地图
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 成就解锁弹窗 */}
      {pendingAchievementUnlocks.length > 0 && (() => {
        const ach = getAchievementById(pendingAchievementUnlocks[0].achievementId);
        if (!ach) return null;
        return (
          <AchievementToast
            achievement={ach}
            visible={true}
            onClose={() => acknowledgeAchievement(pendingAchievementUnlocks[0].achievementId)}
          />
        );
      })()}

      {/* ASD 友好动画定义 */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
