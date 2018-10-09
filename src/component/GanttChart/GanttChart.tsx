import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { HotKeys } from 'react-hotkeys';
import { keyMap, handlers } from '../../action/keymap';
import * as Action from '../../action';
import * as State from '../../state';
import Header from './Header/Header';
import Task from './Task/Task';

const Consumer = State.select(state => state);

export default class extends React.Component {

  private chart  = React.createRef<HTMLDivElement>();

  public render() {
    return (
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <Consumer>
          {state => (
              <GanttChart innerRef={this.chart}>
                <ScrollArea>
                  <HeaderList {...state.option}>
                    {State.Task.getTree(state.tasks).map(node => (
                      <Header
                        key={node.task.id}
                        node={node}
                        option={state.option}
                        selectedTaskId={state.selectedTaskId}
                      />
                    ))}
                  </HeaderList>
                  <TaskList {...state.option} onWheel={this.onWheel}>
                    {State.Task.getTree(state.tasks).map(node => (
                      <Task
                        key={node.task.id}
                        node={node}
                        option={state.option}
                        selectedTaskId={state.selectedTaskId}
                      />
                    ))}
                  </TaskList>
                </ScrollArea>
              </GanttChart>
          )}
        </Consumer>
      </HotKeys>
    );
  }

  private onWheel = (e: React.WheelEvent<HTMLElement>) => {
    e.preventDefault();
    const diffX = (24 * 60 * 60 * 1000) * (e.deltaX / 50);
    Action.Option.updateBaseTime(diffX);
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
  max-width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
`;

const HeaderList = styled.div<State.Option.Option>`
  width: ${props => props.headerWidth}px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  z-index: 2;
  background-image: repeating-linear-gradient(
    180deg,
    #f8f8f8,
    #f8f8f8 ${props => props.rowHeight}px,
    #fff ${props => props.rowHeight}px,
    #fff ${props => props.rowHeight * 2}px
  );
`;

const TaskList = styled.div<State.Option.Option>`
  width: calc(100% - ${props => props.headerWidth - 4}px);
  min-height: 100%;
  position: relative;
  background-image: repeating-linear-gradient(
    90deg,
    #f8f8f8,
    #f8f8f8 ${props => props.columnWidth}px,
    #fff ${props => props.columnWidth}px,
    #fff ${props => props.columnWidth * 2}px
  );
`;

