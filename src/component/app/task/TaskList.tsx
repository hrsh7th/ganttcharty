import React from 'react';
import * as State from '../../../state';
import Task from './Task';

const Consumer = State.select(state => {
  return {
    tasks: state.tasks,
    height: state.option.rowHeight,
    scale: state.option.scale,
    columnWidth: state.option.columnWidth,
    baseTime: state.option.baseTime,
    selectedTaskId: state.ui.selectedTaskId,
  };
});

export default () => (
  <Consumer>
    {state => (
       State.Task.getTree(state.tasks).map(node => (
        <Task
          key={node.task.id}
          node={node}
          height={state.height}
          scale={state.scale}
          columnWidth={state.columnWidth}
          baseTime={state.baseTime}
          selectedTaskId={state.selectedTaskId}
        />
      ))
    )}
  </Consumer>
);

