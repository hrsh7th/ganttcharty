import React from 'react';
import * as State from '../../../../state';
import Task from './Task';

const Consumer = State.select(state => ({
  tasks: state.tasks,
  rowHeight: state.option.rowHeight,
  barHeight: state.option.barHeight,
  columnWidth: state.option.columnWidth,
  scale: state.option.scale,
  baseTime: state.option.baseTime,
  selectedTaskId: state.ui.selectedTaskId,
}));

export default () => (
  <Consumer>
    {state => (
      State.Task.tasks(state.tasks).map(node => (
        <Task
          key={node.id}
          node={node}
          rowHeight={state.rowHeight}
          scale={state.scale}
          barHeight={state.barHeight}
          columnWidth={state.columnWidth}
          baseTime={state.baseTime}
          selectedTaskId={state.selectedTaskId}
        />
      ))
    )}
  </Consumer>
);

