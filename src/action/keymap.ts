import * as Action from './';

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
    Action.Option.updateBaseTime(24 * 60 * 60 * 1000);
  },
  'right': () => {
    Action.Option.updateBaseTime(-24 * 60 * 60 * 1000);
  },
  'add': (event?: KeyboardEvent) => {
    event!.preventDefault();
    Action.Task.add();
  },
  'delete': () => {
    Action.Task.deleteSelectedTask();
  }
};
