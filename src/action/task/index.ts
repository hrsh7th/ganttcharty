import { v4 as uuid } from 'uuid';
import * as State from '../../state';

export const insertPrev = (
  targetTaskId: State.Task.TaskId,
  insertTaskId: State.Task.TaskId
) => {
  State.update(state => {
    const targetTask =
      State.Task.getPrev(state.tasks, targetTaskId)! ||
      State.Task.get(state.tasks, targetTaskId);
    const insertTask = State.Task.get(state.tasks, insertTaskId)!;

    insertTask.parentId = targetTask.parentId;
    state.tasks.splice(state.tasks.indexOf(insertTask), 1);
    state.tasks.splice(state.tasks.indexOf(targetTask), 0, insertTask);
  });
};

export const insertNext = (
  targetTaskId: State.Task.TaskId,
  insertTaskId: State.Task.TaskId
) => {
  State.update(state => {
    const targetTask = State.Task.getNext(state.tasks, targetTaskId)!;
    const insertTask = State.Task.get(state.tasks, insertTaskId)!;

    insertTask.parentId = targetTask.parentId;
    state.tasks.splice(state.tasks.indexOf(insertTask), 1);
    state.tasks.splice(state.tasks.indexOf(targetTask), 0, insertTask);
  });
};

export const expand = (taskId: State.Task.TaskId) => {
  State.update(state => {
    const target = State.Task.get(state.tasks, taskId)!;
    const children = State.Task.getChildren(state.tasks, target.id, false);
    if (target && children.length && target.collapsed) {
      target.collapsed = false;
    }
  });
};

export const collapse = (taskId: State.Task.TaskId) => {
  State.update(state => {
    const target = State.Task.get(state.tasks, taskId)!;
    const children = State.Task.getChildren(state.tasks, target.id, false);
    if (target && children.length && !target.collapsed) {
      target.collapsed = true;
    }
  });
};

export const add = (extendTaskId?: State.Task.TaskId) => {
  State.update(state => {
    if (!state.ui.selectedTaskId) return;

    // create newTask and extends selected task.
    const extend = State.Task.get(state.tasks, extendTaskId)!;
    const newTask: State.Task.Task = {
      id: uuid(),
      name: `new task ${state.tasks.length}`,
      description: '',
      startedAt: new Date(extend.startedAt.getTime()),
      finishedAt: new Date(extend.finishedAt.getTime()),
      parentId: extend.parentId
    };

    // insert newTask to next to selected task.
    state.tasks.splice(state.tasks.indexOf(extend) + 1, 0, newTask);

    // select newTask.
    state.ui.selectedTaskId = newTask.id;
  });
};

export const remove = () => {
  State.update(state => {
    if (!state.ui.selectedTaskId) return;

    // remove selected task.
    const target = State.Task.get(state.tasks, state.ui.selectedTaskId)!;

    // remove children.
    const children = State.Task.getChildren(state.tasks, target.id);
    children.forEach(child =>
      state.tasks.splice(state.tasks.indexOf(child), 1)
    );

    // memory target to move.
    const prev = State.Task.getPrev(state.tasks, state.ui.selectedTaskId);
    const next = State.Task.getNext(state.tasks, state.ui.selectedTaskId);

    // remove target task.
    state.tasks.splice(state.tasks.indexOf(target), 1);

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

export const update = (
  taskId: State.Task.TaskId,
  attrs: Partial<State.Task.Task>
) => {
  State.update(state => {
    const task = State.Task.get(state.tasks, taskId);
    Object.keys(attrs).forEach(key => {
      // @ts-ignore
      task[key] = attrs[key];
    });
  });
};
