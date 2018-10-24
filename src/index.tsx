import React from 'react';
import ReactDOM from 'react-dom';
import * as State from './state';
import { GanttChart } from './component/app/GanttChart';

type Input = {
  option?: any;
  tasks: (State.Task.Task | { startedAt: string; finishedAt: string })[];
};

export { State };

export function render(id: string, state: Input) {
  const element = document.getElementById(id)!;
  ReactDOM.render(
    <State.Provider state={defaults(element, state)}>
      <GanttChart />
    </State.Provider>,
    element
  );
  return {
    get: State.get
  };
}

const defaults = (element: HTMLElement, input: Input): State.State => {
  const state = {} as any;
  state.option = State.Option.defaults(input.option || {});
  state.ui = State.UI.defaults(element, input.option);
  state.tasks = State.Task.defaults(input.tasks || []);
  return state as State.State;
};
