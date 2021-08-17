import { define } from 'state-use';
import * as UI from './ui';
import * as Task from './task';
import * as Option from './option';

export { UI, Task, Option };

export type State = {
  ui: UI.UI;
  option: Option.Option;
  tasks: Task.Task[];
};

const State = define<State>();

export const { get, setup, update, use } = State;
export { State as _State };
