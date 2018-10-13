import { define, Select } from 'srimmer';
import * as UI from './ui';
import * as Task from './task';
import * as Option from './option';

export { Select, Task, Option, UI };

export type State = {
  ui: UI.UI;
  option: Option.Option;
  tasks: Task.Task[];
};

export const {
  Provider,
  Consumer,
  update,
  select,
  get,
  set
} = define<State>();

