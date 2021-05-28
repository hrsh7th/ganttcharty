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

export const changeHeaderWidth = (width: number) => {
  State.update(state => {
    state.option.headerWidth = width;
  });
};
