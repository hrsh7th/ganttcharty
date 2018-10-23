import diff from 'snapshot-diff';
import { fixture, task } from '../../';
import * as State from '../../../src/state';
import * as Action from '../../../src/action';

describe('Action.Task', () => {
  describe('#insertPrev', () => {
    test('insert to children 1', () => {
      State.set(
        fixture([
          task('1', {}),
          task('2', {}),
          task('3', { parentId: '2' }),
          task('4', { parentId: '2' }),
          task('5', {})
        ])
      );

      const state = State.get()!;
      Action.Task.insertNext('2', '4');
      expect(diff(state, State.get())).toMatchSnapshot();
    });
    test('insert to children 2', () => {
      State.set(
        fixture([
          task('1', {}),
          task('2', {}),
          task('3', { parentId: '2' }),
          task('4', { parentId: '2' }),
          task('5', {})
        ])
      );

      const state = State.get()!;
      Action.Task.insertNext('2', '1');
      expect(diff(state, State.get())).toMatchSnapshot();
    });
    test('insert to children 2', () => {
      State.set(
        fixture([
          task('1', {}),
          task('2', {}),
          task('3', { parentId: '2' }),
          task('4', { parentId: '2' }),
          task('5', {})
        ])
      );

      const state = State.get()!;
      Action.Task.insertNext('4', '1');
      expect(diff(state, State.get())).toMatchSnapshot();
    });
  });
});
