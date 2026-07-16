/**
 * IndexedDB 离线存储 — 板块3 接口实现
 */

import { openDB, type IDBPDatabase } from 'idb';
import type { GameProgress, Collectible, PlanetProgress } from '@/types';
import type { AchievementProgress, DailyTaskProgress } from '@/modules/achievements/types';

const DB_NAME = 'green-house';
const DB_VERSION = 4;

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // emotion_events (板块1)
        if (!db.objectStoreNames.contains('emotion_events')) {
          const store = db.createObjectStore('emotion_events', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('timestamp', 'timestamp');
        }
        // aac_buttons (板块2)
        if (!db.objectStoreNames.contains('aac_buttons')) {
          const store = db.createObjectStore('aac_buttons', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('category', 'category');
          store.createIndex('order', 'order');
        }
        // game_progress (板块3)
        if (!db.objectStoreNames.contains('game_progress')) {
          db.createObjectStore('game_progress', { keyPath: 'sceneId' });
        }
        // v2: collectibles
        if (!db.objectStoreNames.contains('collectibles')) {
          const store = db.createObjectStore('collectibles', {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('type', 'type');
          store.createIndex('sceneId', 'sceneId');
        }
        // v2: planet_progress
        if (!db.objectStoreNames.contains('planet_progress')) {
          db.createObjectStore('planet_progress', { keyPath: 'category' });
        }
        // v3: achievement_progress
        if (!db.objectStoreNames.contains('achievement_progress')) {
          db.createObjectStore('achievement_progress', { keyPath: 'achievementId' });
        }
        // v3: daily_task_progress
        if (!db.objectStoreNames.contains('daily_task_progress')) {
          db.createObjectStore('daily_task_progress', { keyPath: 'date' });
        }
      },
    });
  }
  return dbPromise;
}

// ========== 板块3: 游戏进度 ==========

export async function saveGameProgress(progress: GameProgress): Promise<void> {
  const db = await getDb();
  await db.put('game_progress', progress);
}

export async function getGameProgress(): Promise<GameProgress[]> {
  const db = await getDb();
  return db.getAll('game_progress');
}

export async function getSceneProgress(sceneId: string): Promise<GameProgress | undefined> {
  const db = await getDb();
  return db.get('game_progress', sceneId);
}

// ========== 板块3: 收集物 ==========

export async function saveCollectible(collectible: Omit<Collectible, 'id'>): Promise<void> {
  const db = await getDb();
  await db.add('collectibles', collectible);
}

export async function getCollectibles(): Promise<Collectible[]> {
  const db = await getDb();
  return db.getAll('collectibles');
}

// ========== 板块3: 星球进度 ==========

export async function savePlanetProgress(progress: PlanetProgress[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction('planet_progress', 'readwrite');
  await Promise.all([...progress.map((p) => tx.store.put(p)), tx.done]);
}

export async function getPlanetProgress(): Promise<PlanetProgress[]> {
  const db = await getDb();
  return db.getAll('planet_progress');
}

// ========== v3: 成就进度 ==========

export async function saveAchievementProgress(progress: AchievementProgress): Promise<void> {
  const db = await getDb();
  await db.put('achievement_progress', progress);
}

export async function saveAllAchievementProgress(list: AchievementProgress[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction('achievement_progress', 'readwrite');
  await Promise.all([...list.map((p) => tx.store.put(p)), tx.done]);
}

export async function getAchievementProgress(): Promise<AchievementProgress[]> {
  const db = await getDb();
  return db.getAll('achievement_progress');
}

// ========== v3: 每日任务进度 ==========

export async function saveDailyTaskProgress(progress: DailyTaskProgress): Promise<void> {
  const db = await getDb();
  await db.put('daily_task_progress', progress);
}

export async function getDailyTaskProgress(date: string): Promise<DailyTaskProgress | undefined> {
  const db = await getDb();
  return db.get('daily_task_progress', date);
}

// ========== v3: 清档 ==========

export async function clearAllGameData(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(
    ['game_progress', 'collectibles', 'planet_progress', 'achievement_progress', 'daily_task_progress'],
    'readwrite',
  );
  await Promise.all([
    tx.objectStore('game_progress').clear(),
    tx.objectStore('collectibles').clear(),
    tx.objectStore('planet_progress').clear(),
    tx.objectStore('achievement_progress').clear(),
    tx.objectStore('daily_task_progress').clear(),
    tx.done,
  ]);
  localStorage.removeItem('star-adventure-intro-seen');
}

// ========== 板块1/2 占位 ==========

export async function logEmotionEvent(_event: any): Promise<number> {
  throw new Error('logEmotionEvent() not implemented');
}
export async function getEmotionEvents(_limit: number = 50): Promise<any[]> {
  throw new Error('getEmotionEvents() not implemented');
}
export async function saveButton(_button: any): Promise<number> {
  throw new Error('saveButton() not implemented');
}
export async function loadButtons(): Promise<any[]> {
  throw new Error('loadButtons() not implemented');
}
export async function deleteButton(_id: number): Promise<void> {
  throw new Error('deleteButton() not implemented');
}
