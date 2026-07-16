/**
 * IndexedDB 离线存储（使用 idb 库）
 *
 * [架构负责人实现] 实现 getDb() 初始化数据库
 * [板块1实现] 实现 logEmotionEvent / getEmotionEvents
 * [板块2实现] 实现 saveButton / loadButtons / deleteButton
 * [板块3实现] 实现 saveGameProgress / getGameProgress
 */

import { openDB, type IDBPDatabase } from 'idb';
import type { EmotionEvent, AacButton, GameProgress } from '@/types';

const DB_NAME = 'green-house';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // emotion_events: 情绪事件日志
        if (!db.objectStoreNames.contains('emotion_events')) {
          const store = db.createObjectStore('emotion_events', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('timestamp', 'timestamp');
        }
        // aac_buttons: AAC 按钮
        if (!db.objectStoreNames.contains('aac_buttons')) {
          const store = db.createObjectStore('aac_buttons', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('category', 'category');
          store.createIndex('order', 'order');
        }
        // game_progress: 游戏进度
        if (!db.objectStoreNames.contains('game_progress')) {
          db.createObjectStore('game_progress', {
            keyPath: 'sceneId',
          });
        }
      },
    });
  }
  return dbPromise;
}

// ========== 板块1 接口 ==========

/** 记录情绪事件 */
export async function logEmotionEvent(event: EmotionEvent): Promise<number> {
  const db = await getDb();
  return db.add('emotion_events', event) as Promise<number>;
}

/** 获取情绪事件历史（按时间倒序） */
export async function getEmotionEvents(limit: number = 50): Promise<EmotionEvent[]> {
  const db = await getDb();
  const events = await db.getAllFromIndex('emotion_events', 'timestamp');
  // 按时间倒序排列
  events.sort((a, b) => b.timestamp - a.timestamp);
  return events.slice(0, limit);
}

// ========== 板块2 接口 ==========

/** 保存 AAC 按钮 */
export async function saveButton(button: AacButton): Promise<number> {
  // [板块2实现]
  throw new Error('saveButton() not implemented — 板块2 待实现');
}

/** 加载所有 AAC 按钮（按 order 排序） */
export async function loadButtons(): Promise<AacButton[]> {
  // [板块2实现]
  throw new Error('loadButtons() not implemented — 板块2 待实现');
}

/** 删除 AAC 按钮 */
export async function deleteButton(id: number): Promise<void> {
  // [板块2实现]
  throw new Error('deleteButton() not implemented — 板块2 待实现');
}

// ========== 板块3 接口 ==========

/** 保存游戏进度 */
export async function saveGameProgress(progress: GameProgress): Promise<void> {
  // [板块3实现]
  throw new Error('saveGameProgress() not implemented — 板块3 待实现');
}

/** 获取所有游戏进度 */
export async function getGameProgress(): Promise<GameProgress[]> {
  // [板块3实现]
  throw new Error('getGameProgress() not implemented — 板块3 待实现');
}
