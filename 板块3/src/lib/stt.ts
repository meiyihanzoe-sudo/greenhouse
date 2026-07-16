/**
 * STT 语音识别（Web Speech API）v2
 *
 * 核心改进：
 *   1. probeStt 探测更宽容（2s超时 + audiostart优先）
 *   2. 识别超时从8s延长到10s
 *   3. onend 不立即reject，给onresult缓冲时间
 *   4. 详细的错误分类
 *   5. 支持重试机制
 */

export interface SttResult {
  transcript: string;
  confidence: number;
}

/** 默认超时时间（毫秒） */
const DEFAULT_TIMEOUT_MS = 10000;

/**
 * 检测 STT 是否可用（API 级别）
 */
export function isSttAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}

/**
 * 获取 SpeechRecognition 构造函数
 */
function getRecognitionCtor(): new () => any | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

/**
 * 检测是否有可用的音频输入设备
 */
export async function hasAudioInput(): Promise<boolean> {
  try {
    if (!navigator.mediaDevices?.enumerateDevices) return false;
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((d) => d.kind === 'audioinput');
  } catch {
    return false;
  }
}

/**
 * 检测麦克风权限状态
 */
export async function checkMicrophonePermission(): Promise<PermissionState | 'unsupported'> {
  if (!navigator.permissions?.query) return 'unsupported';
  try {
    const result = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });
    return result.state;
  } catch {
    return 'unsupported';
  }
}

/**
 * 快速探测 STT 是否真的能工作（v3 改进版）
 *
 * 改进点：
 *   - audio-capture/not-allowed 错误立即返回 false（headless/无权限环境）
 *   - onaudiostart 优先级最高（有音频流=确定能工作）
 *   - 超时 2 秒兜底
 */
export async function probeStt(): Promise<boolean> {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return false;

  return new Promise((resolve) => {
    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'zh-CN';

    let resolved = false;

    const done = (result: boolean) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      try {
        recognition.abort();
      } catch {}
      resolve(result);
    };

    // 有音频流 = 硬件层面确定能工作
    recognition.onaudiostart = () => done(true);

    // 任何错误 — 快速判断
    recognition.onerror = (event: any) => {
      // audio-capture: 没有音频设备（headless 环境最常见）
      // not-allowed: 权限被拒
      // network: 需要联网但没网
      if (event.error === 'audio-capture' || event.error === 'not-allowed' || event.error === 'network') {
        done(false);
        return;
      }
      // no-speech: API 至少能启动，算可用
      if (event.error === 'no-speech') {
        done(true);
        return;
      }
      // 其他错误保守处理
      done(false);
    };

    // 2 秒超时
    const timer = setTimeout(() => done(false), 2000);

    try {
      recognition.start();
    } catch {
      done(false);
    }
  });
}

/**
 * 开始语音识别（v2 改进版）
 *
 * 改进点：
 *   - 超时延长到 10s
 *   - continuous: false（单次识别更稳定）
 *   - onend 给 800ms 缓冲等待 onresult
 *   - 更详细的错误分类
 *
 * @param lang 识别语言，默认 'zh-CN'
 * @param timeoutMs 超时时间（毫秒），默认 10000
 */
export function startListening(
  lang: string = 'zh-CN',
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<SttResult> {
  return new Promise((resolve, reject) => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      reject(new Error('not_supported'));
      return;
    }

    const recognition = new Ctor();
    recognition.lang = lang;
    // continuous: false → 说完一句话自动结束，更稳定
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let timeoutId: ReturnType<typeof setTimeout>;
    let resolved = false;
    let hasResult = false;
    let hasStarted = false;

    const finish = (fn: () => void) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeoutId);
      try {
        recognition.abort();
      } catch {}
      fn();
    };

    // 超时处理
    timeoutId = setTimeout(() => {
      if (!hasResult) {
        finish(() => reject(new Error('timeout')));
      }
    }, timeoutMs);

    // API 启动成功
    recognition.onstart = () => {
      hasStarted = true;
    };

    // 音频开始采集
    recognition.onaudiostart = () => {
      // 音频流已建立，标记（用于调试）
    };

    // 音频结束
    recognition.onaudioend = () => {
      // continuous=false 时，说话停顿后触发
    };

    // 收到识别结果
    recognition.onresult = (event: any) => {
      hasResult = true;
      // 取最终结果（非 interim）
      let finalTranscript = '';
      let finalConfidence = 0;

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript = result[0]?.transcript || '';
          finalConfidence = result[0]?.confidence || 0;
        }
      }

      // 如果没有 final，取第一个 interim
      if (!finalTranscript && event.results[0]?.[0]?.transcript) {
        finalTranscript = event.results[0][0].transcript;
        finalConfidence = event.results[0][0].confidence || 0;
      }

      if (finalTranscript.trim().length > 0) {
        finish(() => resolve({ transcript: finalTranscript, confidence: finalConfidence }));
      }
    };

    // 错误处理
    recognition.onerror = (event: any) => {
      switch (event.error) {
        case 'not-allowed':
          finish(() => reject(new Error('permission_denied')));
          break;
        case 'audio-capture':
          finish(() => reject(new Error('no_audio_device')));
          break;
        case 'network':
          finish(() => reject(new Error('network_error')));
          break;
        case 'no-speech':
          // 用户没说话 → 不立即reject，等 onend 再判断
          break;
        case 'aborted':
          // 被 abort() 主动停止 → 正常流程
          if (!hasResult && !resolved) {
            finish(() => reject(new Error('aborted')));
          }
          break;
        case 'bad-grammar':
        case 'language-not-supported':
          finish(() => reject(new Error(`lang_error:${event.error}`)));
          break;
        default:
          finish(() => reject(new Error(`stt_error:${event.error}`)));
      }
    };

    // 识别结束
    recognition.onend = () => {
      if (!resolved && !hasResult) {
        // 给 onresult 一点缓冲时间（某些浏览器 onresult 在 onend 之后才到）
        setTimeout(() => {
          if (!resolved && !hasResult) {
            if (hasStarted) {
              // 启动了但没结果 = 用户没说话
              finish(() => reject(new Error('no_speech')));
            } else {
              // 根本没启动 = 系统问题
              finish(() => reject(new Error('failed_to_start')));
            }
          }
        }, 800);
      }
    };

    // 启动识别
    try {
      recognition.start();
    } catch (err: any) {
      finish(() => reject(new Error(`start_error:${err.message || 'unknown'}`)));
    }
  });
}

/**
 * 停止语音识别（保留供外部调用）
 */
export function stopListening(): void {
  // Web Speech API 的 recognition 实例由 startListening 内部管理
}
