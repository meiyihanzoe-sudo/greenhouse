/**
 * 星语冒险 — 游戏场景数据 v5
 *
 * 12 个预置社交场景全部激活，按四类分组。
 *
 * v5 难度变体：
 *   每个场景有 sprout / growing / blooming 三个难度变体，
 *   选项数量、情境描述、干扰项复杂度各不相同。
 *
 *   sprout(🌱):  2 个选项，简单情境，短跟读
 *   growing(🌿): 3 个选项，标准情境，标准跟读
 *   blooming(🌳): 4 个选项，微妙情境，扩展跟读
 */

import type { GameScene } from '@/types';
import type { SceneType, SceneStep, IllustrationAsset, DifficultyLevel } from '@/types';

// ========== 难度变体类型 ==========

/** 单个难度变体 */
export interface DifficultyVariant {
  /** 该难度下的选项 */
  options: { text: string; correct: boolean }[];
  /** 该难度下的错误引导提示 */
  optionHints: (string | null)[];
  /** 该难度下的跟读提示 */
  voicePrompt: string;
  /** 该难度下的情境描述 */
  description: string;
  /** 该难度下的 intro 文案 */
  introText: string;
  /** 该难度下的 success 文案 */
  successText: string;
}

export interface SceneData extends GameScene {
  emoji: string;
  voicePrompt: string;
  active: boolean;
  ageRange?: string;
  introText: string;
  successText: string;
  outroText: string;
  optionHints: (string | null)[];
  sceneType: SceneType;
  steps?: SceneStep[];
  emotionOptions?: { emoji: string; label: string; correct: boolean }[];
  /** 互动插画资源 */
  illustration?: IllustrationAsset;
  /** 基准难度等级（用于排序） */
  difficultyLevel: DifficultyLevel;
  /** v5: 各难度变体 */
  variants?: Partial<Record<DifficultyLevel, DifficultyVariant>>;
}

