import React from 'react';
import styled from 'styled-components';
import startOfDay from 'date-fns/start_of_day';
import * as State from '../../../../state';

const Consumer = State.select(state => {
  return {
    scale: state.option.scale,
    columnWidth: state.option.columnWidth,
    currentTime: state.ui.currentTime
  };
});

export default () => (
  <Consumer>
    {state => (
      <NowIndicator {...state} style={{
        transform: `translateX(${State.Task.x(state.scale, state.currentTime, state.columnWidth, startOfDay(new Date()))}px)`
      }}/>
    )}
  </Consumer>
);

const NowIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-left: 2px dashed #333;
  height: 100%;
`;

