import { useCallback } from 'react';
import { summarizeTranscript } from '../services/anthropic';
import { useAppStore } from '../store/useAppStore';

const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

export function useClaude() {
  const {
    accumulatedTranscript,
    setIsLoadingClaude,
    setStreamingText,
    setSummary,
    setClaudeError,
  } = useAppStore();

  const summarize = useCallback(async () => {
    const text = accumulatedTranscript.trim();
    if (!text) return;

    if (!API_KEY) {
      setClaudeError('未配置 API Key，请在 .env 文件中设置 EXPO_PUBLIC_ANTHROPIC_API_KEY');
      return;
    }

    setIsLoadingClaude(true);
    setStreamingText('');
    setSummary(null);
    setClaudeError(null);

    try {
      const result = await summarizeTranscript(text, API_KEY, (partial) => {
        setStreamingText(partial);
      });
      setSummary(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : '分析失败，请重试';
      setClaudeError(message);
    } finally {
      setIsLoadingClaude(false);
      setStreamingText('');
    }
  }, [accumulatedTranscript, setIsLoadingClaude, setStreamingText, setSummary, setClaudeError]);

  return { summarize };
}
