/**
 * 能力评估题库
 *
 * 共 8 道题，每个维度 2 道。
 * ASD 友好：情境简短具体、选项清晰有画面感。
 */

import type { AssessmentQuestion } from './types';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ================================================================
  // greeting — 问候能力（2题）
  // ================================================================
  {
    id: 'q-greet-01',
    dimension: 'greeting',
    scenario: '在公园里，你看到一个认识的小朋友在玩滑梯。你会怎么做？',
    emoji: '👋',
    options: [
      { text: '自己走开，不看他', score: 0 },
      { text: '看着他想说话但不敢', score: 1 },
      { text: '走过去说"你好"', score: 2 },
    ],
  },
  {
    id: 'q-greet-02',
    dimension: 'greeting',
    scenario: '早上到了学校门口，老师站在门口迎接大家。你会怎么做？',
    emoji: '🏫',
    options: [
      { text: '低着头快速走进去', score: 0 },
      { text: '在妈妈提醒后说"老师好"', score: 1 },
      { text: '主动说"老师早上好"', score: 2 },
    ],
  },

  // ================================================================
  // thanks — 感谢能力（2题）
  // ================================================================
  {
    id: 'q-thanks-01',
    dimension: 'thanks',
    scenario: '小朋友把他的零食分给你一些。你会怎么做？',
    emoji: '🍪',
    options: [
      { text: '拿了就吃，不说话', score: 0 },
      { text: '笑一笑但不知道说什么', score: 1 },
      { text: '说"谢谢你"', score: 2 },
    ],
  },
  {
    id: 'q-thanks-02',
    dimension: 'thanks',
    scenario: '奶奶送你一个你很喜欢的玩具。奶奶笑着等你说话。你会怎么做？',
    emoji: '🎁',
    options: [
      { text: '拿了玩具就跑开去玩', score: 0 },
      { text: '在大人提示下说"谢谢"', score: 1 },
      { text: '开心地说"谢谢奶奶"', score: 2 },
    ],
  },

  // ================================================================
  // emotion — 情绪识别（2题）
  // ================================================================
  {
    id: 'q-emotion-01',
    dimension: 'emotion',
    scenario: '你画了一幅很漂亮的画，老师表扬了你。你现在是什么感觉？',
    emoji: '😊',
    options: [
      { text: '不知道/没感觉', score: 0 },
      { text: '笑一笑但不说话', score: 1 },
      { text: '开心地说"我好高兴"', score: 2 },
    ],
  },
  {
    id: 'q-emotion-02',
    dimension: 'emotion',
    scenario: '你最喜欢的玩具坏了。你心里不舒服。你会怎么做？',
    emoji: '😢',
    options: [
      { text: '大哭或摔东西', score: 0 },
      { text: '一个人躲在角落', score: 1 },
      { text: '告诉妈妈"我很难过"', score: 2 },
    ],
  },

  // ================================================================
  // request — 需求表达（2题）
  // ================================================================
  {
    id: 'q-request-01',
    dimension: 'request',
    scenario: '你玩了好久觉得口渴了，妈妈在旁边。你会怎么做？',
    emoji: '💧',
    options: [
      { text: '哭闹直到妈妈猜到', score: 0 },
      { text: '指着水杯不说话', score: 1 },
      { text: '说"妈妈我想喝水"', score: 2 },
    ],
  },
  {
    id: 'q-request-02',
    dimension: 'request',
    scenario: '你在商店看到一个可爱的玩具熊，很想要。你会怎么做？',
    emoji: '🧸',
    options: [
      { text: '直接拿走', score: 0 },
      { text: '拉着妈妈的手往那边走', score: 1 },
      { text: '说"妈妈我想要这个"', score: 2 },
    ],
  },
];

/** 每题最高分 */
export const MAX_SCORE_PER_QUESTION = 2;

/** 每个维度的最高分（2题 × 2分 = 4分） */
export const MAX_SCORE_PER_DIMENSION = 4;

/** 综合最高分（4维度 × 4分 = 16分） */
export const MAX_TOTAL_SCORE = 16;
