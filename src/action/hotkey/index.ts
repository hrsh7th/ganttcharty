import * as Action from '../';
import * as State from '../../state';
import { HotkeysEvent } from 'hotkeys-js';

export const keyMap = {
  'selected up': ['k', 'up'],
  'selected down': ['j', 'down'],
  'move left': ['h', 'left'],
  'move right': ['l', 'right'],
  'add task': ['enter'],
  'remove task': ['backspace'],
  'expand task': ['shift+right'],
  'collapse task': ['shift+left'],
  'sort tasks': ['s'],
  'toggle export': ['shift+e'],
  'zoom up': ['ctrl+='],
  'zoom down': ['ctrl+-']
};

export const handlers = {
  'selected up': e => {
    e.preventDefault();
    Action.UI.selectPrevTask();
  },
  'selected down': e => {
    e.preventDefault();
    Action.UI.selectNextTask();
  },
  'move left': e => {
    e.preventDefault();
    const state = State.get()!;
    if (state.ui.selectedTaskId) {
      const diff = State.Option.scaleTime(state.option.scale);
      const task = State.Task.get(state.tasks, state.ui.selectedTaskId)!;
      Action.Task.update(task.id, {
        startedAt: new Date(
          State.Task.startedAt(state.tasks, task.id).getTime() - diff
        ),
        finishedAt: new Date(
          State.Task.finishedAt(state.tasks, task.id).getTime() - diff
        )
      });
    }
  },
  'move right': e => {
    e.preventDefault();
    const state = State.get()!;
    if (state.ui.selectedTaskId) {
      const diff = State.Option.scaleTime(state.option.scale);
      const task = State.Task.get(state.tasks, state.ui.selectedTaskId)!;
      Action.Task.update(task.id, {
        startedAt: new Date(
          State.Task.startedAt(state.tasks, task.id).getTime() + diff
        ),
        finishedAt: new Date(
          State.Task.finishedAt(state.tasks, task.id).getTime() + diff
        )
      });
    }
  },
  'add task': e => {
    e.preventDefault();
    Action.Task.add(State.get()!.ui.selectedTaskId);
  },
  'remove task': () => {
    const state = State.get()!;
    if (state.ui.selectedTaskId) {
      Action.Task.remove(state.ui.selectedTaskId);
    }
  },
  'expand task': () => {
    const state = State.get()!;
    if (state.ui.selectedTaskId) {
      Action.Task.expand(state.ui.selectedTaskId);
    }
  },
  'collapse task': () => {
    const state = State.get()!;
    if (state.ui.selectedTaskId) {
      Action.Task.collapse(state.ui.selectedTaskId);
    }
  },
  'sort tasks': () => {
    Action.Task.sort();
  },
  'zoom up': () => {
    Action.Option.zoomup();
  },
  'zoom down': () => {
    Action.Option.zoomdown();
  },
  'toggle export': () => {
    Action.UI.toggleExportView(!State.get()!.ui.exporting);
  }
} as {
  [key in keyof typeof keyMap]: (ke: KeyboardEvent, he: HotkeysEvent) => void
};
