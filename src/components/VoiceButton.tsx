import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { RecordingState } from '../types';

interface Props {
  recordingState: RecordingState;
  onPress: () => void;
  disabled?: boolean;
}

export function VoiceButton({ recordingState, onPress, disabled }: Props) {
  const scale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);
  const ringScale = useSharedValue(1);

  const isRecording = recordingState === 'recording';

  useEffect(() => {
    if (isRecording) {
      scale.value = withSequence(
        withTiming(0.95, { duration: 150 }),
        withTiming(1.05, { duration: 150 })
      );
      ringOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 600 }),
          withTiming(0, { duration: 600 })
        ),
        -1
      );
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1200, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ),
        -1
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
      ringOpacity.value = withTiming(0, { duration: 200 });
      ringScale.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <View className="items-center justify-center">
      {/* Pulse ring */}
      <Animated.View
        style={ringStyle}
        className="absolute w-20 h-20 rounded-full bg-red-500"
        pointerEvents="none"
      />
      <TouchableOpacity onPress={handlePress} disabled={disabled} activeOpacity={0.8}>
        <Animated.View
          style={buttonStyle}
          className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${
            isRecording ? 'bg-red-500' : disabled ? 'bg-gray-700' : 'bg-gray-600'
          }`}
        >
          {isRecording ? (
            <View className="w-6 h-6 rounded bg-white" />
          ) : (
            <Text className="text-3xl">🎤</Text>
          )}
        </Animated.View>
      </TouchableOpacity>
      <Text className="text-xs text-gray-500 mt-2">
        {isRecording ? '点击停止' : disabled ? '键盘模式' : '点击录音'}
      </Text>
    </View>
  );
}
