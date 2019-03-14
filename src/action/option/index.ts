import * as State from '../../state';

export const zoomup = () => {
  State.update(state => {
    state.option.columnWidth += 3;
  });
};

export const zoomdown = () => {
  State.update(state => {
    state.option.columnWidth -= 3;
  });
};
