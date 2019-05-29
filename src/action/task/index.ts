import { v4 as uuid } from 'uuid';
import * as State from '../../state';

export const insertPrev = (
  targetTaskId: State.Task.TaskId,
  insertTaskId: State.Task.TaskId
) => {
  if (targetTaskId === insertTaskId) {
    return;
  }

  State.update(state => {
    const targetTask = State.Task.get(state.tasks, targetTaskId)!;
    const insertTask = State.Task.get(state.tasks, insertTaskId)!;

    insertTask.parentId = targetTask.parentId;
    state.tasks.splice(state.tasks.indexOf(insertTask), 1);
    state.tasks.splice(state.tasks.indexOf(targetTask), 0, insertTask);
  });
};

export const insertNext = (
  targetTaskId: State.Task.TaskId,
  insertTaskId: State.Task.TaskId,
  toChild?: boolean
) => {
  if (targetTaskId === insertTaskId) {
    return;
  }

  State.update(state => {
    const insertTask = State.Task.get(state.tasks, insertTaskId)!;
    state.tasks.splice(state.tasks.indexOf(insertTask), 1);

    const nextTask = State.Task.getNext(state.tasks, targetTaskId);
    if (nextTask && !toChild) {
      insertTask.parentId = toChild ? nextTask.id : nextTask.parentId;
      state.tasks.splice(state.tasks.indexOf(nextTask), 0, insertTask);
    } else {
      const targetTask = State.Task.get(state.tasks, targetTaskId)!;
      insertTask.parentId = toChild ? targetTask.id : targetTask.parentId;
      state.tasks.splice(state.tasks.indexOf(targetTask) + 1, 0, insertTask);
    }
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

export const sort = () => {
  State.update(state => {
    state.tasks.sort((a, b) => {
      return (
        State.Task.startedAt(state.tasks, a.id).getTime() -
        State.Task.startedAt(state.tasks, b.id).getTime()
      );
    });
  });
};

export const add = (extendTaskId?: State.Task.TaskId) => {
  State.update(state => {
    // create newTask and extends selected task.
    const extend = State.Task.get(state.tasks, extendTaskId);
    const newTask: State.Task.Task = {
      id: uuid(),
      name: `new task ${state.tasks.length}`,
      description: '',
      startedAt: new Date(extend ? extend.startedAt.getTime() : Date.now()),
      finishedAt: new Date(extend ? extend.finishedAt.getTime() : Date.now()),
      parentId: extend ? extend.parentId : undefined
    };

    // insert newTask to next to selected task.
    state.tasks.splice(
      extend ? state.tasks.indexOf(extend) + 1 : 0,
      0,
      newTask
    );

    // select newTask.
    state.ui.selectedTaskId = newTask.id;
  });
};

export const remove = (id: State.Task.TaskId) => {
  State.update(state => {
    // remove selected task.
    const target = State.Task.get(state.tasks, id)!;

    // remove children.
    const children = State.Task.getChildren(state.tasks, target.id, false);
    children.forEach(child => remove(child.id));

    // memory target to move.
    const prev = State.Task.getPrev(state.tasks, id);
    const next = State.Task.getNext(state.tasks, id);

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
  Object.keys(attrs).forEach(attr => {
    switch (attr) {
      case 'startedAt':
        updateStartedAt(taskId, attrs[attr]!);
        break;
      case 'finishedAt':
        updateFinishedAt(taskId, attrs[attr]!);
        break;
      default:
        State.update(state => {
          const task = State.Task.get(state.tasks, taskId)!;
          // @ts-ignore
          task[attr] = attrs[attr];
        });
        break;
    }
  });
};

export const updateStartedAt = (taskId: State.Task.TaskId, date: Date) => {
  State.update(state => {
    const task = State.Task.get(state.tasks, taskId)!;

    const children = State.Task.getChildren(state.tasks, taskId, false).sort(
      (a, b) => {
        return (
          State.Task.startedAt(state.tasks, a.id).getTime() -
          State.Task.startedAt(state.tasks, b.id).getTime()
        );
      }
    );

    if (!children.length) {
      task.startedAt = date;
      return;
    }

    const diff =
      date.getTime() -
      State.Task.startedAt(state.tasks, children[0].id).getTime();

    children.forEach(task => {
      updateStartedAt(
        task.id,
        new Date(State.Task.startedAt(state.tasks, task.id).getTime() + diff)
      );
      task.finishedAt = new Date(
        State.Task.finishedAt(state.tasks, task.id).getTime() + diff
      );
    });

    task.startedAt = State.Task.startedAt(state.tasks, taskId);
  });
};

export const updateFinishedAt = (taskId: State.Task.TaskId, date: Date) => {
  State.update(state => {
    const task = State.Task.get(state.tasks, taskId)!;

    const children = State.Task.getChildren(state.tasks, taskId, false).sort(
      (a, b) => {
        return (
          State.Task.finishedAt(state.tasks, b.id).getTime() -
          State.Task.finishedAt(state.tasks, a.id).getTime()
        );
      }
    );

    if (!children.length) {
      task.finishedAt = date;
      return;
    }

    const diff =
      date.getTime() -
      State.Task.finishedAt(state.tasks, children[0].id).getTime();

    children.forEach(task => {
      task.startedAt = new Date(
        State.Task.startedAt(state.tasks, task.id).getTime() + diff
      );
      updateFinishedAt(
        task.id,
        new Date(State.Task.finishedAt(state.tasks, task.id).getTime() + diff)
      );
    });

    task.finishedAt = State.Task.finishedAt(state.tasks, taskId);
  });
};
