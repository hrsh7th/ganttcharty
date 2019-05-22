import startOfDay from 'date-fns/start_of_day';
import * as State from '../';
import { Column } from '../../component/ui-kit/grid';

export const DAY = 24 * 60 * 60 * 1000;

export const WEEK = DAY * 7;

export type Column = Column<State.Task.TaskNode>;

export type Scale = 'day' | 'week';

export type Option = {
  headerWidth: number;
  rowHeight: number;
  columnWidth: number;
  scale: Scale;
  barHeight: number;
  axisHeight: number;
  indentWidth: number;
  baseTime: Date;
  dayLabel: string[];
  columns: Column<State.Task.TaskNode>[];
};

/**
 * create scale time.
 */
export const scaleTime = (scale: Scale) =>
  ({
    day: DAY,
    week: WEEK
  }[scale]);

export const defaults = (option: Partial<Option> = {}) => {
  option.headerWidth = 240;
  option.rowHeight = 24;
  option.columnWidth = 24;
  option.scale = 'day';
  option.barHeight = 12;
  option.axisHeight = 32;
  option.indentWidth = 12;
  option.baseTime = startOfDay(
    new Date(Date.now() - scaleTime(option.scale) * 7)
  );
  option.dayLabel = ['日', '月', '火', '水', '木', '金', '土'];
  option.columns = [
    {
      key: 'name',
      name: 'タスク',
      width: 200
    },
    {
      key: 'startedAt',
      name: '開始日',
      width: 120
    },
    {
      key: 'finishedAt',
      name: '終了日',
      width: 120
    }
  ];
  return option as Option;
};
