import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import eachDay from 'date-fns/each_day';
import * as State from '../';

export type UI = {
  viewportWidth: number;
  viewportHeight: number;
  currentTime: Date;
  selectedTaskId?: State.Task.TaskId;
  exporting: boolean;
};

/**
 * create view width.
 */
export const width = (
  startTime: Date,
  finishTime: Date,
  scale: State.Option.Scale,
  columnWidth: number
) => {
  return (
    ((finishTime.getTime() - startTime.getTime()) /
      State.Option.scaleTime(scale)) *
    columnWidth
  );
};

/**
 * create view x.
 */
export const x = (
  currentTime: Date,
  baseTime: Date,
  scale: State.Option.Scale,
  columnWidth: number
) => {
  return Math.floor(
    ((currentTime.getTime() - baseTime.getTime()) /
      State.Option.scaleTime(scale)) *
      columnWidth
  );
};

/**
 * x2time.
 */
export const x2time = (
  x: number,
  columnWidth: number,
  scale: State.Option.Scale
) => {
  return Math.floor(x / columnWidth) * State.Option.scaleTime(scale);
};

/**
 * create view rest width.
 */
export const restWidth = (
  time: Date,
  scale: State.Option.Scale,
  columnWidth: number,
  multiple: number = 1
) => {
  const span = State.Option.scaleTime(scale) * multiple;
  return Math.floor(
    ((time.getTime() % span) / State.Option.scaleTime(scale)) * columnWidth
  );
};

/**
 * create day axis.
 */
export const dayAxis = (
  currentTime: Date,
  scale: State.Option.Scale,
  columnWidth: number,
  viewportWidth: number
) => {
  const scaleTime = State.Option.scaleTime(scale);
  const viewportTime = (viewportWidth / columnWidth) * scaleTime;
  const startTime = startOfWeek(currentTime, { weekStartsOn: 1 });
  const finishTime = endOfWeek(
    startTime.getTime() + viewportTime + State.Option.WEEK,
    { weekStartsOn: 1 }
  );
  return eachDay(startTime, finishTime).reduce(
    (weeks, day) => {
      if (day.getDay() === 1) {
        weeks.push({
          day: day,
          days: [day]
        });
        return weeks;
      }
      weeks[weeks.length - 1].days.push(day);
      return weeks;
    },
    [] as { day: Date; days: Date[] }[]
  );
};

/**
 * defaults.
 */
export const defaults = (
  element: HTMLElement,
  option: Partial<State.Option.Option>
) => {
  const ui = {} as any;
  ui.viewportWidth = element.offsetWidth;
  ui.viewportHeight = element.offsetHeight;
  ui.currentTime = option.baseTime;
  ui.exporting = false;
  return ui;
};
