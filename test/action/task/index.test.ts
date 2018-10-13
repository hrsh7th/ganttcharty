import diff from 'snapshot-diff';
import { fixture } from '../../';
import * as State from '../../../src/state';
import * as Action from '../../../src/action';

beforeEach(() => {
  State.set(fixture());
});

let state: State.State;

test('moveSelectedTask', () => {
  Action.UI.selectTask(1);

  state = State.get()!;
  Action.Task.moveSelectedTask(State.Option.DAY);
  expect(diff(state, State.get())).toMatchSnapshot();
  state = State.get()!;
  Action.Task.moveSelectedTask(-State.Option.DAY);
  expect(diff(state, State.get())).toMatchSnapshot();
});

