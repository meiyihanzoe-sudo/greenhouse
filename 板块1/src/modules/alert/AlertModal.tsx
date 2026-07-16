/**
 * 提醒弹窗 — 板块1
 *
 * L2/L3 持续 8s 触发后，显示页面弹窗 + 情绪类型选择 + 安抚建议
 */

import { useState } from 'react';
import type { ArousalLevel, EmotionType } from '@/types';
import { EmotionTypeSelector } from '@/components/shared/EmotionTypeSelector';
import { CalmingAdviceCard } from '@/components/shared/CalmingAdviceCard';
import { getAdvice } from '@/lib/advice';
import { logEmotionEvent } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';

export interface AlertModalProps {
  show: boolean;
  level: ArousalLevel | null;
  onDismiss: () => void;
}

export type AlertPhase = 'alert' | 'select' | 'advice' | 'tool-detail';

interface ToolDetail {
  key: string;
  title: string;
  steps: string[];
  videoUrl?: string;
}

const TOOL_DETAILS: Record<string, ToolDetail> = {
  breathing: {
    key: 'breathing',
    title: '🧘 呼吸引导（4-2-6 呼吸法）',
    steps: [
      '找一个安静的角落，让孩子或家长先坐下或站定',
      '缓慢吸气 4 秒，感受腹部鼓起',
      '屏住呼吸 2 秒',
      '缓慢呼气 6 秒，用嘴轻轻吐气',
      '重复 5-10 次，直到心率下降',
      '如果孩子太小，家长可以用手做示范，让孩子跟着模仿',
    ],
    videoUrl: 'https://example.com/breathing-guide.mp4', // TODO: 替换为真实视频
  },
  sensory: {
    key: 'sensory',
    title: '🤚 5-4-3-2-1 感官接地法',
    steps: [
      '让孩子说出 5 样能看到的东西',
      '让孩子说出 4 样能触摸到的东西',
      '让孩子说出 3 样能听到的声音',
      '让孩子说出 2 样能闻到的气味',
      '让孩子说出 1 样能尝到的味道',
      '如果孩子说不出来，家长可以引导描述环境，帮助回到当下',
    ],
    videoUrl: 'https://example.com/sensory-guide.mp4', // TODO: 替换为真实视频
  },
};

export default function AlertModal({ show, level, onDismiss }: AlertModalProps) {
  const [phase, setPhase] = useState<AlertPhase>('alert');
  const [selectedType, setSelectedType] = useState<EmotionType | null>(null);
  const [toolDetail, setToolDetail] = useState<ToolDetail | null>(null);
  const navigate = useNavigate();

  if (!show || !level) return null;

  const advice = selectedType ? getAdvice(selectedType) : null;

  const handleSelectEmotion = async (type: EmotionType) => {
    setSelectedType(type);
    setPhase('advice');

    // 记录情绪事件
    try {
      await logEmotionEvent({
        timestamp: Date.now(),
        arousalLevel: level,
        emotionType: type,
      });
    } catch {
      // IndexedDB 记录失败，静默处理
    }
  };

  const handleToolClick = (tool: string) => {
    if (tool === 'aac_jump') {
      handleClose();
      navigate('/aac');
    } else if (tool === 'game_jump') {
      handleClose();
      navigate('/game');
    } else if (tool === 'breathing' || tool === 'sensory') {
      setToolDetail(TOOL_DETAILS[tool]);
      setPhase('tool-detail');
    }
  };

  const handleClose = () => {
    setPhase('alert');
    setSelectedType(null);
    setToolDetail(null);
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* 弹窗 */}
      <div className="relative w-full sm:max-w-lg max-h-[85vh] overflow-y-auto
                      bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6
                      animate-[slideUp_0.3s_ease-out]">
        {/* 右上角关闭叉 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 text-gray-500
                     text-xl flex items-center justify-center hover:bg-gray-200 transition-all z-10"
          aria-label="关闭"
        >
          ✕
        </button>

        {phase === 'alert' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-3xl">🔔</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              孩子可能有较大情绪波动
            </h2>
            <div className={`px-4 py-2 rounded-full text-xl font-bold ${
              level === 'L3' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
            }`}>
              激烈程度：{level}
            </div>
            <p className="text-base text-gray-500 text-center">
              请先保持冷静，观察孩子状况，然后点击下方按钮选择最接近的情况。
            </p>
            <button
              onClick={() => setPhase('select')}
              className="w-full min-h-[56px] rounded-xl bg-green-500 text-white text-xl font-bold
                         hover:bg-green-600 active:scale-[0.97] transition-all"
            >
              选择情绪类型
            </button>
          </div>
        )}

        {phase === 'select' && (
          <div className="py-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">选择情绪类型</h2>
              <button
                onClick={() => setPhase('alert')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← 返回
              </button>
            </div>
            <EmotionTypeSelector onSelect={handleSelectEmotion} />
          </div>
        )}

        {phase === 'advice' && advice && (
          <div className="py-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">安抚建议</h2>
              <button
                onClick={handleClose}
                className="min-h-[40px] px-4 rounded-xl bg-green-500 text-white text-base font-medium
                           hover:bg-green-600 active:scale-[0.97] transition-all"
              >
                完成 ✓
              </button>
            </div>
            <CalmingAdviceCard advice={advice} onToolClick={handleToolClick} />
          </div>
        )}

        {phase === 'tool-detail' && toolDetail && (
          <div className="py-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{toolDetail.title}</h2>
              <button
                onClick={() => setPhase('advice')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← 返回
              </button>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 mb-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">操作步骤</h3>
              <ol className="space-y-3">
                {toolDetail.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-base text-blue-900">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {toolDetail.videoUrl && (
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">视频指引</h3>
                <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">视频加载中…</p>
                  {/* TODO: 替换为真实视频播放器 */}
                  {/* <video src={toolDetail.videoUrl} controls className="w-full rounded-xl" /> */}
                </div>
                <p className="text-sm text-gray-400 mt-2">当前为占位视频，可替换为本地视频文件或外链</p>
              </div>
            )}

            <button
              onClick={() => setPhase('advice')}
              className="w-full mt-4 min-h-[56px] rounded-xl bg-gray-100 text-gray-700 text-lg font-medium
                         hover:bg-gray-200 active:scale-[0.97] transition-all"
            >
              知道了，返回建议
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
