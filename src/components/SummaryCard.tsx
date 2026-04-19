import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import { StructuredSummary } from '../types';

interface Props {
  summary: StructuredSummary | null;
  streamingText: string;
  isLoading: boolean;
}

function Tag({ label }: { label: string }) {
  return (
    <View className="bg-gray-700 rounded-full px-3 py-1 mr-2 mb-2">
      <Text className="text-gray-300 text-xs">{label}</Text>
    </View>
  );
}

export function SummaryCard({ summary, streamingText, isLoading }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const visible = isLoading || !!summary || !!streamingText;

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
    } else {
      opacity.value = 0;
      translateY.value = 20;
    }
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  const copyToClipboard = async () => {
    if (!summary) return;
    const text = [
      summary.title,
      '',
      '要点：',
      ...(summary.keyPoints ?? []).map((p) => `• ${p}`),
      ...(summary.actionItems?.length
        ? ['', '待办：', ...summary.actionItems.map((a) => `☐ ${a}`)]
        : []),
    ].join('\n');
    await Clipboard.setStringAsync(text);
  };

  return (
    <Animated.View style={animStyle} className="mt-4 bg-gray-800 rounded-2xl p-4">
      {/* Loading / streaming state */}
      {(isLoading || streamingText) && !summary ? (
        <View>
          <Text className="text-gray-400 text-xs mb-2">正在分析...</Text>
          {streamingText ? (
            <Text className="text-gray-500 text-xs font-mono" numberOfLines={4}>
              {streamingText}
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* Parsed summary */}
      {summary ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row items-start justify-between mb-3">
            <Text className="text-white text-lg font-bold flex-1 pr-2">{summary.title}</Text>
            <TouchableOpacity onPress={copyToClipboard} className="bg-gray-700 rounded-lg px-2 py-1">
              <Text className="text-gray-300 text-xs">复制</Text>
            </TouchableOpacity>
          </View>

          {summary.keyPoints?.length > 0 && (
            <View className="mb-3">
              <Text className="text-gray-400 text-xs font-semibold uppercase mb-2">要点</Text>
              {summary.keyPoints.map((point, i) => (
                <View key={i} className="flex-row mb-1.5">
                  <Text className="text-blue-400 mr-2">•</Text>
                  <Text className="text-gray-200 text-sm flex-1">{point}</Text>
                </View>
              ))}
            </View>
          )}

          {summary.actionItems && summary.actionItems.length > 0 && (
            <View className="mb-3">
              <Text className="text-gray-400 text-xs font-semibold uppercase mb-2">待办</Text>
              {summary.actionItems.map((item, i) => (
                <View key={i} className="flex-row mb-1.5">
                  <Text className="text-yellow-400 mr-2">☐</Text>
                  <Text className="text-gray-200 text-sm flex-1">{item}</Text>
                </View>
              ))}
            </View>
          )}

          {summary.entities && (
            <View>
              {summary.entities.names?.length > 0 && (
                <View className="mb-2">
                  <Text className="text-gray-400 text-xs mb-1">人名</Text>
                  <View className="flex-row flex-wrap">
                    {summary.entities.names.map((n, i) => <Tag key={i} label={n} />)}
                  </View>
                </View>
              )}
              {summary.entities.places?.length > 0 && (
                <View className="mb-2">
                  <Text className="text-gray-400 text-xs mb-1">地点</Text>
                  <View className="flex-row flex-wrap">
                    {summary.entities.places.map((p, i) => <Tag key={i} label={p} />)}
                  </View>
                </View>
              )}
              {summary.entities.dates?.length > 0 && (
                <View className="mb-2">
                  <Text className="text-gray-400 text-xs mb-1">时间</Text>
                  <View className="flex-row flex-wrap">
                    {summary.entities.dates.map((d, i) => <Tag key={i} label={d} />)}
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      ) : null}
    </Animated.View>
  );
}
