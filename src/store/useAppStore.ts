import { create } from 'zustand';
import { InputMode, StructuredSummary } from '../types';

interface AppState {
  mode: InputMode;
  accumulatedTranscript: string;
  summary: StructuredSummary | null;
  isLoadingClaude: boolean;
  streamingText: string;
  claudeError: string | null;

  setMode: (mode: InputMode) => void;
  appendToTranscript: (text: string) => void;
  setTranscript: (text: string) => void;
  clearAll: () => void;
  setSummary: (summary: StructuredSummary | null) => void;
  setIsLoadingClaude: (loading: boolean) => void;
  setStreamingText: (text: string) => void;
  setClaudeError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'voice',
  accumulatedTranscript: '',
  summary: null,
  isLoadingClaude: false,
  streamingText: '',
  claudeError: null,

  setMode: (mode) => set({ mode }),

  appendToTranscript: (text) =>
    set((state) => ({
      accumulatedTranscript: state.accumulatedTranscript
        ? `${state.accumulatedTranscript} ${text}`
        : text,
    })),

  setTranscript: (text) => set({ accumulatedTranscript: text }),

  clearAll: () =>
    set({
      accumulatedTranscript: '',
      summary: null,
      streamingText: '',
      claudeError: null,
    }),

  setSummary: (summary) => set({ summary }),
  setIsLoadingClaude: (isLoadingClaude) => set({ isLoadingClaude }),
  setStreamingText: (streamingText) => set({ streamingText }),
  setClaudeError: (claudeError) => set({ claudeError }),
}));
