import * as State from '../src/state';
import { render } from '../src/index';

const DAY = 24 * 60 * 60 * 1000;

(window as any).State = State;

(window as any).chart = render('app', {
  option: {},
  tasks: [
    task(1, 'task1', ''),
    task(2, 'task1-1', '', 1),
    task(3, 'task1-2', '', 1),
    task(4, 'task1-3', '', 1),
    task(5, 'task1-4', '', 1),
    task(6, 'task1-5', '', 1),
    task(7, 'task1-6', '', 1),
    task(8, 'task1-7', '', 1),
    task(9, 'task1-8', '', 1),
    task(10, 'task1-9', '', 1),
    task(11, 'task1-10', '', 1),
    task(12, 'task1-11', '', 1),
    task(13, 'task1-12', '', 1),
    task(14, 'task2', ''),
    task(15, 'task2-1', '', 14),
    task(16, 'task2-2', '', 14),
    task(17, 'task2-3', '', 14),
    task(18, 'task2-4', '', 14),
    task(19, 'task2-5', '', 14),
    task(20, 'task2-6', '', 14),
    task(21, 'task2-7', '', 14),
    task(22, 'task2-8', '', 14),
    task(23, 'task1-5-1', '', 6),
    task(24, 'task1-5-2', '', 6),
    task(25, 'task1-5-3', '', 6),
    task(26, 'task1-5-4', '', 6),
    task(27, 'task1-5-5', '', 6),
    task(28, 'task1-5-6', '', 6),
    task(29, 'task1-5-7', '', 6),
    task(30, 'task1-5-8', '', 6)
  ]
});

function task(
  id: number,
  name: string,
  description: string,
  parentId?: number
) {
  const startedAt = new Date(
    Date.now() + DAY * 10 - DAY * Math.floor(Math.random() * 10)
  );
  return {
    id: String(id),
    startedAt: startedAt,
    finishedAt: new Date(
      startedAt.getTime() + DAY * Math.floor(Math.random() * 30)
    ),
    name: name,
    description: description,
    parentId: parentId ? String(parentId) : undefined
  };
}
