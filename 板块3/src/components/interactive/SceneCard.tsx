/**
 * SceneCard — 场景信息卡片
 *
 * 从 ScenePlay.tsx 提取，包含：
 *   - introText 蓝底卡片
 *   - emoji + 标题 + 多步步数指示
 *   - 情境描述紫底卡片
 *   - StarProgress 进度条
 *
 * 此组件纯展示，无交互逻辑。
 */

import { StarProgress } from '@/components/shared/StarProgress';
import type { SceneStep } from '@/types';
import type { SceneData } from '@/data/scenes';

interface SceneCardProps {
  scene: SceneData;
  currentStep: SceneStep | null;
  currentStepIndex: number;
  stars: number;
  totalScenes: number;
}

export function SceneCard({
  scene,
  currentStep,
  currentStepIndex,
  stars,
  totalScenes,
}: SceneCardProps) {
  return (
    <>
      {/* intro 文案（如果有） */}
      {scene.introText && (
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <p
            className="text-base leading-relaxed text-indigo-600"
            style={{ fontSize: '18px', lineHeight: '1.7' }}
          >
            {scene.introText}
          </p>
        </div>
      )}

      {/* 标题区（注意：emoji 和标题由 SceneIllustration 负责展示，这里仅展示步数指示器） */}
      {currentStep && (
        <div className="text-center">
          <span
            className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm"
            style={{ fontSize: '16px' }}
          >
            第 {currentStepIndex + 1} / {scene.steps!.length} 步
          </span>
        </div>
      )}

      {/* 情境描述 */}
      <div className="bg-purple-50 rounded-2xl p-5">
        <p
          className="text-lg leading-relaxed text-gray-700"
          style={{ fontSize: '22px', lineHeight: '1.8' }}
        >
          {currentStep ? currentStep.description : scene.description}
        </p>
      </div>

      {/* 进度条 */}
      <StarProgress current={stars} total={totalScenes} />
    </>
  );
}
