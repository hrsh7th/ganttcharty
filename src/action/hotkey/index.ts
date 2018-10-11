import * as Action from '../';
import * as State from '../../state';

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
    const state = State.get()!;
    Action.Task.moveSelectedTask(-State.Option.scaleTime(state.option.scale));
  },
  'right': () => {
    const state = State.get()!;
    Action.Task.moveSelectedTask(State.Option.scaleTime(state.option.scale));
  },
  'add': (event?: KeyboardEvent) => {
    event!.preventDefault();
    Action.Task.add();
  },
  'delete': () => {
    Action.Task.deleteSelectedTask();
  }
};

