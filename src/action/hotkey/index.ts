import * as Action from '../';

export const keyMap = {
  'up': ['k', 'up'],
  'down': ['j', 'down'],
  'left': ['h', 'left'],
  'right': ['l', 'right'],
  'add': ['enter'],
  'delete': ['backspace']
};

export const handlers = {
  'up': () => {
    Action.Task.selectPrevTask();
  },
  'down': () => {
    Action.Task.selectNextTask();
  },
  'left': () => {
    Action.Task.collapse();
  },
  'right': () => {
    Action.Task.expand();
  },
  'add': (event?: KeyboardEvent) => {
    event!.preventDefault();
    Action.Task.add();
  },
  'delete': () => {
    Action.Task.deleteSelectedTask();
  }
};

