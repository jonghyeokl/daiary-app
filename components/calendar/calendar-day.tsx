import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { DayInfo } from './types';

interface CalendarDayProps {
  day: DayInfo;
  onPress?: () => void;
}

export function CalendarDay({ day, onPress }: CalendarDayProps) {
  const tintColor = useThemeColor({}, 'tint');

  const opacity = day.isCurrentMonth ? 1 : 0.3;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, day.isToday && styles.today]}
    >
      <ThemedText style={{ opacity }}>{day.dayOfMonth}</ThemedText>

      {day.isHighlighted && day.isCurrentMonth && (
        <View style={[styles.dot, { backgroundColor: tintColor }]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  today: {
    borderRadius: 20,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
