import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MONTH_NAMES = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

export function CalendarHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View style={styles.container}>
      <Pressable onPress={onPrevMonth} style={styles.button}>
        <Ionicons name='chevron-back' size={24} color={iconColor} />
      </Pressable>

      <ThemedText type='subtitle'>
        {year}년 {MONTH_NAMES[month]}
      </ThemedText>

      <Pressable onPress={onNextMonth} style={styles.button}>
        <Ionicons name='chevron-forward' size={24} color={iconColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  button: {
    padding: 8,
  },
});
