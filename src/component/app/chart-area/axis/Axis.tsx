import React from 'react';
import styled from 'styled-components';
import { startOfWeek } from 'date-fns';
import * as State from '../../../../state';
import { DayAxis } from './day/DayAxis';

const Consumer = State.select(state => ({
  scale: state.option.scale,
  columnWidth: state.option.columnWidth,
  currentTime: state.ui.currentTime
}));

export const Axis = () => (
  <Consumer>
    {state => (
      <Self
        style={{
          transform: `translateX(${State.UI.x(
            startOfWeek(state.currentTime, { weekStartsOn: 1 }),
            state.currentTime,
            state.scale,
            state.columnWidth
          )}px)`
        }}
      >
        <DayAxis />
      </Self>
    )}
  </Consumer>
);

const Self = styled.div`
  will-change: transform;
  position: absolute;
  width; 100%;
  height: 100%;
  display: flex;
  border-bottom: 1px solid #ddd;
`;
