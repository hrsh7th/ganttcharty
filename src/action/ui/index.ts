import * as State from '../../state';

export const updateCurrentTime = (diff: number) => {
  State.update(state => {
    state.ui.currentTime = new Date(state.ui.currentTime.getTime() + diff);
  });
};

export const updateViewport = (rect: { width: number; height: number; }) => {
  State.update(state => {
    state.ui.viewportWidth = rect.width;
    state.ui.viewportHeight = rect.height;
  });
};

export const selectTask = (taskId: State.Task.TaskId | undefined) => {
  State.update(state => {
    state.ui.selectedTaskId = taskId;
  });
};

