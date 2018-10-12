import React from 'react';
import styled from 'styled-components';
import startOfDay from 'date-fns/start_of_day';
import * as State from '../../../state';
import HeaderList from './header/HeaderList';
import TaskList from './task/TaskList';

const Consumer = State.select(state => ({
  fixedAreaHeight: state.option.fixedAreaHeight,
  viewportWidth: state.ui.viewportWidth,
  viewportHeight: state.ui.viewportHeight,
  headerWidth: state.option.headerWidth,
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
      <ChartArea {...state} innerRef={innerRef}>
        <ChartBody {...state}>
          <HeaderArea {...state}>
            <HeaderList />
          </HeaderArea>
          <TaskArea {...state} onWheel={onWheel}>
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
          </TaskArea>
        </ChartBody>
      </ChartArea>
    )}
  </Consumer>
);

const ChartArea = styled.div<State.Select<typeof Consumer>>`
  width: 100%;
  height: ${props => props.viewportHeight - props.fixedAreaHeight}px;
  overflow: hidden;
`;

const ChartBody = styled.div<State.Select<typeof Consumer>>`
  width: 100%;
  min-height: 100%;
  display: flex;
`;

const HeaderArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.headerWidth}px;
  min-height: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  z-index: 2;
  background-image: repeating-linear-gradient(
    180deg,
    #fff 0px,
    #fff ${props => props.rowHeight - 1}px,
    #f0f0f0 ${props => props.rowHeight - 1}px,
    #f0f0f0 ${props => props.rowHeight}px
  );
`;

const TaskArea = styled.div<State.Select<typeof Consumer>>`
  position: relative;
  width: ${props => props.viewportWidth - props.headerWidth}px;
  min-height: 100%;
  overflow: hidden;
`;

const TaskListBackground = styled.div<State.Select<typeof Consumer>>`
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

const TaskListSeekArea = styled.div<State.Select<typeof Consumer>>`
  will-change: transform;
  width: 100%;
`;

const Now = styled.div<State.Select<typeof Consumer>>`
  position: absolute;
  top: 0;
  left: ${props => props.columnWidth / 2}px;
  height: 100%;
  border-left: 2px dashed #888;
`;