export const scenes: SceneData[] = [

  {
    id: 'greet-01',
    title: '见到小朋友',
    emoji: '👋',
    description: '你在公园里看到一位认识的小朋友，你想和他打招呼。你会怎么做呢？',
    options: [
        { text: '不理他，自己玩', correct: false },
        { text: '走过去说"你好"', correct: true },
        { text: '大声尖叫', correct: false }
      ],
    voicePrompt: '太棒了！你也来说一遍"你好"吧！👋',
    category: 'greeting',
    active: true,
    difficultyLevel: 'sprout',
    introText: '星宝的火箭降落在问候星上。这里的人们都喜欢微笑着说"你好"。你也能做到吗？',
    successText: '星宝勇敢地走过去打了招呼！小朋友也开心地对他挥了挥手。问候星亮起来了！',
    outroText: '你也像星宝一样勇敢地说出了"你好"！',
    optionHints: ['不理他的话，小朋友会以为你不喜欢他。试着走过去说"你好"吧！',
null,
'尖叫会吓到别人。轻轻走过去说"你好"会更好哦～'],
    sceneType: 'single-choice',
    illustration: {
      imageUrl: '/illustrations/greet-01.webp',
      thumbnailUrl: '/illustrations/greet-01-thumb.webp',
      alt: '阳光明媚的公园里，一位小朋友站在滑梯旁微笑，星宝正在走过去打招呼',
      width: 800,
      height: 500,
      hotspots: [
          {
            id: 'greet-01-wave',
            x: 60, y: 25, width: 20, height: 40,
            label: '👋 走过去打招呼',
            linkedOptionIndex: 1,
            hintAnimation: 'pulse',
          },
          {
            id: 'greet-01-alone',
            x: 10, y: 50, width: 18, height: 30,
            label: '😶 自己玩',
            linkedOptionIndex: 0,
            hintAnimation: 'none',
          }
      ],
      generatedBy: 'ai-dalle',
      prompt: 'A warm sunny park with green grass and a playground slide. A friendly child stands smiling near the slide. A cute child character (StarBao with round face) is walking towards them, waving hand. Children book illustration style, warm gentle colors, soft rounded shapes, suitable for children with autism, age 4-8.',
    },
    variants: {
      sprout:
      {
        options: [
        { text: '不理他，自己玩', correct: false },
        { text: '走过去说"你好"', correct: true }
        ],
        optionHints: ['不理他的话，小朋友会以为你不喜欢他。走过去说"你好"试试吧！',
null],
        voicePrompt: '你也来说"你好"吧！👋',
        description: '公园里有个小朋友在玩滑梯，你认识他。你会走过去说"你好"吗？',
        introText: '星宝看到公园里有个认识的小朋友。打个招呼吧！',
        successText: '星宝说了"你好"！小朋友开心地对他挥手。太棒了！',
      },
      growing:
      {
        options: [
        { text: '不理他，自己玩', correct: false },
        { text: '走过去说"你好"', correct: true },
        { text: '大声尖叫', correct: false }
        ],
        optionHints: ['不理他的话，小朋友会以为你不喜欢他。试着走过去说"你好"吧！',
null,
'尖叫会吓到别人。轻轻走过去说"你好"会更好哦～'],
        voicePrompt: '太棒了！你也来说"你好"吧！👋',
        description: '你在公园里看到一位认识的小朋友，你想和他打招呼。你会怎么做呢？',
        introText: '星宝的火箭降落在问候星上。这里的人们都喜欢微笑着说"你好"。你也能做到吗？',
        successText: '星宝勇敢地走过去打了招呼！小朋友也开心地对他挥了挥手。问候星亮起来了！',
      },
      blooming:
      {
        options: [
        { text: '不理他，自己玩', correct: false },
        { text: '走过去说"你好，我们一起玩吧"', correct: true },
        { text: '大声尖叫', correct: false },
        { text: '站在远处一直看他但不说话', correct: false }
        ],
        optionHints: ['不理他可能会错过一个好朋友哦～',
null,
'尖叫会吓到别人。试着好好说话吧！',
'一直看着不说话，小朋友会觉得很奇怪。主动开口吧！'],
        voicePrompt: '非常好！你也来完整地说"你好，我们一起玩吧"！👋',
        description: '你在公园里看到一位认识的小朋友在玩滑梯，你想和他一起玩。你该怎么开口呢？',
        introText: '星宝来到问候星的高级区域。这里不仅要打招呼，还要学会邀请别人一起玩。',
        successText: '星宝不仅打了招呼，还主动邀请小朋友一起玩！他们成了好朋友。问候星的高级能量充满了！',
      },
    },
  },
  {
    id: 'greet-02',
    title: '见到老师',
    emoji: '🧑‍🏫',
    description: '早上到了学校，老师站在教室门口。你该怎么说呢？',
    options: [
        { text: '低头走过去', correct: false },
        { text: '哭闹不想上学', correct: false },
        { text: '说"老师早上好"', correct: true }
      ],
    voicePrompt: '真棒！你也来说"老师早上好"吧！🌅',
    category: 'greeting',
    active: true,
    difficultyLevel: 'sprout',
    introText: '每天早上，老师都会在门口迎接大家。一个响亮的"早上好"能让老师很开心！',
    successText: '老师听到"早上好"，笑着摸了摸星宝的头。美好的一天开始了！',
    outroText: '每天早上跟老师打招呼，老师会很高兴的！',
    optionHints: ['低着头老师不知道你来了。试试说"老师早上好"吧！',
'哭闹不能解决问题。说"老师早上好"然后开开心心进教室吧！',
null],
    sceneType: 'single-choice',
    variants: {
      sprout:
      {
        options: [
        { text: '低头走过去', correct: false },
        { text: '说"老师早上好"', correct: true }
        ],
        optionHints: ['低着头老师不知道你来了。试试说"老师早上好"吧！',
null],
        voicePrompt: '你也来说"老师好"吧！🌅',
        description: '早上到学校了，老师站在门口。你该怎么说呢？',
        introText: '星宝来到学校。老师在门口迎接大家。说句"老师好"吧！',
        successText: '星宝说了"老师好"！老师笑得很开心。美好的一天开始了！',
      },
      growing:
      {
        options: [
        { text: '低头走过去', correct: false },
        { text: '哭闹不想上学', correct: false },
        { text: '说"老师早上好"', correct: true }
        ],
        optionHints: ['低着头老师不知道你来了。试试说"老师早上好"吧！',
'哭闹不能解决问题。说"老师早上好"然后开开心心进教室吧！',
null],
        voicePrompt: '真棒！你也来说"老师早上好"吧！🌅',
        description: '早上到了学校，老师站在教室门口。你该怎么说呢？',
        introText: '每天早上，老师都会在门口迎接大家。一个响亮的"早上好"能让老师很开心！',
        successText: '老师听到"早上好"，笑着摸了摸星宝的头。美好的一天开始了！',
      },
      blooming:
      {
        options: [
        { text: '低头走过去', correct: false },
        { text: '哭闹不想上学', correct: false },
        { text: '说"老师早上好"', correct: true },
        { text: '站在门口不动等老师先说话', correct: false }
        ],
        optionHints: ['低着头老师不知道你来了。主动问好吧！',
'哭闹不能解决问题。说"老师早上好"然后开开心心进教室吧！',
null,
'等老师先开口也可以，但主动问好会让老师更惊喜！'],
        voicePrompt: '非常好！你也来完整地说"老师早上好，今天天气真好"吧！🌅',
        description: '早上到了学校，老师站在门口。你注意到老师今天穿了一条新裙子。除了打招呼，你还可以说什么让她更开心？',
        introText: '星宝来到问候星的高级区域。打招呼之外，加一句关心的话会让人更温暖。',
        successText: '星宝不仅说了"老师早上好"，还夸了老师的新裙子！老师开心得不得了。',
      },
    },
  },
  {
    id: 'greet-03',
    title: '去别人家做客',
    emoji: '🏠',
    description: '妈妈带你去阿姨家做客，阿姨给你开了门。你该说什么呢？',
    options: [
        { text: '躲在妈妈身后', correct: false },
        { text: '说"阿姨好"', correct: true },
        { text: '直接跑进去玩', correct: false }
      ],
    voicePrompt: '做得对！你也来说"阿姨好"吧！😊',
    category: 'greeting',
    active: true,
    difficultyLevel: 'sprout',
    introText: '去别人家做客时，先打个招呼是有礼貌的表现。阿姨看到你一定会很开心的！',
    successText: '阿姨听到"阿姨好"笑得合不拢嘴，热情地请星宝进屋玩！',
    outroText: '做客时先问好，大家都会喜欢你！',
    optionHints: ['躲起来阿姨会担心的。试着走出来说"阿姨好"吧！',
null,
'直接跑进去不太礼貌。先跟阿姨说"阿姨好"吧！'],
    sceneType: 'single-choice',
    variants: {
      sprout:
      {
        options: [
        { text: '躲在妈妈身后', correct: false },
        { text: '说"阿姨好"', correct: true }
        ],
        optionHints: ['躲起来阿姨会担心的。试着走出来说"阿姨好"吧！',
null],
        voicePrompt: '你也来说"阿姨好"吧！😊',
        description: '妈妈带你去阿姨家，阿姨开了门。你该说什么呢？',
        introText: '星宝跟妈妈去阿姨家做客。阿姨开了门，星宝该说什么？',
        successText: '星宝说了"阿姨好"！阿姨开心地请他进屋。',
      },
      growing:
      {
        options: [
        { text: '躲在妈妈身后', correct: false },
        { text: '说"阿姨好"', correct: true },
        { text: '直接跑进去玩', correct: false }
        ],
        optionHints: ['躲起来阿姨会担心的。试着走出来说"阿姨好"吧！',
null,
'直接跑进去不太礼貌。先跟阿姨说"阿姨好"吧！'],
        voicePrompt: '做得对！你也来说"阿姨好"吧！😊',
        description: '妈妈带你去阿姨家做客，阿姨给你开了门。你该说什么呢？',
        introText: '去别人家做客时，先打个招呼是有礼貌的表现。阿姨看到你一定会很开心的！',
        successText: '阿姨听到"阿姨好"笑得合不拢嘴，热情地请星宝进屋玩！',
      },
      blooming:
      {
        options: [
        { text: '躲在妈妈身后', correct: false },
        { text: '说"阿姨好，打扰了"', correct: true },
        { text: '直接跑进去玩', correct: false },
        { text: '站在门口不说话直到阿姨邀请', correct: false }
        ],
        optionHints: ['躲起来阿姨会担心的。试着走出来主动问好吧！',
null,
'直接跑进去不太礼貌。先跟阿姨问好再进去玩吧！',
'等阿姨邀请也可以，但主动问好会让阿姨觉得你很懂事！'],
        voicePrompt: '非常好！你也来完整地说"阿姨好，打扰了"吧！😊',
        description: '妈妈带你去阿姨家做客，阿姨开了门。除了打招呼，你还可以说什么表示礼貌？',
        introText: '星宝来到问候星的高级区域。去做客时，不仅要问好，还要学会说"打扰了"表示礼貌。',
        successText: '星宝说了"阿姨好，打扰了"！阿姨高兴地说"真有礼貌"，还拿出了好吃的招待星宝。',
      },
    },
  },
  {
    id: 'thanks-01',
    title: '收到礼物',
    emoji: '🎁',
    description: '奶奶送了你一个你一直想要的玩具。奶奶笑眯眯地看着你，等你说话。你该说什么呢？',
    options: [
        { text: '拿着玩具就跑', correct: false },
        { text: '说"这个我不喜欢"', correct: false },
        { text: '说"谢谢奶奶"', correct: true }
      ],
    voicePrompt: '很好！你也来说"谢谢奶奶"吧！🙏',
    category: 'thanks',
    active: true,
    difficultyLevel: 'growing',
    introText: '星宝的火箭飞到了感谢星。这里的人们收到礼物时都会说一声温暖的"谢谢"。',
    successText: '奶奶听到"谢谢"后笑得可开心了，还抱了抱星宝！感谢星的能量充满了星宝的火箭。',
    outroText: '你学会说"谢谢"了！',
    optionHints: ['奶奶精心准备了礼物，如果直接跑掉她会难过的。试试说"谢谢奶奶"吧！',
'说"不喜欢"会让奶奶伤心。即使不是最喜欢的礼物，也可以先说"谢谢"表达感谢。',
null],
    sceneType: 'single-choice',
    illustration: {
      imageUrl: '/illustrations/thanks-01.webp',
      thumbnailUrl: '/illustrations/thanks-01-thumb.webp',
      alt: '温馨的客厅里，奶奶坐在沙发上拿着一个绑着丝带的礼盒，星宝站在面前开心地看着礼物',
      width: 800,
      height: 500,
      hotspots: [
          {
            id: 'thanks-01-gift',
            x: 50, y: 20, width: 22, height: 38,
            label: '🎁 说"谢谢奶奶"',
            linkedOptionIndex: 2,
            hintAnimation: 'pulse',
          },
          {
            id: 'thanks-01-run',
            x: 85, y: 55, width: 12, height: 30,
            label: '🏃 拿着就跑',
            linkedOptionIndex: 0,
            hintAnimation: 'none',
          }
      ],
      generatedBy: 'ai-dalle',
      prompt: 'children book illustration',
    },
    variants: {
      sprout:
      {
        options: [
        { text: '拿着玩具就跑', correct: false },
        { text: '说"谢谢奶奶"', correct: true }
        ],
        optionHints: ['奶奶精心准备了礼物，直接跑掉她会难过的。说"谢谢奶奶"吧！',
null],
        voicePrompt: '你也来说"谢谢"吧！🙏',
        description: '奶奶送你一个玩具。奶奶笑着等你说话。你该说什么？',
        introText: '星宝来到感谢星。奶奶送了星宝一个玩具。星宝该说什么？',
        successText: '星宝说了"谢谢"！奶奶开心地抱了抱星宝。',
      },
      growing:
      {
        options: [
        { text: '拿着玩具就跑', correct: false },
        { text: '说"这个我不喜欢"', correct: false },
        { text: '说"谢谢奶奶"', correct: true }
        ],
        optionHints: ['奶奶精心准备了礼物，如果直接跑掉她会难过的。试试说"谢谢奶奶"吧！',
'说"不喜欢"会让奶奶伤心。即使不是最喜欢的礼物，也可以先说"谢谢"表达感谢。',
null],
        voicePrompt: '很好！你也来说"谢谢奶奶"吧！🙏',
        description: '奶奶送了你一个你一直想要的玩具。奶奶笑眯眯地看着你，等你说话。你该说什么呢？',
        introText: '星宝的火箭飞到了感谢星。这里的人们收到礼物时都会说一声温暖的"谢谢"。',
        successText: '奶奶听到"谢谢"后笑得可开心了，还抱了抱星宝！感谢星的能量充满了星宝的火箭。',
      },
      blooming:
      {
        options: [
        { text: '拿着玩具就跑', correct: false },
        { text: '说"这个我不喜欢"', correct: false },
        { text: '说"谢谢奶奶，我很喜欢这个礼物"', correct: true },
        { text: '拆开看一眼放一边不说话', correct: false }
        ],
        optionHints: ['奶奶精心准备了礼物，直接跑掉她会难过的。',
'说"不喜欢"会让奶奶伤心。即使不是最喜欢的礼物，也可以先说"谢谢"。',
null,
'拆开不回应，奶奶不知道你喜不喜欢。告诉她你的感受吧！'],
        voicePrompt: '非常好！你也来完整地说"谢谢奶奶，我很喜欢这个礼物"吧！🙏',
        description: '奶奶送了你一个玩具，你打开发现正是你想要的。奶奶期待地看着你。你该怎么回应？',
        introText: '星宝来到感谢星的高级区域。收到礼物时，不仅要谢谢，还要告诉对方你的感受。',
        successText: '星宝说了"谢谢奶奶，我很喜欢这个礼物"！奶奶高兴得眼睛都眯成了一条线。',
      },
    },
  },
  {
    id: 'thanks-02',
    title: '小朋友分享零食',
    emoji: '🍪',
    description: '小朋友把他的饼干分给你吃。你该说什么呢？',
    options: [
        { text: '说"不好吃"', correct: false },
        { text: '抢过来全部吃掉', correct: false },
        { text: '说"谢谢你"', correct: true }
      ],
    voicePrompt: '真礼貌！你也来说"谢谢你"吧！😊',
    category: 'thanks',
    active: true,
    difficultyLevel: 'growing',
    introText: '别人和你分享东西的时候，一句"谢谢"会让分享的人也很开心！',
    successText: '小朋友听到"谢谢"特别高兴，以后还愿意和星宝一起分享！',
    outroText: '收到别人的好意时说谢谢，朋友会越来越多！',
    optionHints: ['即使觉得不好吃，也可以先说谢谢。分享的心意比味道更重要哦～',
'抢别人的东西会让他不开心。接过饼干说"谢谢你"吧！',
null],
    sceneType: 'single-choice',
    variants: {
      sprout:
      {
        options: [
        { text: '抢过来全部吃掉', correct: false },
        { text: '说"谢谢你"', correct: true }
        ],
        optionHints: ['抢别人的东西会让他不开心。接过饼干说"谢谢你"吧！',
null],
        voicePrompt: '你也来说"谢谢"吧！😊',
        description: '小朋友把饼干分给你吃。你该说什么？',
        introText: '星宝的朋友分享了饼干给他。星宝该说什么？',
        successText: '星宝说了"谢谢"！小朋友很开心，以后还愿意分享。',
      },
      growing:
      {
        options: [
        { text: '说"不好吃"', correct: false },
        { text: '抢过来全部吃掉', correct: false },
        { text: '说"谢谢你"', correct: true }
        ],
        optionHints: ['即使觉得不好吃，也可以先说谢谢。分享的心意比味道更重要哦～',
'抢别人的东西会让他不开心。接过饼干说"谢谢你"吧！',
null],
        voicePrompt: '真礼貌！你也来说"谢谢你"吧！😊',
        description: '小朋友把他的饼干分给你吃。你该说什么呢？',
        introText: '别人和你分享东西的时候，一句"谢谢"会让分享的人也很开心！',
        successText: '小朋友听到"谢谢"特别高兴，以后还愿意和星宝一起分享！',
      },
      blooming:
      {
        options: [
        { text: '说"不好吃"', correct: false },
        { text: '抢过来全部吃掉', correct: false },
        { text: '说"谢谢你，这个饼干真好吃"', correct: true },
        { text: '吃了就走不回应', correct: false }
        ],
        optionHints: ['即使觉得不好吃，也可以先说谢谢。分享的心意比味道更重要哦～',
'抢别人的东西会让他不开心。',
null,
'吃了就走，分享的人会觉得你不领情。说声谢谢吧！'],
        voicePrompt: '非常好！你也来完整地说"谢谢你，这个饼干真好吃"吧！😊',
        description: '小朋友把饼干分给你，饼干很好吃。除了说谢谢，你还可以怎么让他知道你很喜欢？',
        introText: '星宝来到感谢星的高级区域。除了说谢谢，还可以告诉对方你的感受。',
        successText: '星宝说了"谢谢你，这个饼干真好吃"！小朋友开心地说"下次再带给你"！',
      },
    },
  },
  {
    id: 'thanks-03',
    title: '有人帮你捡东西',
    emoji: '📦',
    description: '你不小心把玩具掉在地上了，一位叔叔帮你捡了起来。你该说什么？',
    options: [
        { text: '生气地抢过来', correct: false },
        { text: '说"谢谢叔叔"', correct: true },
        { text: '拿了玩具就走', correct: false }
      ],
    voicePrompt: '太棒了！你也来说"谢谢叔叔"吧！🙏',
    category: 'thanks',
    active: true,
    difficultyLevel: 'growing',
    introText: '当陌生人帮助了我们，说一声"谢谢"是最好的回应。',
    successText: '叔叔笑着说"不客气"，星宝感受到了帮助和被帮助的温暖！',
    outroText: '别人帮忙要说谢谢，这是人与人之间的温暖！',
    optionHints: ['生气抢过来会让叔叔难过，他明明是来帮你的。说"谢谢叔叔"试试！',
null,
'拿了就走会让帮忙的人觉得不舒服。说句"谢谢叔叔"吧！'],
    sceneType: 'single-choice',
    variants: {
      sprout:
      {
        options: [
        { text: '拿了玩具就走', correct: false },
        { text: '说"谢谢叔叔"', correct: true }
        ],
        optionHints: ['拿了就走会让帮忙的人觉得不舒服。说句"谢谢叔叔"吧！',
null],
        voicePrompt: '你也来说"谢谢"吧！🙏',
        description: '玩具掉了，一位叔叔帮你捡起来。你该说什么？',
        introText: '星宝的玩具掉了，一位好心的叔叔帮忙捡起来。星宝该说什么？',
        successText: '星宝说了"谢谢"！叔叔笑着说"不客气"。',
      },
      growing:
      {
        options: [
        { text: '生气地抢过来', correct: false },
        { text: '说"谢谢叔叔"', correct: true },
        { text: '拿了玩具就走', correct: false }
        ],
        optionHints: ['生气抢过来会让叔叔难过，他明明是来帮你的。说"谢谢叔叔"试试！',
null,
'拿了就走会让帮忙的人觉得不舒服。说句"谢谢叔叔"吧！'],
        voicePrompt: '太棒了！你也来说"谢谢叔叔"吧！🙏',
        description: '你不小心把玩具掉在地上了，一位叔叔帮你捡了起来。你该说什么？',
        introText: '当陌生人帮助了我们，说一声"谢谢"是最好的回应。',
        successText: '叔叔笑着说"不客气"，星宝感受到了帮助和被帮助的温暖！',
      },
      blooming:
      {
        options: [
        { text: '生气地抢过来', correct: false },
        { text: '说"谢谢叔叔帮我捡玩具"', correct: true },
        { text: '拿了玩具就走', correct: false },
        { text: '小声说了谢谢但不敢看叔叔', correct: false }
        ],
        optionHints: ['生气抢过来会让叔叔难过，他明明是来帮你的。',
null,
'拿了就走会让帮忙的人觉得不舒服。说句"谢谢"吧！',
'说得太小声了，叔叔可能没听到。勇敢地大声说出来吧！'],
        voicePrompt: '非常好！你也来完整地说"谢谢叔叔帮我捡玩具"吧！🙏',
        description: '一位陌生的叔叔帮你捡起了掉在地上的玩具。你该怎么说才能让他感受到你的诚意？',
        introText: '星宝来到感谢星的高级区域。感谢别人时，说得具体一些会更有诚意。',
        successText: '星宝大声说"谢谢叔叔帮我捡玩具"！叔叔开心地说"真是个有礼貌的好孩子"！',
      },
    },
  },
  {
    id: 'emotion-01',
    title: '感到开心',
    emoji: '😊',
    description: '你今天在幼儿园画了一幅很漂亮的画，老师表扬了你。你心里甜甜的，嘴角忍不住往上翘。',
    options: [
        { text: '什么也不说', correct: false },
        { text: '把画撕掉', correct: false },
        { text: '开心地说"我好高兴"', correct: true }
      ],
    voicePrompt: '太好了！你也来说"我好高兴"吧！😊',
    category: 'emotion',
    active: true,
    difficultyLevel: 'growing',
    introText: '星宝的火箭来到了情绪星。这里的人们会用语言说出自己的感受。先来认一认，哪个是开心的表情？',
    successText: '星宝不仅认出了开心的表情，还学会说出"我好高兴"！情绪星的光芒变得温暖而明亮。',
    outroText: '把开心说出来，快乐会加倍！',
    optionHints: ['开心的时候说出来，别人也会为你高兴。试试说"我好高兴"吧！',
'画得这么好，撕掉太可惜了。把开心说出来会更好哦～',
null],
    sceneType: 'emotion-recognition',
    illustration: {
      imageUrl: '/illustrations/emotion-01.webp',
      thumbnailUrl: '/illustrations/emotion-01-thumb.webp',
      alt: '明亮的幼儿园教室里，星宝举着一幅彩虹画，老师在旁边笑着竖起大拇指',
      width: 800,
      height: 500,
      hotspots: [
          {
            id: 'emotion-01-happy',
            x: 35, y: 15, width: 18, height: 32,
            label: '😊 开心',
            linkedOptionIndex: 1,
            hintAnimation: 'pulse',
          },
          {
            id: 'emotion-01-sad',
            x: 55, y: 60, width: 15, height: 25,
            label: '😢 难过',
            linkedOptionIndex: 2,
            hintAnimation: 'none',
          },
          {
            id: 'emotion-01-calm',
            x: 75, y: 60, width: 15, height: 25,
            label: '😐 平静',
            linkedOptionIndex: 0,
            hintAnimation: 'none',
          }
      ],
      generatedBy: 'ai-dalle',
      prompt: 'children book illustration',
    },
    variants: {
      sprout:
      {
        options: [
        { text: '什么也不说', correct: false },
        { text: '开心地说"我好高兴"', correct: true }
        ],
        optionHints: ['开心的时候说出来，别人也会为你高兴。试试说"我好高兴"吧！',
null],
        voicePrompt: '你也来说"我好高兴"吧！😊',
        description: '老师表扬了你画的画。你心里甜甜的。你会怎么说？',
        introText: '星宝来到情绪星。先认一认，哪个是开心的表情？',
        successText: '星宝认出了开心的表情！还学会说出"我好高兴"！',
      },
      growing:
      {
        options: [
        { text: '什么也不说', correct: false },
        { text: '把画撕掉', correct: false },
        { text: '开心地说"我好高兴"', correct: true }
        ],
        optionHints: ['开心的时候说出来，别人也会为你高兴。试试说"我好高兴"吧！',
'画得这么好，撕掉太可惜了。把开心说出来会更好哦～',
null],
        voicePrompt: '太好了！你也来说"我好高兴"吧！😊',
        description: '你今天在幼儿园画了一幅很漂亮的画，老师表扬了你。你心里甜甜的，嘴角忍不住往上翘。',
        introText: '星宝的火箭来到了情绪星。这里的人们会用语言说出自己的感受。先来认一认，哪个是开心的表情？',
        successText: '星宝不仅认出了开心的表情，还学会说出"我好高兴"！情绪星的光芒变得温暖而明亮。',
      },
      blooming:
      {
        options: [
        { text: '什么也不说', correct: false },
        { text: '把画撕掉', correct: false },
        { text: '开心地说"老师表扬了我，我好高兴"', correct: true },
        { text: '笑一笑但不说话', correct: false }
        ],
        optionHints: ['开心的时候说出来，别人也会为你高兴。',
'画得这么好，撕掉太可惜了。',
null,
'笑一笑也很好，但说出来能让别人更清楚你的感受。'],
        voicePrompt: '非常好！你也来完整地说"老师表扬了我，我好高兴"吧！😊',
        description: '你在幼儿园画了一幅漂亮的画，老师在全班面前表扬了你。你心里甜滋滋的。你怎么表达你的开心？',
        introText: '星宝来到情绪星的高级区域。不仅要认出情绪，还要学会用完整的句子说出为什么开心。',
        successText: '星宝说"老师表扬了我，我好高兴"！老师听了也开心地笑了。把快乐说出来，快乐会加倍！',
      },
    },
    emotionOptions: [
        { emoji: '😢', label: '难过', correct: false },
        { emoji: '😊', label: '开心', correct: true },
        { emoji: '😐', label: '平静', correct: false }
      ],
  },
  {
    id: 'emotion-02',
    title: '感到难过',
    emoji: '😢',
    description: '你最喜欢的玩具坏了，你心里很难过。你会怎么做？',
    options: [
        { text: '大哭大闹摔东西', correct: false },
        { text: '躲在角落里不说话', correct: false },
        { text: '告诉妈妈"我很难过"', correct: true }
      ],
    voicePrompt: '说出来就好了！你也来说"我很难过"吧，妈妈会帮你的！😢',
    category: 'emotion',
    active: true,
    difficultyLevel: 'growing',
    introText: '每个人都会有难过的时候。把难过的感觉说出来，别人才能帮助你。',
    successText: '妈妈听到后抱住了星宝："没关系的，我们一起来修好它！"',
    outroText: '难过的时候说出来，会有人来帮你！',
    optionHints: ['摔东西可能会弄坏更多东西，还可能伤到自己。试试告诉妈妈"我很难过"吧！',
'躲起来妈妈会担心的。说出来妈妈才能帮你呀～',
null],
    sceneType: 'single-choice',
    variants: {
      sprout:
      {
        options: [
        { text: '躲在角落里不说话', correct: false },
        { text: '告诉妈妈"我很难过"', correct: true }
        ],
        optionHints: ['躲起来妈妈会担心的。说出来妈妈才能帮你呀～',
null],
        voicePrompt: '你也来说"我很难过"吧！😢',
        description: '你最喜欢的玩具坏了，心里很难过。你会怎么做？',
        introText: '星宝最喜欢的玩具坏了。他很难过。他该怎么做？',
        successText: '星宝告诉妈妈"我很难过"！妈妈抱住了他，说要帮他修好。',
      },
      growing:
      {
        options: [
        { text: '大哭大闹摔东西', correct: false },
        { text: '躲在角落里不说话', correct: false },
        { text: '告诉妈妈"我很难过"', correct: true }
        ],
        optionHints: ['摔东西可能会弄坏更多东西，还可能伤到自己。试试告诉妈妈"我很难过"吧！',
'躲起来妈妈会担心的。说出来妈妈才能帮你呀～',
null],
        voicePrompt: '说出来就好了！你也来说"我很难过"吧，妈妈会帮你的！😢',
        description: '你最喜欢的玩具坏了，你心里很难过。你会怎么做？',
        introText: '每个人都会有难过的时候。把难过的感觉说出来，别人才能帮助你。',
        successText: '妈妈听到后抱住了星宝："没关系的，我们一起来修好它！"',
      },
      blooming:
      {
        options: [
        { text: '大哭大闹摔东西', correct: false },
        { text: '躲在角落里不说话', correct: false },
        { text: '告诉妈妈"我的玩具坏了，我很难过"', correct: true },
        { text: '假装没事但心里一直不开心', correct: false }
        ],
        optionHints: ['摔东西可能会弄坏更多东西，还可能伤到自己。',
'躲起来妈妈会担心的。',
null,
'假装没事久了会更不开心。说出来妈妈才能帮你一起解决。'],
        voicePrompt: '非常好！你也来完整地说"妈妈，我的玩具坏了，我很难过"吧！😢',
        description: '你最喜欢的玩具坏了，你心里很难过。除了告诉妈妈你难过，你还应该告诉她什么？',
        introText: '星宝来到情绪星的高级区域。表达难过的同时，说清楚原因会更容易得到帮助。',
        successText: '星宝说"妈妈，我的玩具坏了，我很难过"。妈妈马上明白了，拿出胶水帮星宝一起修好了玩具！',
      },
    },
  },
  {
    id: 'emotion-03',
    title: '感到害怕',
    emoji: '😨',
    description: '晚上房间里的灯关了，你听到外面有奇怪的声音，有点害怕。你会怎么做？',
    options: [
        { text: '大声尖叫', correct: false },
        { text: '告诉妈妈"我有点害怕"', correct: true },
        { text: '用被子蒙住头', correct: false }
      ],
    voicePrompt: '勇敢说出来！你也来说"我有点害怕"吧，妈妈会陪着你的！😨',
    category: 'emotion',
    active: true,
    difficultyLevel: 'blooming',
    introText: '害怕是很正常的感受。勇敢地说出来，就有人陪着你、保护你。',
    successText: '妈妈打开灯，坐在星宝床边："别怕，妈妈在这里陪着你。"',
    outroText: '害怕的时候说出来，就不会一个人面对了！',
    optionHints: ['尖叫会吵到别人，妈妈也不知道你害怕什么。轻轻告诉妈妈试试！',
null,
'蒙住头声音还在外面，还是害怕。去告诉妈妈"我有点害怕"吧！'],
    sceneType: 'single-choice',
    variants: {
      sprout:
      {
        options: [
        { text: '用被子蒙住头', correct: false },
        { text: '告诉妈妈"我有点害怕"', correct: true }
        ],
        optionHints: ['蒙住头声音还在外面，还是害怕。去告诉妈妈"我有点害怕"吧！',
null],
        voicePrompt: '你也来说"我有点害怕"吧！😨',
        description: '晚上关了灯，听到奇怪的声音。你有点害怕。你会怎么做？',
        introText: '星宝晚上听到奇怪的声音，有点害怕。他该怎么做？',
        successText: '星宝告诉妈妈"我有点害怕"！妈妈打开灯陪着他。',
      },
      growing:
      {
        options: [
        { text: '大声尖叫', correct: false },
        { text: '告诉妈妈"我有点害怕"', correct: true },
        { text: '用被子蒙住头', correct: false }
        ],
        optionHints: ['尖叫会吵到别人，妈妈也不知道你害怕什么。轻轻告诉妈妈试试！',
null,
'蒙住头声音还在外面，还是害怕。去告诉妈妈"我有点害怕"吧！'],
        voicePrompt: '勇敢说出来！你也来说"我有点害怕"吧，妈妈会陪着你的！😨',
        description: '晚上房间里的灯关了，你听到外面有奇怪的声音，有点害怕。你会怎么做？',
        introText: '害怕是很正常的感受。勇敢地说出来，就有人陪着你、保护你。',
        successText: '妈妈打开灯，坐在星宝床边："别怕，妈妈在这里陪着你。"',
      },
      blooming:
      {
        options: [
        { text: '大声尖叫', correct: false },
        { text: '告诉妈妈"外面有奇怪的声音，我有点害怕"', correct: true },
        { text: '用被子蒙住头', correct: false },
        { text: '开灯后就不怕了但不告诉妈妈', correct: false }
        ],
        optionHints: ['尖叫会吵到别人，妈妈也不知道你害怕什么。',
null,
'蒙住头声音还在外面，还是害怕。',
'开灯只是一时不怕了，告诉妈妈她才能帮你彻底解决问题。'],
        voicePrompt: '非常好！你也来完整地说"妈妈，外面有奇怪的声音，我有点害怕"吧！😨',
        description: '晚上关了灯，你听到窗外有奇怪的声音。你有点害怕，但你想让妈妈知道具体是什么让你害怕。你该怎么说？',
        introText: '星宝来到情绪星的高级区域。表达害怕时，说出具体原因能让妈妈更好地帮助你。',
        successText: '星宝说"妈妈，外面有奇怪的声音，我有点害怕"。妈妈解释说那是风吹树叶的声音，星宝就不怕了！',
      },
    },
  },
  {
    id: 'need-01',
    title: '想喝水',
    emoji: '💧',
    description: '你玩了好久，觉得口渴了。你需要让妈妈知道你想喝水。',
    options: [
        { text: '自己去拿但够不着', correct: false },
        { text: '说"妈妈我想喝水"', correct: true },
        { text: '哭闹直到妈妈猜到', correct: false }
      ],
    voicePrompt: '很好！你也来说"妈妈我想喝水"吧！💧',
    category: 'request',
    active: true,
    difficultyLevel: 'growing',
    introText: '星宝的火箭来到了表达星。这里的人都知道，把需要说出来，别人才能帮你。',
    successText: '星宝清楚地表达了自己的需求！妈妈立刻给他倒了水。表达星的能量收集完毕！',
    outroText: '你学会了清楚地说出自己的需要。这是最重要的一项能力！',
    optionHints: ['够不着可能会摔倒。告诉妈妈你想要什么会更安全哦～',
null,
'哭闹妈妈不知道你想要什么。试着说出"我想喝水"吧！'],
    sceneType: 'multi-step',
    variants: {
      sprout:
      {
        options: [
        { text: '哭闹直到妈妈猜到', correct: false },
        { text: '说"妈妈我想喝水"', correct: true }
        ],
        optionHints: ['哭闹妈妈不知道你想要什么。试着说出"我想喝水"吧！',
null],
        voicePrompt: '你也来说"我想喝水"吧！💧',
        description: '你口渴了，妈妈在旁边。你怎么让妈妈知道？',
        introText: '星宝口渴了。妈妈在旁边。星宝该怎么做？',
        successText: '星宝说"我想喝水"！妈妈立刻给他倒了水。',
      },
      growing:
      {
        options: [
        { text: '自己去拿但够不着', correct: false },
        { text: '说"妈妈我想喝水"', correct: true },
        { text: '哭闹直到妈妈猜到', correct: false }
        ],
        optionHints: ['够不着可能会摔倒。告诉妈妈你想要什么会更安全哦～',
null,
'哭闹妈妈不知道你想要什么。试着说出"我想喝水"吧！'],
        voicePrompt: '很好！你也来说"妈妈我想喝水"吧！💧',
        description: '你玩了好久，觉得口渴了。你需要让妈妈知道你想喝水。',
        introText: '星宝的火箭来到了表达星。把需要说出来，别人才能帮你。',
        successText: '星宝清楚地表达了自己的需求！妈妈立刻给他倒了水。',
      },
      blooming:
      {
        options: [
        { text: '自己去拿但够不着', correct: false },
        { text: '说"妈妈，我口渴了，可以��我倒杯水吗"', correct: true },
        { text: '哭闹直到妈妈猜到', correct: false },
        { text: '自己去开冰箱找饮料', correct: false }
        ],
        optionHints: ['够不着可能会摔倒。',
null,
'哭闹妈妈不知道你想要什么。',
'自己开冰箱找饮料不安全。告诉妈妈你需要什么吧！'],
        voicePrompt: '非常好！你也来完整地说"妈妈，我口渴了，可以帮我倒杯水吗"吧！💧',
        description: '你玩了好久觉得口渴了。你不仅想让妈妈知道你想喝水，还想让她知道你很有礼貌。你该怎么说？',
        introText: '星宝来到表达星的高级区域。清楚地表达需求，再加上礼貌用语，会让人更愿意帮忙。',
        successText: '星宝有礼貌地说"妈妈，我口渴了，可以帮我倒杯水吗"？妈妈开心地说"当然可以，星宝真懂事"！',
      },
    },
    steps: [
      {
        description: '第一步：你想让妈妈注意到你。你会怎么做？',
        options: [
          { text: '哭闹', correct: false },
          { text: '走过去叫"妈妈"', correct: true },
          { text: '用力拉妈妈的衣角', correct: false },
        ],
        hints: ['哭闹妈妈会担心，但不知道你要什么。叫"妈妈"试试吧！', null, '拉衣角会让妈妈不舒服。叫一声"妈妈"，她会回头看你。'],
      },
      {
        description: '第二步：妈妈看着你了！现在告诉妈妈你想做什么？',
        options: [
          { text: '自己搬凳子去够水杯', correct: false },
          { text: '说"妈妈，我想喝水"', correct: true },
          { text: '指着水杯不说话', correct: false },
        ],
        hints: ['搬凳子很危险。用语言说出来，妈妈会帮你倒水的～', null, '指水杯妈妈可能不明白你是渴了还是想玩杯子。说出来更清楚！'],
      },
    ]
,
  },
  {
    id: 'need-02',
    title: '想去厕所',
    emoji: '🚽',
    description: '你在外面玩，突然想上厕所。你该怎么告诉妈妈呢？',
    options: [
        { text: '直接跑开', correct: false },
        { text: '说"妈妈我想上厕所"', correct: true },
        { text: '憋着不说', correct: false }
      ],
    voicePrompt: '很棒！你也来说"妈妈我想上厕所"吧！🚽',
    category: 'request',
    active: true,
    difficultyLevel: 'sprout',
    introText: '在外面玩的时候，如果需要上厕所，一定要及时告诉大人。',
    successText: '妈妈立刻带星宝去了厕所。"说出来就好，不用憋着！"',
    outroText: '及时说出自己的需要，身体才舒服！',
    optionHints: ['自己跑开妈妈会找不到你，会很担心的。说一声再去吧！',
null,
'憋着对身体不好，还可能尿裤子。告诉妈妈就没事了！'],
    sceneType: 'single-choice',
    variants: {
      sprout:
      {
        options: [
        { text: '憋着不说', correct: false },
        { text: '说"妈妈我想上厕所"', correct: true }
        ],
        optionHints: ['憋着对身体不好。告诉妈妈就没事了！',
null],
        voicePrompt: '你也来说"我想上厕所"吧！🚽',
        description: '你在外面玩，突然想上厕所。你该怎么告诉妈妈？',
        introText: '星宝在外面玩，突然想上厕所。他该怎么做？',
        successText: '星宝告诉妈妈想上厕所！妈妈立刻带他去了。',
      },
      growing:
      {
        options: [
        { text: '直接跑开', correct: false },
        { text: '说"妈妈我想上厕所"', correct: true },
        { text: '憋着不说', correct: false }
        ],
        optionHints: ['自己跑开妈妈会找不到你，会很担心的。说一声再去吧！',
null,
'憋着对身体不好，还可能尿裤子。告诉妈妈就没事了！'],
        voicePrompt: '很棒！你也来说"妈妈我想上厕所"吧！🚽',
        description: '你在外面玩，突然想上厕所。你该怎么告诉妈妈呢？',
        introText: '在外面玩的时候，如果需要上厕所，一定要及时告诉大人。',
        successText: '妈妈立刻带星宝去了厕所。"说出来就好，不用憋着！"',
      },
      blooming:
      {
        options: [
        { text: '直接跑开', correct: false },
        { text: '说"妈妈我想上厕所，有点急"', correct: true },
        { text: '憋着不说', correct: false },
        { text: '自己去找厕所', correct: false }
        ],
        optionHints: ['自己跑开妈妈会找不到你，会很担心的。',
null,
'憋着对身体不好。',
'自己找厕所很危险，可能会走丢。告诉妈妈，她会带你去的！'],
        voicePrompt: '非常好！你也来完整地说"妈妈我想上厕所，有点急"吧！🚽',
        description: '你在外面玩突然想上厕所，而且有点急。你该怎么让妈妈知道事情的紧急程度？',
        introText: '星宝来到表达星的高级区域。紧急情况下，不仅要说出需求，还要让大人知道有多急。',
        successText: '星宝说"妈妈我想上厕所，有点急"！妈妈立刻放下手中的事，快速带星宝去了厕所。',
      },
    },
  },
  {
    id: 'need-03',
    title: '想要某个玩具',
    emoji: '🧸',
    description: '你在商店里看到一个可爱的玩具熊，你很想要。你该怎么告诉妈妈呢？',
    options: [
        { text: '直接拿走不付钱', correct: false },
        { text: '躺在地上大哭大闹', correct: false },
        { text: '指着玩具说"妈妈我想要这个"', correct: true }
      ],
    voicePrompt: '说得很清楚！你也来说"妈妈我想要这个"吧！🧸',
    category: 'request',
    active: true,
    difficultyLevel: 'blooming',
    introText: '看到喜欢的东西，清楚地告诉妈妈你的想法，比哭闹更有效。',
    successText: '星宝清楚地表达了想要的东西。妈妈微笑着想了想："等过节的时候，我们再来看看好不好？"',
    outroText: '好好说出自己的想法，大人才知道怎么回应你！',
    optionHints: ['不付钱就拿走是不对的。告诉妈妈你想要，她可能会考虑的！',
'躺在地上大哭大家都看着，妈妈也会很尴尬。试着说"妈妈我想要这个"吧！',
null],
    sceneType: 'single-choice',
    variants: {
      sprout:
      {
        options: [
        { text: '躺在地上大哭大闹', correct: false },
        { text: '指着玩具说"妈妈我想要这个"', correct: true }
        ],
        optionHints: ['躺在地上大哭大家都看着，妈妈也会很尴尬。试着说"妈妈我想要这个"吧！',
null],
        voicePrompt: '你也来说"我想要这个"吧！🧸',
        description: '你在商店看到一个可爱的玩具熊，很想要。你该怎么说？',
        introText: '星宝在商店看到了喜欢的玩具。他该怎么说？',
        successText: '星宝指着玩具说"我想要这个"！妈妈听到了他的想法。',
      },
      growing:
      {
        options: [
        { text: '直接拿走不付钱', correct: false },
        { text: '躺在地上大哭大闹', correct: false },
        { text: '指着玩具说"妈妈我想要这个"', correct: true }
        ],
        optionHints: ['不付钱就拿走是不对的。告诉妈妈你想要，她可能会考虑的！',
'躺在地上大哭大家都看着，妈妈也会很尴尬。试着说"妈妈我想要这个"吧！',
null],
        voicePrompt: '说得很清楚！你也来说"妈妈我想要这个"吧！🧸',
        description: '你在商店里看到一个可爱的玩具熊，你很想要。你该怎么告诉妈妈呢？',
        introText: '看到喜欢的东西，清楚地告诉妈妈你的想法，比哭闹更有效。',
        successText: '星宝清楚地表达了想要的东西。妈妈微笑着想了想："等过节的时候，我们再来看看好不好？"',
      },
      blooming:
      {
        options: [
        { text: '直接拿走不付钱', correct: false },
        { text: '躺在地上大哭大闹', correct: false },
        { text: '说"妈妈，我想要这个玩具熊，可以吗"', correct: true },
        { text: '拉着妈妈的手往玩具那边走但不说话', correct: false }
        ],
        optionHints: ['不付钱就拿走是不对的。',
'躺在地上大哭大家都看着，妈妈也会很尴尬。',
null,
'拉着妈妈走但不说想要什么，妈妈不明白你的意思。说出来吧！'],
        voicePrompt: '非常好！你也来完整地说"妈妈，我想要这个玩具熊，可以吗"吧！🧸',
        description: '你在商店看到可爱的玩具熊，很想要。你该怎么有礼貌地表达，让妈妈更可能答应你？',
        introText: '星宝来到表达星的高级区域。有礼貌地请求比直接要求更容易被接受。',
        successText: '星宝礼貌地说"妈妈，我想要这个玩具熊，可以吗"？妈妈欣慰地说"星宝这么有礼貌，妈妈考虑一下"！',
      },
    },
  }
] as SceneData[];

