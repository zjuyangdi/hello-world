import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { InputMode } from '../types';

interface Props {
  mode: InputMode;
  onToggle: (mode: InputMode) => void;
}

export function ModeToggle({ mode, onToggle }: Props) {
  return (
    <View className="flex-row bg-gray-800 rounded-full p-1">
      <TouchableOpacity
        onPress={() => onToggle('voice')}
        className={`flex-row items-center px-4 py-2 rounded-full ${
          mode === 'voice' ? 'bg-gray-600' : ''
        }`}
        activeOpacity={0.7}
      >
        <Text className="text-base mr-1">🎤</Text>
        <Text className={`text-sm font-medium ${mode === 'voice' ? 'text-white' : 'text-gray-400'}`}>
          语音
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onToggle('keyboard')}
        className={`flex-row items-center px-4 py-2 rounded-full ${
          mode === 'keyboard' ? 'bg-gray-600' : ''
        }`}
        activeOpacity={0.7}
      >
        <Text className="text-base mr-1">⌨️</Text>
        <Text className={`text-sm font-medium ${mode === 'keyboard' ? 'text-white' : 'text-gray-400'}`}>
          键盘
        </Text>
      </TouchableOpacity>
    </View>
  );
}
