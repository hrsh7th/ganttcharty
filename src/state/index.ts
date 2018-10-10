import { define } from 'srimmer';
import * as UI from './ui';
import * as Task from './task';
import * as Option from './option';

export { Task, Option, UI };

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
  get
} = define<State>();

