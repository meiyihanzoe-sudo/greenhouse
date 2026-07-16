// ========== 板块3 类型 ==========

/** 游戏场景 */
export interface GameScene {
  id: string;
  title: string;
  description: string;
  options: { text: string; correct: boolean }[];
  category: 'greeting' | 'thanks' | 'emotion' | 'request';
}

/** 游戏进度 */
export interface GameProgress {
  sceneId: string;
  completed: boolean;
  stars: number;
  attempts: number;
}

/** 场景类型 */
export type SceneType = 'single-choice' | 'multi-step' | 'emotion-recognition';

/** 难度等级 */
export type DifficultyLevel = 'sprout' | 'growing' | 'blooming';

/** 自定义场景（家长创建） */
export interface CustomScene {
  id: string;           // 格式: "custom-{timestamp}"
  title: string;
  emoji: string;
  description: string;
  category: 'greeting' | 'thanks' | 'emotion' | 'request';
  sceneType: SceneType;
  difficultyLevel: DifficultyLevel;

  // 单选题字段
  options: { text: string; correct: boolean }[];
  optionHints?: (string | null)[];
  voicePrompt: string;
  introText: string;
  successText: string;
  outroText: string;

  // 多步场景字段
  steps?: {
    description: string;
    options: { text: string; correct: boolean }[];
    hints?: (string | null)[];
  }[];

  // 情绪识别字段
  emotionOptions?: { emoji: string; label: string; correct: boolean }[];

  // 元数据
  createdAt: number;
  updatedAt?: number;
}

/** 难度等级中文名 */
export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  sprout: '🌱 简单',
  growing: '🌿 中等',
  blooming: '🌳 挑战',
};

/** 多步场景的步骤定义 */
export interface SceneStep {
  /** 步骤描述 */
  description: string;
  /** 该步骤的选项 */
  options: { text: string; correct: boolean }[];
  /** 错误选项的引导提示（与 options 一一对应，仅非正确选项需要） */
  hints?: (string | null)[];
  /** 该步骤的互动插画（可选） */
  illustration?: IllustrationAsset;
}

// ========== 互动插画相关类型 ==========

/** 插画中可交互的热点区域 */
export interface IllustrationHotspot {
  /** 热点唯一标识 */
  id: string;
  /** 热点在插画中的位置（百分比，0-100） */
  x: number;
  y: number;
  /** 热点区域的宽高（百分比） */
  width: number;
  height: number;
  /** 热点标签（ASD友好，简短文字 + emoji） */
  label: string;
  /** 关联的场景选项索引（点击该热点等同于选择对应选项） */
  linkedOptionIndex: number;
  /** 热点动画提示类型 */
  hintAnimation?: 'pulse' | 'bounce' | 'glow' | 'none';
}

/** 插画资源定义 */
export interface IllustrationAsset {
  /** 插画图片 URL（相对路径或 CDN 地址） */
  imageUrl: string;
  /** 插画缩略图（用于预加载预览） */
  thumbnailUrl?: string;
  /** 插画 alt 文本（无障碍） */
  alt: string;
  /** 插画尺寸 */
  width: number;
  height: number;
  /** 热点列表 */
  hotspots: IllustrationHotspot[];
  /** 生成方式 */
  generatedBy: 'ai-dalle' | 'ai-midjourney' | 'ai-stablediffusion' | 'manual' | 'none';
  /** 生成用的提示词（用于后续复现/调优） */
  prompt?: string;
}

/** 收集物类型 */
export type CollectibleType = 'star' | 'shining_star' | 'planet_heart';

/** 收集物 */
export interface Collectible {
  type: CollectibleType;
  /** 来源场景 ID */
  sceneId: string;
  /** 获取时间戳 */
  earnedAt: number;
}

/** 星球（分类）完成状态 */
export interface PlanetProgress {
  category: 'greeting' | 'thanks' | 'emotion' | 'request';
  completed: boolean;
  /** 该星球下完成的场景数 */
  completedScenes: number;
  /** 该星球下总场景数 */
  totalScenes: number;
  /** 获得的星球之心 */
  heartEarned: boolean;
}

/** 家长回顾页 — 场景练习记录 */
export interface PracticeRecord {
  sceneId: string;
  sceneTitle: string;
  category: string;
  completedAt: number;
  voiceAttempts: number;
}

/** 星球中文名映射 */
export const PLANET_NAMES: Record<string, string> = {
  greeting: '问候星',
  thanks: '感谢星',
  emotion: '情绪星',
  request: '表达星',
};

/** 星球 emoji 映射 */
export const PLANET_EMOJIS: Record<string, string> = {
  greeting: '🌻',
  thanks: '🙏',
  emotion: '💝',
  request: '🗣️',
};

/** 星球副标题（能力描述） */
export const PLANET_SUBTITLES: Record<string, string> = {
  greeting: '学会打招呼',
  thanks: '学会说谢谢',
  emotion: '学会说感受',
  request: '学会说需求',
};

/** 给家长的建议（按分类匹配） */
export const PARENT_ADVICE: Record<string, string> = {
  greeting:
    '星宝在"问候"方面还需要练习。建议在日常生活中，遇到熟人时，先示范打招呼，再鼓励星宝模仿。可以从家人开始练习，慢慢扩展到邻居和朋友。',
  thanks:
    '星宝在"感谢"方面还需要练习。建议在家里创造练习机会——家人给星宝东西时，等待他说"谢谢"再给。日常多说"谢谢"让星宝耳濡目染。',
  emotion:
    '星宝在"情绪表达"方面还需要练习。建议当星宝有明显情绪时（开心/难过/害怕），蹲下来问他："你现在是什么感觉？"帮助他用语言说出感受。',
  request:
    '星宝在"需求表达"方面还需要练习。建议在星宝想要什么东西时，不要立刻满足，而是引导他说出来。可以从"我想喝水"这类简单需求开始。',
};

// ========== 板块1 类型 ==========

export type ArousalLevel = 'L0' | 'L1' | 'L2' | 'L3';

export interface VitalsRecord {
  timestamp: number;
  heartRate: number;
  hrvRmssd: number;
}

export type EmotionType =
  | 'body_discomfort'
  | 'fear'
  | 'sad'
  | 'frustration'
  | 'over_excited'
  | 'unsure';

export const EMOTION_TYPE_LABELS: Record<EmotionType, string> = {
  body_discomfort: '身体不适🤒',
  fear: '害怕😨',
  sad: '伤心😢',
  frustration: '挫败😤',
  over_excited: '过度兴奋😆',
  unsure: '不确定🤷',
};

export interface AdviceContent {
  emotionType: EmotionType;
  title: string;
  description: string;
  steps: string[];
  tools: string[];
  disclaimer: string;
}

export interface EmotionEvent {
  id?: number;
  timestamp: number;
  arousalLevel: ArousalLevel;
  emotionType: EmotionType | null;
  note?: string;
}

// ========== 板块2 类型 ==========

export interface AacButton {
  id?: number;
  label: string;
  imageBase64?: string;
  category: 'basic_need' | 'emotion' | 'body' | 'social';
  color: string;
  order: number;
}

// ========== 全局类型 ==========

export type UserRole = 'parent' | 'child';
