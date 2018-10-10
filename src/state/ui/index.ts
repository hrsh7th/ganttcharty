import * as State from '../';

export type UI = {
  viewportWidth: number;
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
 * defaults.
 */
export const defaults = (
  element: HTMLElement,
  option: Partial<State.Option.Option>,
  ui: Partial<UI>
) => {
  ui.viewportWidth = element.offsetWidth;
  ui.currentTime = option.baseTime;
  return ui;
};

