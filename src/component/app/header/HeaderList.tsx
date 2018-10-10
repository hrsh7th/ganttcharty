import React from 'react';
import * as State from '../../../state';
import Header from './Header';

const Consumer = State.select(state => {
  return {
    tasks: state.tasks,
    height: state.option.rowHeight,
    indentWidth: state.option.indentWidth,
    selectedTaskId: state.ui.selectedTaskId,
  };
});

export default () => (
  <Consumer>
    {state => (
      State.Task.getTree(state.tasks).map(node => (
        <Header
          key={node.task.id}
          node={node}
          height={state.height}
          indentWidth={state.indentWidth}
          selectedTaskId={state.selectedTaskId}
        />
      ))
    )}
  </Consumer>
);
