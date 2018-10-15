import * as Action from '../';
import * as State from '../../state';
import throttle from 'lodash/throttle';

export const keyMap = {
  'selected up': ['k', 'up'],
  'selected down': ['j', 'down'],
  'move left': ['h', 'left'],
  'move right': ['l', 'right'],
  'add task': ['enter'],
  'delete task': ['backspace'],
  'expand task': ['shift+right'],
  'collapse task': ['shift+left']
};

export const handlers = {
  'selected up': () => {
    Action.Task.selectPrevTask();
  },
  'selected down': () => {
    Action.Task.selectNextTask();
  },
  'move left': throttle(() => {
    const state = State.get()!;
    Action.Task.moveSelectedTask(-State.Option.scaleTime(state.option.scale));
  }, 60),
  'move right': throttle(() => {
    const state = State.get()!;
    Action.Task.moveSelectedTask(State.Option.scaleTime(state.option.scale));
  }, 60),
  'add task': (event?: KeyboardEvent) => {
    event!.preventDefault();
    Action.Task.add();
  },
  'delete task': () => {
    Action.Task.deleteSelectedTask();
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
};

