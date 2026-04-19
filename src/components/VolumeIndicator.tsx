import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  volumeLevel: number; // -2 to 10
  visible: boolean;
}

const BAR_COUNT = 5;

function Bar({ index, volumeLevel }: { index: number; volumeLevel: number }) {
  const height = useSharedValue(4);

  useEffect(() => {
    const normalised = Math.max(0, Math.min(1, (volumeLevel + 2) / 12));
    // Each bar has a slight offset so they animate at different heights
    const offset = Math.abs(index - 2) * 0.15;
    const target = 4 + normalised * 28 * Math.max(0.2, 1 - offset);
    height.value = withSpring(target, { damping: 8, stiffness: 120 });
  }, [volumeLevel, index]);

  const style = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={style}
      className="w-1 rounded-full bg-red-400 mx-0.5"
    />
  );
}

export function VolumeIndicator({ volumeLevel, visible }: Props) {
  if (!visible) return null;

  return (
    <View className="flex-row items-end justify-center h-9 mt-1">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <Bar key={i} index={i} volumeLevel={volumeLevel} />
      ))}
    </View>
  );
}
