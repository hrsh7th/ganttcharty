import React from 'react';
import styled from 'styled-components';
import startOfDay from 'date-fns/start_of_day';
import startOfWeek from 'date-fns/start_of_week';
import * as State from '../../../state';
import { TaskList } from './task/TaskList';
import { Axis } from './axis/Axis';
import { Movable, MoveEventHandler } from '../../ui-kit/movable';

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
  onMoving: MoveEventHandler;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

export const ChartArea = React.forwardRef(
  ({ onMoving, onScroll }: Props, ref: any) => (
    <Consumer>
      {state => (
        <Self width={state.viewportWidth - state.headerWidth}>
          <HeaderBox height={state.axisHeight}>
            <Axis />
          </HeaderBox>
          <Movable onMoving={onMoving}>
            <Box
              height={state.viewportHeight - state.axisHeight}
              ref={ref}
              onScroll={onScroll}
            >
              <TaskListContentArea>
                <TaskListBackground
                  columnWidth={state.columnWidth}
                  rowHeight={state.rowHeight}
                  style={{
                    transform: `translateX(${-State.UI.restWidth(
                      new Date(
                        state.currentTime.getTime() -
                          startOfWeek(state.baseTime.getTime(), {
                            weekStartsOn: 1
                          }).getTime()
                      ),
                      'week',
                      state.columnWidth * 7,
                      2
                    )}px)`
                  }}
                />
                <TaskListSeekArea
                  style={{
                    transform: `translateX(${-State.UI.x(
                      state.currentTime,
                      state.baseTime,
                      state.scale,
                      state.columnWidth
                    )}px)`
                  }}
                >
                  <Now
                    columnWidth={state.columnWidth}
                    style={{
                      transform: `translateX(${-State.UI.x(
                        state.baseTime,
                        state.nowDay,
                        state.scale,
                        state.columnWidth
                      )}px)`
                    }}
                  />
                  <TaskList />
                </TaskListSeekArea>
              </TaskListContentArea>
            </Box>
          </Movable>
        </Self>
      )}
    </Consumer>
  )
);

const Self = styled.div<{ width: number }>`
  width: ${props => props.width}px;
  height: 100%;
`;

const Box = styled.div<{ height: number }>`
  width: 100%;
  height: ${props => props.height}px;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const HeaderBox = styled(Box)`
  z-index: 1;
`;

const TaskListContentArea = styled.div`
  width: 100%;
  min-height: 100%;
  position: relative;
`;

const TaskListBackground = styled.div<{
  columnWidth: number;
  rowHeight: number;
}>`
  will-change: transform;
  position: absolute;
  top: 0;
  left: -${props => props.columnWidth * 7}px;
  right: -${props => props.columnWidth * 7}px;
  bottom: 0;
  background-image: repeating-linear-gradient(
      180deg,
      transparent 0px,
      transparent ${props => props.rowHeight - 1}px,
      #f0f0f0 ${props => props.rowHeight - 1}px,
      #f0f0f0 ${props => props.rowHeight}px
    ),
    repeating-linear-gradient(
      90deg,
      #f8f8f8 0px,
      #f8f8f8 ${props => props.columnWidth * 7}px,
      transparent ${props => props.columnWidth * 7}px,
      transparent ${props => props.columnWidth * 7 * 2}px
    );
`;

const TaskListSeekArea = styled.div`
  will-change: transform;
  width: 100%;
  min-height: 100%;
`;

const Now = styled.div<{ columnWidth: number }>`
  position: absolute;
  top: 0;
  left: ${props => props.columnWidth / 2}px;
  height: 100%;
  border-left: 2px dashed #888;
`;
