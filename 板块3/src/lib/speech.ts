/**
 * TTS 语音合成（Web Speech API）
 * 板块2 实现
 */
export function speak(_text: string, _rate: number = 0.9): Promise<void> {
  return Promise.resolve();
}

export function stopSpeaking(): void {}

export function isTtsAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
