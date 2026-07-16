/**
 * 能力评估 — IndexedDB 存储
 */

import { getDb } from '@/lib/storage';
import type { AssessmentResult, AssessmentRecord } from './types';

const STORE_NAME = 'assessment_results';

/**
 * 保存评估结果
 */
export async function saveAssessmentResult(result: AssessmentResult): Promise<void> {
  const db = await getDb();
  const record: AssessmentRecord = { id: 'current', result };
  await db.put(STORE_NAME, record);
}

/**
 * 获取当前评估结果
 */
export async function getAssessmentResult(): Promise<AssessmentResult | null> {
  const db = await getDb();
  const record = await db.get(STORE_NAME, 'current');
  return record?.result ?? null;
}

/**
 * 清除评估结果
 */
export async function clearAssessmentResult(): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, 'current');
}

/**
 * 检查是否已完成评估
 */
export async function hasAssessment(): Promise<boolean> {
  const result = await getAssessmentResult();
  return result !== null;
}
