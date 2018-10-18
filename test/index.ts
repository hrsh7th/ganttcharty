import * as State from '../src/state';

export const fixture = () => {
  const e = document.createElement('div');
  e.style.width = '100px';
  e.style.height = '100px';

  const option = State.Option.defaults() as State.Option.Option;
  const ui = State.UI.defaults(e, option, {}) as State.UI.UI;
  const tasks = State.Task.defaults([task(1), task(2)]);
  return { option, ui, tasks };
};

export const task = (
  id: State.Task.TaskId,
  task: Partial<State.Task.Task> = {}
): State.Task.Task => {
  return {
    id: id,
    name: 'default task name',
    description: '',
    startedAt: new Date(),
    finishedAt: new Date(Date.now() + State.Option.DAY),
    ...task
  };
};
