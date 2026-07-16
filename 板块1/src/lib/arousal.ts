/**
 * 激烈程度计算 — HRV 主判定 + 心率辅助
 *
 * HRV（心率变异性）是情绪监测的金标准：
 * - HRV 高（30-60ms）= 自主神经系统灵活 = 平静
 * - HRV 低（<20ms）= 交感神经过度激活 = 紧张/情绪波动
 *
 * 心率作为辅助指标，防止运动误判（心率高但 HRV 正常 = 可能是运动而非情绪）
 */

import type { ArousalLevel } from '@/types';

/**
 * 根据心率和 HRV 计算激烈程度
 *
 * 判定逻辑（HRV 优先）：
 *   L0: HRV >= 30 且心率 < 90         — 平静
 *   L1: HRV 25-30，或心率 90-100      — 轻度波动
 *   L2: HRV 15-25，或心率 100-115     — 中度波动
 *   L3: HRV < 15，或心率 > 115 且 HRV < 20 — 高度波动
 *
 * @param heartRate 心率 (bpm)
 * @param hrvRmssd  心率变异性 RMSSD (ms)
 * @returns 激烈程度等级
 */
export function calculateArousalLevel(
  heartRate: number,
  hrvRmssd: number
): ArousalLevel {
  // ===== HRV 主判定 =====
  // L3: HRV 极低（<15）→ 交感神经过度激活
  if (hrvRmssd < 15) {
    return 'L3';
  }

  // L2: HRV 低（15-22）或 心率高 + HRV 低
  if (hrvRmssd < 22) {
    return 'L2';
  }

  // L2: 心率偏高 + HRV 偏低（双重确认）
  if (heartRate >= 110 && hrvRmssd < 25) {
    return 'L2';
  }

  // L3: 心率很高 + HRV 低
  if (heartRate >= 120 && hrvRmssd < 20) {
    return 'L3';
  }

  // L1: HRV 偏低（22-30）或心率略高
  if (hrvRmssd < 30 || heartRate >= 95) {
    return 'L1';
  }

  // L0: 心率正常 + HRV 正常
  return 'L0';
}
