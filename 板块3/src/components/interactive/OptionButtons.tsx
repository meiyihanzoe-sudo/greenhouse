/**
 * OptionButtons — 场景选项按钮组
 *
 * 从 ScenePlay.tsx 提取。
 * 竖向列表，每个按钮显示选项文本，点击调用 selectOption(idx)。
 */

interface OptionButtonsProps {
  options: { text: string; correct: boolean }[];
  onSelectOption: (index: number) => void;
}

export function OptionButtons({ options, onSelectOption }: OptionButtonsProps) {
  return (
    <div className="space-y-3" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
      <p className="text-lg text-gray-500 text-center" style={{ fontSize: '20px' }}>
        你会怎么做呢？选一个吧！
      </p>
      <div className="grid gap-3">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelectOption(idx)}
            className="w-full p-5 rounded-2xl text-left font-medium transition-all duration-300 bg-white border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg active:scale-[0.98] text-gray-700"
            style={{ fontSize: '22px', minHeight: '64px' }}
            aria-label={`选项 ${idx + 1}: ${option.text}`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
