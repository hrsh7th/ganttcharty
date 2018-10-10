import * as uuid from 'uuid';
import * as State from '../../state';

export const updateTask = (taskId: State.Task.TaskId, attrs: Partial<State.Task.Task>) => {
  State.update(state => {
    const task = State.Task.getTask(state.tasks, taskId);
    Object.keys(attrs).forEach(key => {
      // @ts-ignore
      task[key] = attrs[key];
    });
  })
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

export const expand = () => {
  State.update(state => {
    if (!state.ui.selectedTaskId) return;
    const selected = State.Task.getTask(state.tasks, state.ui.selectedTaskId)!;
    if (selected && selected.collapsed) {
      selected.collapsed = false;
    }
  });
};

export const collapse = () => {
  State.update(state => {
    if (!state.ui.selectedTaskId) return;
    const selected = State.Task.getTask(state.tasks, state.ui.selectedTaskId)!;
    if (selected && !selected.collapsed) {
      selected.collapsed = true;
    }
  });
};

export const add = () => {
  State.update(state => {
    if (!state.ui.selectedTaskId) return;

    // create newTask and extends selected task.
    const selected = State.Task.getTask(state.tasks, state.ui.selectedTaskId)!;
    const newTask: State.Task.Task = {
      id: uuid.v4(),
      name: 'new task',
      description: '',
      startedAt: new Date(Date.now()),
      finishedAt: new Date(Date.now() + State.Option.scaleTime(state.option.scale)),
      parentId: selected.parentId
    };

    // insert newTask to next to selected task.
    state.tasks.splice(
      state.tasks.indexOf(selected) + 1,
      0,
      newTask
    );

    // select newTask.
    state.ui.selectedTaskId = newTask.id;
  });
};

export const deleteSelectedTask = () => {
  State.update(state => {
    if (!state.ui.selectedTaskId) return;

    // memory target to move.
    const prev = State.Task.getPrev(state.tasks, state.ui.selectedTaskId);
    const next = State.Task.getNext(state.tasks, state.ui.selectedTaskId);

    // remove selected task.
    const target = State.Task.getTask(state.tasks, state.ui.selectedTaskId)!;
    state.tasks.splice(
      state.tasks.indexOf(target),
      1
    );

    // move to target.
    if (next) {
      state.ui.selectedTaskId = next.id;
    } else if (prev) {
      state.ui.selectedTaskId = prev.id;
    }

    // clear selecting if remove last task.
    if (state.tasks.length === 0) {
      state.ui.selectedTaskId = undefined;
    }
  });
};

