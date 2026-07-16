/**
 * 星语冒险 — 游戏场景数据 v2
 *
 * 12 个预置社交场景全部激活，按四类分组。
 *
 * v2 深化内容：
 *   - 场景增加 introText / successText / outroText 叙事节拍
 *   - 选项增加 hints（错误引导）
 *   - 场景类型：single-choice / multi-step / emotion-recognition
 *   - "感到开心" → 情绪识别模式
 *   - "想喝水" → 多步对话模式
 */

import type { GameScene } from '@/types';
import type { SceneType, SceneStep, IllustrationAsset } from '@/types';

export interface SceneData extends GameScene {
  emoji: string;
  voicePrompt: string;
  active: boolean;
  difficulty?: number;
  ageRange?: string;
  introText: string;
  successText: string;
  outroText: string;
  optionHints: (string | null)[];
  sceneType: SceneType;
  steps?: SceneStep[];
  emotionOptions?: { emoji: string; label: string; correct: boolean }[];
  /** 互动插画资源（可选，无插画时降级为 emoji 显示） */
  illustration?: IllustrationAsset;
}

export const scenes: SceneData[] = [
  // ================================================================
  // greeting（问候，3个）
  // ================================================================
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
    introText: '星宝的火箭降落在问候星上。这里的人们都喜欢微笑着说"你好"。你也能做到吗？',
    successText: '星宝勇敢地走过去打了招呼！小朋友也开心地对他挥了挥手。问候星亮起来了！',
    outroText: '你也像星宝一样勇敢地说出了"你好"！',
    optionHints: [ '不理他的话，小朋友会以为你不喜欢他。试着走过去说"你好"吧！', null, '尖叫会吓到别人。轻轻走过去说"你好"会更好哦～' ],
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
        },
      ],
      generatedBy: 'ai-dalle',
      prompt: 'A warm sunny park with green grass and a playground slide. A friendly child stands smiling near the slide. A cute child character (StarBao with round face) is walking towards them, waving hand. Children book illustration style, warm gentle colors, soft rounded shapes, suitable for children with autism, age 4-8.',
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
    introText: '每天早上，老师都会在门口迎接大家。一个响亮的"早上好"能让老师很开心！',
    successText: '老师听到"早上好"，笑着摸了摸星宝的头。美好的一天开始了！',
    outroText: '每天早上跟老师打招呼，老师会很高兴的！',
    optionHints: [ '低着头老师不知道你来了。试试说"老师早上好"吧！', '哭闹不能解决问题。说"老师早上好"然后开开心心进教室吧！', null ],
    sceneType: 'single-choice',
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
    introText: '去别人家做客时，先打个招呼是有礼貌的表现。阿姨看到你一定会很开心的！',
    successText: '阿姨听到"阿姨好"笑得合不拢嘴，热情地请星宝进屋玩！',
    outroText: '做客时先问好，大家都会喜欢你！',
    optionHints: [ '躲起来阿姨会担心的。试着走出来说"阿姨好"吧！', null, '直接跑进去不太礼貌。先跟阿姨说"阿姨好"吧！' ],
    sceneType: 'single-choice',
  },

  // ================================================================
  // thanks（感谢，3个）
  // ================================================================
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
    introText: '星宝的火箭飞到了感谢星。这里的人们收到礼物时都会说一声温暖的"谢谢"。',
    successText: '奶奶听到"谢谢"后笑得可开心了，还抱了抱星宝！感谢星的能量充满了星宝的火箭。',
    outroText: '你学会说"谢谢"了！',
    optionHints: [ '奶奶精心准备了礼物，如果直接跑掉她会难过的。试试说"谢谢奶奶"吧！', '说"不喜欢"会让奶奶伤心。即使不是最喜欢的礼物，也可以先说"谢谢"表达感谢。', null ],
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
        },
      ],
      generatedBy: 'ai-dalle',
      prompt: 'A cozy living room. A kind grandmother sits on a sofa holding a wrapped gift box with a ribbon. StarBao (a cute child character with round face) stands in front of her looking at the gift with happy eyes. Children book illustration, warm gentle colors, soft shapes, age 4-8.',
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
    introText: '别人和你分享东西的时候，一句"谢谢"会让分享的人也很开心！',
    successText: '小朋友听到"谢谢"特别高兴，以后还愿意和星宝一起分享！',
    outroText: '收到别人的好意时说谢谢，朋友会越来越多！',
    optionHints: [ '即使觉得不好吃，也可以先说谢谢。分享的心意比味道更重要哦～', '抢别人的东西会让他不开心。接过饼干说"谢谢你"吧！', null ],
    sceneType: 'single-choice',
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
    introText: '当陌生人帮助了我们，说一声"谢谢"是最好的回应。',
    successText: '叔叔笑着说"不客气"，星宝感受到了帮助和被帮助的温暖！',
    outroText: '别人帮忙要说谢谢，这是人与人之间的温暖！',
    optionHints: [ '生气抢过来会让叔叔难过，他明明是来帮你的。说"谢谢叔叔"试试！', null, '拿了就走会让帮忙的人觉得不舒服。说句"谢谢叔叔"吧！' ],
    sceneType: 'single-choice',
  },

  // ================================================================
  // emotion（情绪表达，3个）
  // ================================================================
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
    introText: '星宝的火箭来到了情绪星。这里的人们会用语言说出自己的感受。先来认一认，哪个是开心的表情？',
    successText: '星宝不仅认出了开心的表情，还学会说出"我好高兴"！情绪星的光芒变得温暖而明亮。',
    outroText: '把开心说出来，快乐会加倍！',
    optionHints: [ '开心的时候说出来，别人也会为你高兴。试试说"我好高兴"吧！', '画得这么好，撕掉太可惜了。把开心说出来会更好哦～', null ],
    sceneType: 'emotion-recognition',
    emotionOptions: [
        { emoji: '😢', label: '难过', correct: false },
        { emoji: '😊', label: '开心', correct: true },
        { emoji: '😐', label: '平静', correct: false }
      ],
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
        },
      ],
      generatedBy: 'ai-dalle',
      prompt: 'A bright kindergarten classroom. StarBao (a cute round-faced child) holds a colorful rainbow painting. A teacher smiles giving a thumbs up. StarBao has a big happy smile. Children book illustration, warm gentle colors, soft shapes, suitable for children with autism, age 4-8.',
    },
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
    introText: '每个人都会有难过的时候。把难过的感觉说出来，别人才能帮助你。',
    successText: '妈妈听到后抱住了星宝："没关系的，我们一起来修好它！"',
    outroText: '难过的时候说出来，会有人来帮你！',
    optionHints: [ '摔东西可能会弄坏更多东西，还可能伤到自己。试试告诉妈妈"我很难过"吧！', '躲起来妈妈会担心的。说出来妈妈才能帮你呀～', null ],
    sceneType: 'single-choice',
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
    introText: '害怕是很正常的感受。勇敢地说出来，就有人陪着你、保护你。',
    successText: '妈妈打开灯，坐在星宝床边："别怕，妈妈在这里陪着你。"',
    outroText: '害怕的时候说出来，就不会一个人面对了！',
    optionHints: [ '尖叫会吵到别人，妈妈也不知道你害怕什么。轻轻告诉妈妈试试！', null, '蒙住头声音还在外面，还是害怕。去告诉妈妈"我有点害怕"吧！' ],
    sceneType: 'single-choice',
  },

  // ================================================================
  // request（需求表达，3个）
  // ================================================================
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
    introText: '星宝的火箭来到了最后一站——表达星。这里的人都知道，把需要说出来，别人才能帮你。',
    successText: '星宝清楚地表达了自己的需求！妈妈立刻给他倒了水。表达星的能量收集完毕！',
    outroText: '你学会了清楚地说出自己的需要。这是最重要的一项能力！',
    optionHints: [ '够不着可能会摔倒。告诉妈妈你想要什么会更安全哦～', null, '哭闹妈妈不知道你想要什么。试着说出"我想喝水"吧！' ],
    sceneType: 'multi-step',
    steps: [
      {
        description: '第一步：你想让妈妈注意到你。你会怎么做？',
        options: [
        { text: '哭闹', correct: false },
        { text: '走过去叫"妈妈"', correct: true },
        { text: '用力拉妈妈的衣角', correct: false }
      ],
        hints: ['哭闹妈妈会担心，但不知道你要什么。叫"妈妈"试试吧！', null, '拉衣角会让妈妈不舒服。叫一声"妈妈"，她会回头看你。'],
        illustration: {
          imageUrl: '/illustrations/need-01-step1.webp',
          thumbnailUrl: '/illustrations/need-01-step1-thumb.webp',
          alt: '客厅里，星宝感到口渴站在沙发旁，妈妈在旁边看书，桌上有一个水杯',
          width: 800,
          height: 500,
          hotspots: [
            {
              id: 'need-01-step1-call',
              x: 55, y: 25, width: 20, height: 38,
              label: '🗣️ 叫"妈妈"',
              linkedOptionIndex: 1,
              hintAnimation: 'pulse',
            },
            {
              id: 'need-01-step1-pull',
              x: 50, y: 60, width: 15, height: 25,
              label: '👕 拉衣角',
              linkedOptionIndex: 2,
              hintAnimation: 'none',
            },
          ],
          generatedBy: 'ai-dalle',
          prompt: 'A living room. StarBao feels thirsty, stands near the couch. Mom is reading a book nearby on a chair. A water cup is visible on the table. Children book illustration, warm gentle colors, soft shapes, age 4-8.',
        },
      },
      {
        description: '第二步：妈妈看着你了！现在告诉妈妈你想做什么？',
        options: [
        { text: '自己搬凳子去够水杯', correct: false },
        { text: '说"妈妈，我想喝水"', correct: true },
        { text: '指着水杯不说话', correct: false }
      ],
        hints: ['搬凳子很危险。用语言说出来，妈妈会帮你倒水的～', null, '指水杯妈妈可能不明白你是渴了还是想玩杯子。说出来更清楚！'],
        illustration: {
          imageUrl: '/illustrations/need-01-step2.webp',
          thumbnailUrl: '/illustrations/need-01-step2-thumb.webp',
          alt: '近景：妈妈用温柔的眼神看着星宝，水杯在他们之间的桌子上',
          width: 800,
          height: 500,
          hotspots: [
            {
              id: 'need-01-step2-speak',
              x: 40, y: 20, width: 22, height: 38,
              label: '💬 说"我想喝水"',
              linkedOptionIndex: 1,
              hintAnimation: 'pulse',
            },
            {
              id: 'need-01-step2-point',
              x: 60, y: 55, width: 16, height: 25,
              label: '👆 指水杯不说',
              linkedOptionIndex: 2,
              hintAnimation: 'none',
            },
          ],
          generatedBy: 'ai-dalle',
          prompt: 'Close-up view: Mom looks at StarBao with caring eyes, sitting nearby. The water cup is on the table between them. StarBao is about to speak. Children book illustration, warm gentle colors, soft shapes, age 4-8.',
        },
      },
    ],
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
    introText: '在外面玩的时候，如果需要上厕所，一定要及时告诉大人。',
    successText: '妈妈立刻带星宝去了厕所。"说出来就好，不用憋着！"',
    outroText: '及时说出自己的需要，身体才舒服！',
    optionHints: [ '自己跑开妈妈会找不到你，会很担心的。说一声再去吧！', null, '憋着对身体不好，还可能尿裤子。告诉妈妈就没事了！' ],
    sceneType: 'single-choice',
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
    introText: '看到喜欢的东西，清楚地告诉妈妈你的想法，比哭闹更有效。',
    successText: '星宝清楚地表达了想要的东西。妈妈微笑着想了想："等过节的时候，我们再来看看好不好？"',
    outroText: '好好说出自己的想法，大人才知道怎么回应你！',
    optionHints: [ '不付钱就拿走是不对的。告诉妈妈你想要，她可能会考虑的！', '躺在地上大哭大家都看着，妈妈也会很尴尬。试着说"妈妈我想要这个"吧！', null ],
    sceneType: 'single-choice',
  },
];

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

/** 分类中文名映射 */
export const CATEGORY_LABELS: Record<string, string> = {
  greeting: '问候👋',
  thanks: '感谢🙏',
  emotion: '情绪表达😊',
  request: '需求表达🗣️',
};
