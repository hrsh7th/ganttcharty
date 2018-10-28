import * as State from '../../state';

export const updateCurrentTime = (diffX: number) => {
  State.update(state => {
    const diffTime =
      State.Option.scaleTime(state.option.scale) *
      (diffX / state.option.columnWidth);
    state.ui.currentTime = new Date(state.ui.currentTime.getTime() + diffTime);
  });
};

export const updateViewport = (rect: { width: number; height: number }) => {
  State.update(state => {
    state.ui.viewportWidth = rect.width;
    state.ui.viewportHeight = rect.height;
  });
};

export const toggleExportView = (toggle: boolean) => {
  State.update(state => {
    state.ui.exporting = toggle;
  });
};

export const select = (taskId?: State.Task.TaskId) => {
  State.update(state => {
    state.ui.selectedTaskId = taskId;
  });
  setTimeout(() => moveToSelectedTask());
};

export const moveToSelectedTask = () => {
  State.update(state => {
    if (!state.ui.selectedTaskId) return;

    const target = State.Task.get(state.tasks, state.ui.selectedTaskId)!;
    const { scale, columnWidth } = state.option;
    const { currentTime, viewportWidth } = state.ui;
    const startTime = currentTime;
    const finishTime = new Date(
      currentTime.getTime() +
        (viewportWidth / columnWidth) * State.Option.scaleTime(scale)
    );

    if (startTime.getTime() > target.finishedAt.getTime()) {
      state.ui.currentTime = new Date(
        target.startedAt.getTime() - State.Option.scaleTime(scale) * 14
      );
    } else if (target.startedAt.getTime() > finishTime.getTime()) {
      state.ui.currentTime = new Date(
        target.startedAt.getTime() - State.Option.scaleTime(scale) * 14
      );
    }
  });
};

export const selectNextTask = () => {
  State.update(state => {
    if (!state.ui.selectedTaskId) return;

    const next = State.Task.getNext(state.tasks, state.ui.selectedTaskId);
    if (next) {
      state.ui.selectedTaskId = next.id;
    }
  });
};

export const selectPrevTask = () => {
  State.update(state => {
    if (!state.ui.selectedTaskId) return;

    const prev = State.Task.getPrev(state.tasks, state.ui.selectedTaskId);
    if (prev) {
      state.ui.selectedTaskId = prev.id;
    }
  });
};