/** 获取所有已激活的场景 */
export function getActiveScenes(): SceneData[] {
  return scenes.filter((s) => s.active);
}

/** 获取所有场景分类（按星球顺序） */
export function getCategories(): string[] {
  return ['greeting', 'thanks', 'emotion', 'request'];
}

/** 获取某个分类下所有已激活的场景 */
export function getScenesByCategory(category: string): SceneData[] {
  return scenes.filter((s) => s.active && s.category === category);
}

/**
 * 获取推荐场景排序（按评估结果难度从低到高排列）
 */
export function getRecommendedSceneOrder(level: DifficultyLevel): SceneData[] {
  const active = getActiveScenes();
  const difficultyOrder: DifficultyLevel[] =
    level === 'sprout'
      ? ['sprout', 'growing', 'blooming']
      : level === 'growing'
        ? ['growing', 'sprout', 'blooming']
        : ['blooming', 'growing', 'sprout'];

  return active.sort((a, b) => {
    const aIdx = difficultyOrder.indexOf(a.difficultyLevel);
    const bIdx = difficultyOrder.indexOf(b.difficultyLevel);
    return aIdx - bIdx;
  });
}

/**
 * 根据难度等级获取场景的展示配置
 * 应用对应难度的 variants
 */
export function getSceneForDifficulty(scene: SceneData, level: DifficultyLevel): SceneData {
  const variant = scene.variants?.[level];
  if (!variant) return scene;

  return {
    ...scene,
    options: variant.options,
    optionHints: variant.optionHints,
    voicePrompt: variant.voicePrompt,
    description: variant.description,
    introText: variant.introText,
    successText: variant.successText,
  };
}

/** 分类中文名映射 */
export const CATEGORY_LABELS: Record<string, string> = {
  greeting: '问候👋',
  thanks: '感谢🙏',
  emotion: '情绪表达😊',
  request: '需求表达🗣️',
};

