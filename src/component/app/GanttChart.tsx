import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { HotKeys } from 'react-hotkeys';
import ResizeDetector from 'react-resize-detector';
import TimeAxis from './fixed-area/axis/TimeAxis';
import HeaderList from './chart-area/header/HeaderList';
import TaskList from './chart-area/task/TaskList';
import NowIndicator from './chart-area/now-indicator/NowIndicator';
import * as Action from '../../action';

import * as State from '../../state';

const Consumer = State.select(state => state);

export default class extends React.Component {

  private chart = React.createRef<HTMLDivElement>();

  public render() {
    return (
      <HotKeys keyMap={Action.Hotkey.keyMap} handlers={Action.Hotkey.handlers}>
        <Consumer>
          {state => (
            <>
              <ResizeDetector handleWidth handleHeight onResize={this.onResize} />
              <FixedArea {...state}>
                <FixedHeaderArea {...state} />
                <FixedAxisArea {...state}>
                  <TimeAxis />
                </FixedAxisArea>
              </FixedArea>
              <ChartArea innerRef={this.chart} {...state}>
                <ChartBody>
                  <HeaderArea {...state}>
                    <HeaderList />
                  </HeaderArea>
                  <TaskArea {...state} onWheel={this.onWheel}>
                    <TaskListBackground {...state} style={{
                      transform: (() => {
                        const scaleTime = State.Option.scaleTime(state.option.scale) * 2;
                        const columnWidth = state.option.columnWidth * 2;
                        return `translateX(${-Math.floor(state.ui.currentTime.getTime() % scaleTime / scaleTime * columnWidth)}px)`;
                      })()
                    }} />
                    <NowIndicator />
                    <TaskListSeekArea {...state} style={{
                      transform: `translateX(${-Math.floor(State.UI.x(state.ui.currentTime, state.option.baseTime, state.option.scale, state.option.columnWidth))}px)`
                    }}>
                      <TaskList />
                    </TaskListSeekArea>
                  </TaskArea>
                </ChartBody>
              </ChartArea>
            </>
          )}
        </Consumer>
      </HotKeys>
    );
  }

  private onWheel = (e: React.WheelEvent<HTMLElement>) => {
    e.preventDefault();
    const state = State.get()!;
    const diffX = State.Option.scaleTime(state.option.scale) * (e.deltaX / state.option.columnWidth);
    Action.UI.updateCurrentTime(diffX);
    const diffY = e.deltaY;
    this.chart.current && (this.chart.current.scrollTop += diffY);
  };

  private onResize = (width: number, height: number) => {
    Action.UI.updateViewport({ width, height });
  };
}

injectGlobal`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

const FixedArea = styled.div<State.Select<typeof Consumer>>`
  width: 100%;
  height: ${props => props.option.fixedAreaHeight}px;
  display: flex;
`;

const FixedHeaderArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.option.headerWidth}px;
  height: 100%;
  background: #f8f8ff;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;

const FixedAxisArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.ui.viewportWidth - props.option.headerWidth}px;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #f8ff8;
`;

const ChartArea = styled.div<State.Select<typeof Consumer>>`
  width: 100%;
  height: ${props => props.ui.viewportHeight - props.option.fixedAreaHeight}px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid #dfdfdf;
`;

const ChartBody = styled.div`
  display: flex;
  justify-contents: space-between;
`;

const HeaderArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.option.headerWidth}px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  overflow: hidden;
  z-index: 1;
  background-image: repeating-linear-gradient(
    180deg,
    #fff 0px,
    #fff ${props => props.option.rowHeight * 1 - 1}px,
    #f0f0f0 ${props => props.option.rowHeight * 1 - 1}px,
    #f0f0f0 ${props => props.option.rowHeight * 1}px
  );
`;

const TaskArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.ui.viewportWidth - props.option.headerWidth}px;
  min-height: 100%;
  position: relative;
  overflow: hidden;
`;

const TaskListSeekArea = styled.div`
  will-change: transform;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const TaskListBackground = styled.div<State.Select<typeof Consumer>>`
  will-change: transform;
  position: absolute;
  top: 0;
  left: -${props => props.option.columnWidth * 2}px;
  right: -${props => props.option.columnWidth * 2}px;
  bottom: 0;
  background-image: repeating-linear-gradient(
    180deg,
    transparent 0px,
    transparent ${props => props.option.rowHeight * 1 - 1}px,
    #f0f0f0 ${props => props.option.rowHeight * 1 - 1}px,
    #f0f0f0 ${props => props.option.rowHeight * 1}px
  ), repeating-linear-gradient(
    90deg,
    #f8f8f8 0px,
    #f8f8f8 ${props => props.option.columnWidth * 1}px,
    transparent ${props => props.option.columnWidth * 1}px,
    transparent ${props => props.option.columnWidth * 2}px
  );
`;
