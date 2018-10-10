import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { HotKeys } from 'react-hotkeys';
import HeaderList from './header/HeaderList';
import TaskList from './task/TaskList';
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
              <GanttChart innerRef={this.chart}>
                <ScrollArea>
                  <HeaderArea {...state.option}>
                    <HeaderList />
                  </HeaderArea>
                  <TaskArea {...state} onWheel={this.onWheel}>
                    <TaskListScrollArea {...state.option} style={{
                      transform: `translateX(${-Math.floor(State.UI.x(state.ui.currentTime, state.option.baseTime, state.option.scale, state.option.columnWidth))}px)`
                    }}>
                      <TaskList />
                    </TaskListScrollArea>
                    <TaskListBackground {...state.option} style={{
                      transform: (() => {
                        const scaleTime = State.Option.scaleTime(state.option.scale) * 2;
                        const columnWidth = state.option.columnWidth * 2;
                        return `translateX(${-Math.floor(state.ui.currentTime.getTime() % scaleTime / scaleTime * columnWidth)}px)`;
                      })()
                    }} />
                  </TaskArea>
                </ScrollArea>
              </GanttChart>
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
}

injectGlobal`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

const GanttChart = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  box-sizing: border-box;
  border: 1px solid #dfdfdf;
`;

const ScrollArea = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
`;

const HeaderArea = styled.div<State.Option.Option>`
  width: ${props => props.headerWidth}px;
  min-height: 100%;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  overflow-x: scroll;
  z-index: 3;
  background-image: repeating-linear-gradient(
    180deg,
    transparent 0px,
    transparent ${props => props.rowHeight * 1 - 1}px,
    #f0f0f0 ${props => props.rowHeight * 1 - 1}px,
    #f0f0f0 ${props => props.rowHeight * 1}px
  );
`;

const TaskArea = styled.div<State.State>`
  width: ${props => props.ui.viewportWidth - props.option.headerWidth}px;
  min-height: 100%;
  position: relative;
  overflow: hidden;
`;

const TaskListScrollArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
`;

const TaskListBackground = styled.div<State.Option.Option>`
  position: absolute;
  top: 0;
  left: -${props => props.columnWidth * 2}px;
  right: -${props => props.columnWidth * 2}px;
  bottom: 0;
  z-index: 1;
  background-image: repeating-linear-gradient(
    180deg,
    transparent 0px,
    transparent ${props => props.rowHeight * 1 - 1}px,
    #f0f0f0 ${props => props.rowHeight * 1 - 1}px,
    #f0f0f0 ${props => props.rowHeight * 1}px
  ), repeating-linear-gradient(
    90deg,
    #f8f8f8 0px,
    #f8f8f8 ${props => props.columnWidth * 1}px,
    transparent ${props => props.columnWidth * 1}px,
    transparent ${props => props.columnWidth * 2}px
  );
`;

