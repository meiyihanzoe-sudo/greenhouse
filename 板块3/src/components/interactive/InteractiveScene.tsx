/**
 * InteractiveScene — 互动式场景主组件
 *
 * 组合插画、热点、场景卡片、情绪识别、选项按钮为一体。
 * 渐进增强：有插画时显示互动画面 + 热点，无插画时降级为 emoji。
 *
 * 仅负责渲染，不管理状态机。所有状态和回调由父组件（ScenePlay）传入。
 */

import { useMemo } from 'react';
import type { SceneStep } from '@/types';
import type { SceneData } from '@/data/scenes';
import type { GameState, InteractionMode } from '@/modules/game/gameStore';
import { SceneIllustration } from './SceneIllustration';
import { SceneCard } from './SceneCard';
import { EmotionPicker } from './EmotionPicker';
import { OptionButtons } from './OptionButtons';

interface InteractiveSceneProps {
  scene: SceneData;
  currentStep: SceneStep | null;
  currentStepIndex: number;
  gameState: GameState;
  interactionMode: InteractionMode;
  stars: number;
  totalScenes: number;
  onSelectOption: (index: number) => void;
  onSubmitEmotion: (index: number) => void;
}

export function InteractiveScene({
  scene,
  currentStep,
  currentStepIndex,
  gameState,
  interactionMode,
  stars,
  totalScenes,
  onSelectOption,
  onSubmitEmotion,
}: InteractiveSceneProps) {
  // 当前有效的插画：优先使用步骤级插画，其次场景级
  const illustration = useMemo(
    () => currentStep?.illustration ?? scene.illustration,
    [currentStep, scene],
  );

  const hasIllustration = illustration != null && illustration.generatedBy !== 'none';
  const isWaiting = gameState === 'waitingForAnswer';

  // 当前选项：多步场景取步骤选项，否则取场景选项
  const currentOptions = currentStep ? currentStep.options : scene.options;

  // 热点点击处理：区分情绪识别模式
  const handleHotspotClick = (optionIndex: number) => {
    if (!isWaiting) return;
    if (interactionMode === 'emotion-recognition') {
      onSubmitEmotion(optionIndex);
    } else {
      onSelectOption(optionIndex);
    }
  };

  return (
    <div
      className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 space-y-5 transition-all duration-500"
      style={{ animation: 'fadeInUp 0.4s ease-out' }}
    >
      {/* ====== 插画区域（含热点）或 emoji 降级 ====== */}
      <SceneIllustration
        illustration={hasIllustration ? illustration : undefined}
        emoji={scene.emoji}
        title={scene.title}
        disabled={!isWaiting}
        onHotspotClick={handleHotspotClick}
      />

      {/* 无插画时显示标题 */}
      {!hasIllustration && (
        <div className="text-center">
          <h2
            className="text-2xl font-bold text-gray-800"
            style={{ fontSize: '28px' }}
          >
            {scene.title}
          </h2>
        </div>
      )}

      {/* ====== 场景信息卡片 ====== */}
      <SceneCard
        scene={scene}
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        stars={stars}
        totalScenes={totalScenes}
      />

      {/* ====== 交互区域（仅在 waitingForAnswer 时显示） ====== */}
      {isWaiting && (
        <>
          {interactionMode === 'emotion-recognition' && scene.emotionOptions ? (
            <EmotionPicker
              emotionOptions={scene.emotionOptions}
              description={scene.description}
              onSubmitEmotion={onSubmitEmotion}
            />
          ) : (
            <OptionButtons
              options={currentOptions}
              onSelectOption={onSelectOption}
            />
          )}
        </>
      )}
    </div>
  );
}
