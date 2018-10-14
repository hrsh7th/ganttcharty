import React from 'react';
import styled from 'styled-components';
import startOfDay from 'date-fns/start_of_day';
import * as State from '../../../state';
import TaskList from './task/TaskList';
import Axis from './axis/Axis';

const Consumer = State.select(state => ({
  viewportWidth: state.ui.viewportWidth,
  viewportHeight: state.ui.viewportHeight,
  headerWidth: state.option.headerWidth,
  axisHeight: state.option.axisHeight,
  rowHeight: state.option.rowHeight,
  columnWidth: state.option.columnWidth,
  scale: state.option.scale,
  baseTime: state.option.baseTime,
  currentTime: state.ui.currentTime,
  nowDay: startOfDay(new Date())
}));

export type Props = {
  innerRef: React.RefObject<HTMLDivElement>;
  onWheel: React.WheelEventHandler<HTMLDivElement>;
};

export default ({ innerRef, onWheel }: Props) => (
  <Consumer>
    {state => (
      <ChartArea width={state.viewportWidth - state.headerWidth}>
        <HeaderBox height={state.axisHeight}>
          <Axis />
        </HeaderBox>
        <Box height={state.viewportHeight - state.axisHeight} innerRef={innerRef} onWheel={onWheel}>
          <TaskListContentArea {...state}>
            <TaskListBackground {...state} style={{
              transform: `translateX(${-State.UI.rest(new Date(state.currentTime.getTime() - state.baseTime.getTime()), state.scale, state.columnWidth, 2)}px)`
            }} />
            <TaskListSeekArea {...state} style={{
              transform: `translateX(${-State.UI.x(state.currentTime, state.baseTime, state.scale, state.columnWidth)}px)`
            }}>
              <Now {...state} style={{
                transform: `translateX(${-State.UI.x(state.baseTime, state.nowDay, state.scale, state.columnWidth)}px)`
              }} />
              <TaskList />
            </TaskListSeekArea>
          </TaskListContentArea>
        </Box>
      </ChartArea>
    )}
  </Consumer>
);

const ChartArea = styled.div<{ width: number; }>`
  width: ${props => props.width}px;
  height: 100%;
`;

const Box = styled.div<{ height: number; }>`
  width: 100%;
  height: ${props => props.height}px;
  position: relative;
  overflow: hidden;
`;

const HeaderBox = styled(Box)`
  z-index: 1;
`;

const TaskListContentArea = styled.div`
  width: 100%;
  min-height: 100%;
  position: relative;
`;

const TaskListBackground = styled.div<{ columnWidth: number; rowHeight: number; }>`
  will-change: transform;
  position: absolute;
  top: 0;
  left: -${props => props.columnWidth * 2}px;
  right: -${props => props.columnWidth * 2}px;
  bottom: 0;
  background-image: repeating-linear-gradient(
    180deg,
    transparent 0px,
    transparent ${props => props.rowHeight - 1}px,
    #f0f0f0 ${props => props.rowHeight - 1}px,
    #f0f0f0 ${props => props.rowHeight}px
  ), repeating-linear-gradient(
    90deg,
    #f8f8f8 0px,
    #f8f8f8 ${props => props.columnWidth}px,
    transparent ${props => props.columnWidth}px,
    transparent ${props => props.columnWidth * 2}px
  );
`;

const TaskListSeekArea = styled.div`
  will-change: transform;
  width: 100%;
  min-height: 100%;
`;

const Now = styled.div<{ columnWidth: number; }>`
  position: absolute;
  top: 0;
  left: ${props => props.columnWidth / 2}px;
  height: 100%;
  border-left: 2px dashed #888;
`;

