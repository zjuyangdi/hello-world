import { useCallback, useState } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
  RecognizerIntentExtraLanguageModel,
} from 'expo-speech-recognition';
import { useAppStore } from '../store/useAppStore';
import { RecordingState } from '../types';

export interface SpeechRecognitionHook {
  isRecognizing: boolean;
  interimTranscript: string;
  volumeLevel: number;
  recordingState: RecordingState;
  speechError: string | null;
  start: (lang?: string) => Promise<void>;
  stop: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const appendToTranscript = useAppStore((s) => s.appendToTranscript);

  const [isRecognizing, setIsRecognizing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recordingState: RecordingState = isRecognizing ? 'recording' : 'idle';

  useSpeechRecognitionEvent('start', () => {
    setIsRecognizing(true);
    setSpeechError(null);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsRecognizing(false);
    setInterimTranscript('');
    setVolumeLevel(0);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? '';
    if (event.isFinal) {
      if (text.trim()) appendToTranscript(text.trim());
      setInterimTranscript('');
    } else {
      setInterimTranscript(text);
    }
  });

  useSpeechRecognitionEvent('volumechange', (event) => {
    setVolumeLevel(event.value ?? 0);
  });

  useSpeechRecognitionEvent('error', (event) => {
    const code = event.error;
    if (code === 'no-speech') return;
    if (code === 'network') {
      setSpeechError('网络不可用，请切换到键盘模式');
    } else if (code === 'not-allowed') {
      setSpeechError('麦克风权限被拒绝');
    } else if (code === 'interrupted') {
      setSpeechError('录音被中断，请再次点击麦克风');
    } else {
      setSpeechError(`识别错误: ${code}`);
    }
    setIsRecognizing(false);
  });

  const start = useCallback(async (lang = 'zh-CN') => {
    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      setSpeechError('麦克风权限被拒绝，请在设置中开启');
      return;
    }

    setSpeechError(null);
    ExpoSpeechRecognitionModule.start({
      lang,
      interimResults: true,
      continuous: false,
      addsPunctuation: true,
      androidIntentOptions: {
        EXTRA_LANGUAGE_MODEL: RecognizerIntentExtraLanguageModel.LANGUAGE_MODEL_WEB_SEARCH,
      },
      volumeChangeEventOptions: {
        enabled: true,
        intervalMillis: 100,
      },
    });
  }, [appendToTranscript]);

  const stop = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
  }, []);

  return {
    isRecognizing,
    interimTranscript,
    volumeLevel,
    recordingState,
    speechError,
    start,
    stop,
  };
}
