import startOfDay from 'date-fns/start_of_day';

export type Option = {
  headerWidth: number;
  rowHeight: number;
  columnWidth: number;
  scale: Scale;
  fixedAreaHeight: number;
  indentWidth: number;
  baseTime: Date;
  dayLabel: string[];
};

export type Scale = 'day' | 'week';

/**
 * create scale time.
 */
export const scaleTime = (scale: Scale) => ({
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000
}[scale]);

export const defaults = (option: Partial<Option> = {}) => {
  option.headerWidth = 180;
  option.rowHeight = 24;
  option.columnWidth = 18;
  option.scale = 'day';
  option.fixedAreaHeight = 32;
  option.indentWidth = 12;
  option.baseTime = startOfDay(new Date(Date.now() - scaleTime(option.scale) * 7));
  option.dayLabel = [
    '日',
    '月',
    '火',
    '水',
    '木',
    '金',
    '土'
  ];
  return option as Option;
};
