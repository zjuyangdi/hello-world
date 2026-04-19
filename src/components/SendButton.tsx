import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface Props {
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function SendButton({ onPress, disabled, isLoading }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      className={`flex-1 flex-row items-center justify-center py-3.5 rounded-2xl ${
        disabled || isLoading ? 'bg-gray-700' : 'bg-blue-600'
      }`}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <View className="flex-row items-center">
          <Text className="text-white font-semibold text-base mr-1">分析总结</Text>
          <Text className="text-white text-base">→</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
