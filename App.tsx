import './global.css';
import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useAppStore } from './src/store/useAppStore';
import { useSpeechRecognition } from './src/hooks/useSpeechRecognition';
import { useClaude } from './src/hooks/useClaude';
import { VoiceButton } from './src/components/VoiceButton';
import { ModeToggle } from './src/components/ModeToggle';
import { TranscriptArea } from './src/components/TranscriptArea';
import { SendButton } from './src/components/SendButton';
import { SummaryCard } from './src/components/SummaryCard';
import { VolumeIndicator } from './src/components/VolumeIndicator';
import { InputMode } from './src/types';

export default function App() {
  const {
    mode,
    accumulatedTranscript,
    summary,
    isLoadingClaude,
    streamingText,
    claudeError,
    setMode,
    setTranscript,
    clearAll,
  } = useAppStore();

  const {
    isRecognizing,
    interimTranscript,
    volumeLevel,
    recordingState,
    speechError,
    start,
    stop,
  } = useSpeechRecognition();

  const { summarize } = useClaude();

  const handleModeToggle = useCallback(
    (newMode: InputMode) => {
      if (newMode === mode) return;
      if (isRecognizing) stop();
      setMode(newMode);
    },
    [mode, isRecognizing, stop, setMode]
  );

  const handleVoicePress = useCallback(() => {
    if (isRecognizing) {
      stop();
    } else {
      start('zh-CN');
    }
  }, [isRecognizing, start, stop]);

  const canSend = accumulatedTranscript.trim().length > 0 && !isLoadingClaude;

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6 mt-2">
            <View>
              <Text className="text-white text-2xl font-bold">VoiceIME</Text>
              <Text className="text-gray-500 text-xs mt-0.5">语音智能输入法</Text>
            </View>
            <TouchableOpacity
              onPress={clearAll}
              className="bg-gray-800 rounded-xl px-3 py-2"
              activeOpacity={0.7}
            >
              <Text className="text-gray-400 text-sm">清空</Text>
            </TouchableOpacity>
          </View>

          {/* Transcript area */}
          <TranscriptArea
            transcript={accumulatedTranscript}
            interimTranscript={interimTranscript}
            mode={mode}
            onChangeText={setTranscript}
          />

          {/* Character count */}
          <Text className="text-gray-600 text-xs text-right mt-1 mb-4">
            {accumulatedTranscript.length} 字
          </Text>

          {/* Mode toggle + Voice button */}
          <View className="items-center mb-2">
            <ModeToggle mode={mode} onToggle={handleModeToggle} />
          </View>

          <View className="items-center my-4">
            <VoiceButton
              recordingState={recordingState}
              onPress={handleVoicePress}
              disabled={mode === 'keyboard'}
            />
            <VolumeIndicator volumeLevel={volumeLevel} visible={isRecognizing} />
          </View>

          {/* Error messages */}
          {(speechError || claudeError) ? (
            <View className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 mb-4">
              <Text className="text-red-300 text-sm">{speechError ?? claudeError}</Text>
            </View>
          ) : null}

          {/* Send button */}
          <View className="flex-row mt-2">
            <SendButton
              onPress={summarize}
              disabled={!canSend}
              isLoading={isLoadingClaude}
            />
          </View>

          {/* Summary card */}
          <SummaryCard
            summary={summary}
            streamingText={streamingText}
            isLoading={isLoadingClaude}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
