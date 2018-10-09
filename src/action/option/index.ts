import * as State from '../../state';

export const updateBasestate = (diff: number) => {
  State.update(state => {
    state.option.baseTime = new Date(state.option.baseTime.getTime() + diff);
  });
};
