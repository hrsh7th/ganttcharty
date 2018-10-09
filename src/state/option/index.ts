export type Option = {
  headerWidth: number;
  rowHeight: number;
  columnWidth: number;
  scale: Scale;
  indentWidth: number;
  baseTime: Date;
};

export type Scale = 'day' | 'week';

export const defaults = (option: Partial<Option> = {}) => {
  option.headerWidth = 180;
  option.rowHeight = 24;
  option.columnWidth = 18;
  option.scale = 'day';
  option.indentWidth = 12;
  option.baseTime = new Date(Date.now() - scaleTime(option.scale) * 7);
  return option as Option;
};

export const scaleTime = (scale: Scale) => ({
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000
}[scale]);
