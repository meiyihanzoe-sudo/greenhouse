/**
 * 安抚建议卡片 — 板块1 使用
 *
 * 展示标题、步骤列表、推荐工具快捷按钮、免责声明
 * 约束：每条建议必须展示免责声明"仅供参考，必要时咨询专业治疗师"
 */

import type { AdviceContent } from '@/types';

export interface CalmingAdviceCardProps {
  advice: AdviceContent;
  onToolClick?: (tool: string) => void;
}

const TOOL_LABELS: Record<string, string> = {
  breathing: '🧘 呼吸引导',
  sensory: '🤚 感官接地',
  aac_jump: '💬 去 AAC 沟通',
  game_jump: '🎮 去游戏放松',
};

export function CalmingAdviceCard({ advice, onToolClick }: CalmingAdviceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      {/* 标题 */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{advice.title}</h3>
      <p className="text-base text-gray-500 mb-4">{advice.description}</p>

      {/* 步骤列表 */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">建议步骤：</h4>
        <ol className="space-y-2">
          {advice.steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-base text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 推荐工具快捷按钮 */}
      {advice.tools.length > 0 && onToolClick && (
        <div className="flex flex-wrap gap-2 mb-4">
          {advice.tools.map((tool) => (
            <button
              key={tool}
              onClick={() => onToolClick(tool)}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-base font-medium
                         hover:bg-blue-100 active:scale-[0.97] transition-all"
            >
              {TOOL_LABELS[tool] ?? tool}
            </button>
          ))}
        </div>
      )}

      {/* 免责声明 */}
      <div className="border-t border-gray-100 pt-3 mt-3">
        <p className="text-sm text-red-500 font-medium">
          ⚠️ {advice.disclaimer}
        </p>
      </div>
    </div>
  );
}
