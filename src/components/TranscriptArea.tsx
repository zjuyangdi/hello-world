import React, { useRef, useEffect } from 'react';
import { View, TextInput, Text, ScrollView } from 'react-native';
import { InputMode } from '../types';

interface Props {
  transcript: string;
  interimTranscript: string;
  mode: InputMode;
  onChangeText: (text: string) => void;
}

export function TranscriptArea({ transcript, interimTranscript, mode, onChangeText }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [transcript, interimTranscript]);

  const isEmpty = !transcript && !interimTranscript;

  if (mode === 'keyboard') {
    return (
      <TextInput
        className="w-full h-44 bg-gray-800 rounded-2xl p-4 text-white text-base leading-6"
        multiline
        autoFocus
        value={transcript}
        onChangeText={onChangeText}
        placeholder="输入文字..."
        placeholderTextColor="#6b7280"
        textAlignVertical="top"
        style={{ minHeight: 176 }}
      />
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      className="w-full h-44 bg-gray-800 rounded-2xl p-4"
      style={{ minHeight: 176 }}
      showsVerticalScrollIndicator={false}
    >
      {isEmpty ? (
        <Text className="text-gray-500 text-base">点击麦克风开始语音输入...</Text>
      ) : (
        <Text className="text-base leading-6">
          <Text className="text-white">{transcript}</Text>
          {transcript && interimTranscript ? <Text className="text-white"> </Text> : null}
          {interimTranscript ? (
            <Text className="text-gray-400 italic">{interimTranscript}</Text>
          ) : null}
        </Text>
      )}
    </ScrollView>
  );
}
