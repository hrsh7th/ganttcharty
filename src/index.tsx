import React from 'react';
import ReactDOM from 'react-dom';
import GanttChart from './component/GanttChart/GanttChart'
import * as State from './state';

type Input = {
  option?: Partial<State.Option.Option>;
  ui?: Partial<State.UI.UI>;
  tasks: State.Task.Task[];
};

export function render(id: string, state: Input) {
  const element = document.getElementById(id)!;
  return ReactDOM.render(
    <State.Provider state={defaults(element, state)}><GanttChart /></State.Provider>,
    element
  );
}

const defaults = (element: HTMLElement, state: Input): State.State => {
  state.ui = State.UI.defaults(element, state.ui || {});
  state.option = State.Option.defaults(state.option || {});
  state.tasks = State.Task.defaults(state.tasks || []);
  return state as State.State;
};

