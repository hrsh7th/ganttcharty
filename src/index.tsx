import React from 'react';
import ReactDOM from 'react-dom';
import GanttChart from './component/app/GanttChart'
import * as State from './state';

type Input = {
  option?: Partial<State.Option.Option>;
  ui?: Partial<State.UI.UI>;
  tasks: State.Task.Task[];
};

export function render(id: string, state: Input) {
  const element = document.getElementById(id)!;
  ReactDOM.render(
    <State.Provider state={defaults(element, state)}><GanttChart /></State.Provider>,
    element
  );
  return {
    get: State.get
  };
}

const defaults = (element: HTMLElement, state: Input): State.State => {
  state.option = State.Option.defaults(state.option || {});
  state.ui = State.UI.defaults(element, state.option, state.ui || {});
  state.tasks = State.Task.defaults(state.option, state.tasks || []);
  return state as State.State;
};

