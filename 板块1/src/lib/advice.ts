/**
 * 安抚建议查询
 *
 * [板块1实现] 实现 getAdvice 函数，从 data/advice-content.json 读取内容
 */

import type { AdviceContent, EmotionType } from '@/types';
import adviceData from '@/data/advice-content.json';

const adviceMap = new Map<EmotionType, AdviceContent>();
for (const item of adviceData as AdviceContent[]) {
  adviceMap.set(item.emotionType, item);
}

/**
 * 根据情绪类型获取安抚建议
 * @param emotionType 家长选择的情绪类型
 * @returns 安抚建议内容，含免责声明
 */
export function getAdvice(emotionType: EmotionType): AdviceContent | null {
  return adviceMap.get(emotionType) ?? null;
}
