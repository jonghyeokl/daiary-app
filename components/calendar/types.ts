export interface CalendarProps {
  highlightedDates: Set<string>;
  onDatePress?: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
}

export interface DayInfo {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHighlighted: boolean;
}
