/**
 * EmotionPicker — 情绪脸谱识别选择器
 *
 * 从 ScenePlay.tsx 提取。
 * 3列网格，每格显示 emoji + 标签，点击调用 submitEmotion(idx)。
 */

interface EmotionPickerProps {
  emotionOptions: { emoji: string; label: string; correct: boolean }[];
  description: string;
  onSubmitEmotion: (index: number) => void;
}

export function EmotionPicker({
  emotionOptions,
  description,
  onSubmitEmotion,
}: EmotionPickerProps) {
  const keyword = description.includes('开心')
    ? '开心'
    : description.includes('难过')
      ? '难过'
      : description.includes('害怕')
        ? '害怕'
        : '正确';

  return (
    <div className="space-y-4" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
      <p
        className="text-lg text-gray-500 text-center"
        style={{ fontSize: '20px' }}
      >
        先来认一认：哪个是{keyword}的表情？
      </p>
      <div className="grid grid-cols-3 gap-4">
        {emotionOptions.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSubmitEmotion(idx)}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg active:scale-[0.98] transition-all duration-300"
            style={{ minHeight: '100px' }}
          >
            <span className="text-5xl" aria-hidden="true">
              {opt.emoji}
            </span>
            <span
              className="font-medium text-gray-600"
              style={{ fontSize: '20px' }}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
