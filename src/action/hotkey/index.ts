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
  'collapse task': ['shift+left']
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
    Action.UI.moveSelectedTask(-State.Option.scaleTime(state.option.scale));
  },
  'move right': e => {
    e.preventDefault();
    const state = State.get()!;
    Action.UI.moveSelectedTask(State.Option.scaleTime(state.option.scale));
  },
  'add task': e => {
    e.preventDefault();
    Action.Task.add(State.get()!.ui.selectedTaskId);
  },
  'remove task': () => {
    Action.Task.remove();
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
  }
} as {
  [key in keyof typeof keyMap]: (ke: KeyboardEvent, he: HotkeysEvent) => void
};
