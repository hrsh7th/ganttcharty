import React from 'react';
import * as State from '../../../../state';
import Task from './Task';

const Consumer = State.select(state => ({
  tasks: state.tasks,
  height: state.option.rowHeight,
  columnWidth: state.option.columnWidth,
  scale: state.option.scale,
  baseTime: state.option.baseTime,
  selectedTaskId: state.ui.selectedTaskId,
}));

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

