import { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { CalendarHeader } from './calendar-header';
import { CalendarDay } from './calendar-day';
import type { CalendarProps, DayInfo } from './types';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function generateMonthDays(
  year: number,
  month: number,
  highlightedDates: Set<string>
): DayInfo[] {
  const days: DayInfo[] = [];
  const today = new Date();

  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay();

  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date,
      dayOfMonth: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      isHighlighted: false,
    });
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isHighlighted = highlightedDates.has(dateStr);

    days.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: true,
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
      isHighlighted,
    });
  }

  const remainingCells = 42 - days.length;
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: false,
      isToday: false,
      isHighlighted: false,
    });
  }

  return days;
}

export function Calendar({
  highlightedDates,
  onDatePress,
  onMonthChange,
}: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // Convert Set to array for stable dependency comparison
  const highlightedArray = useMemo(
    () => Array.from(highlightedDates).sort(),
    [highlightedDates]
  );

  const days = useMemo(
    () => generateMonthDays(year, month, highlightedDates),
    [year, month, highlightedArray]
  );

  const goToPrevMonth = () => {
    const newMonth = month === 0 ? 11 : month - 1;
    const newYear = month === 0 ? year - 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = month === 11 ? 0 : month + 1;
    const newYear = month === 11 ? year + 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    onMonthChange?.(newYear, newMonth);
  };

  return (
    <ThemedView style={styles.container}>
      <CalendarHeader
        year={year}
        month={month}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
      />

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <ThemedText style={styles.weekdayText}>{day}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            onPress={() => onDatePress?.(day.date)}
          />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
