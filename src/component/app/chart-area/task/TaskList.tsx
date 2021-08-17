import React from 'react';
import * as State from '../../../../state';
import { Task } from './Task';

const C = () => {
  const state = State.use(state => ({
    tasks: state.tasks,
    rowHeight: state.option.rowHeight,
    barHeight: state.option.barHeight,
    columnWidth: state.option.columnWidth,
    scale: state.option.scale,
    baseTime: state.option.baseTime,
    selectedTaskId: state.ui.selectedTaskId
  }));
  return (
    State.Task.tasks(state.tasks).map(node => (
      <Task
        key={node.id}
        node={node}
        rowHeight={state.rowHeight}
        scale={state.scale}
        barHeight={state.barHeight}
        columnWidth={state.columnWidth}
        baseTime={state.baseTime}
        selected={node.id === state.selectedTaskId}
      />
    ))
  );
}
export const TaskList = React.memo(C as any);
