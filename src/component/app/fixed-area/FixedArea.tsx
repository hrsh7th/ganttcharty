import React from 'react';
import styled from 'styled-components';
import * as State from '../../../state';
import Axis from './axis/Axis'

const Consumer = State.select(state => ({
  fixedAreaHeight: state.option.fixedAreaHeight,
  headerWidth: state.option.headerWidth,
  viewportWidth: state.ui.viewportWidth
}));

export default () => (
  <Consumer>
    {state => (
      <FixedArea {...state}>
        <HeaderArea {...state} />
        <AxisArea {...state}>
          <Axis />
        </AxisArea>
      </FixedArea>
    )}
  </Consumer>
);

const FixedArea = styled.div<State.Select<typeof Consumer>>`
  width: 100%;
  height: ${props => props.fixedAreaHeight}px;
  display: flex;
`;

const HeaderArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.headerWidth}px;
  height: 100%;
  background: #f8f8ff;
  overflow: hidden;
  border-right: 1px solid #888;
`;

const AxisArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.viewportWidth - props.headerWidth}px;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #f8ff8;
`;

