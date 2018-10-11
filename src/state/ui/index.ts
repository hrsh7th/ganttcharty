import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import eachDay from 'date-fns/each_day';
import * as State from '../';

export type UI = {
  viewportWidth: number;
  viewportHeight: number;
  currentTime: Date;
  selectedTaskId?: State.Task.TaskId;
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
  return Math.floor((
    currentTime.getTime() - baseTime.getTime()
  ) / State.Option.scaleTime(scale) * columnWidth);
};

/**
 * create view rest width.
 */
export const rest = (
  time: Date,
  scale: State.Option.Scale,
  columnWidth: number,
  multiple: number = 1
) => {
  const scaleTime = State.Option.scaleTime(scale) * multiple;
  const width = columnWidth * multiple;
  return Math.floor(time.getTime() % scaleTime / scaleTime * width);
};

/**
 * create days axis.
 */
export const daysAxis = (
  currentTime: Date,
  scale: State.Option.Scale,
  columnWidth: number,
  viewportWidth: number
) => {
  const startTime = startOfWeek(currentTime, { weekStartsOn: 1 });
  const finishTime = endOfWeek(new Date(currentTime.getTime() + (viewportWidth / columnWidth * State.Option.scaleTime(scale))));
  return eachDay(startTime, finishTime).reduce((weeks, day) => {
    if (day.getDay() === 1 || !weeks.length) {
      weeks.push({
        day: day,
        days: [day]
      });
      return weeks;
    }
    weeks[weeks.length - 1].days.push(day);
    return weeks;
  }, [] as { day: Date; days: Date[]; }[]);
};

/**
 * defaults.
 */
export const defaults = (
  element: HTMLElement,
  option: Partial<State.Option.Option>,
  ui: Partial<UI>
) => {
  ui.viewportWidth = element.offsetWidth;
  ui.viewportHeight = element.offsetHeight;
  ui.currentTime = option.baseTime;
  return ui;
};

