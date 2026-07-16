/**
 * STT 封装单元测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isSttAvailable } from '../lib/stt';

describe('lib/stt', () => {
  describe('isSttAvailable', () => {
    it('当 SpeechRecognition 存在时返回 true', () => {
      (window as any).SpeechRecognition = class {};
      expect(isSttAvailable()).toBe(true);
      delete (window as any).SpeechRecognition;
    });

    it('当 webkitSpeechRecognition 存在时返回 true', () => {
      (window as any).webkitSpeechRecognition = class {};
      expect(isSttAvailable()).toBe(true);
      delete (window as any).webkitSpeechRecognition;
    });

    it('当两者都不存在时返回 false', () => {
      delete (window as any).SpeechRecognition;
      delete (window as any).webkitSpeechRecognition;
      expect(isSttAvailable()).toBe(false);
    });
  });
});
