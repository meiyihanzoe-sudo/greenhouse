/**
 * SpeechButton — 板块2 实现，板块3 调用
 * 占位组件
 */
export interface SpeechButtonProps {
  text: string;
  imageBase64?: string;
  color?: string;
  size?: 'normal' | 'large';
  onClick?: () => void;
}

export function SpeechButton({
  text,
  imageBase64,
  color = '#4CAF50',
  size = 'normal',
  onClick,
}: SpeechButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl text-white font-medium transition-all hover:shadow-md active:scale-95"
      style={{
        fontSize: size === 'large' ? '24px' : '20px',
        minHeight: '48px',
        backgroundColor: color,
      }}
    >
      {text}
    </button>
  );
}
