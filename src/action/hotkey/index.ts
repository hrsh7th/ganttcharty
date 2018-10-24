import * as Action from '../';
import * as State from '../../state';
import { HotkeysEvent } from 'hotkeys-js';
import throttle from 'lodash/throttle';

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
  'selected up': (e: KeyboardEvent) => {
    e.preventDefault();
    Action.UI.selectPrevTask();
  },
  'selected down': (e: KeyboardEvent) => {
    e.preventDefault();
    Action.UI.selectNextTask();
  },
  'move left': throttle(() => {
    const state = State.get()!;
    Action.UI.moveSelectedTask(-State.Option.scaleTime(state.option.scale));
  }, 60),
  'move right': throttle(() => {
    const state = State.get()!;
    Action.UI.moveSelectedTask(State.Option.scaleTime(state.option.scale));
  }, 60),
  'add task': (e: KeyboardEvent) => {
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
