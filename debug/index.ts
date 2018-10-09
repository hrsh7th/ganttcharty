import { render } from '../src/index';

const DAY = 24 * 60 * 60 * 1000;

render('app', {
  option: {},
  tasks: [
    task( 1, 'ParentTask1', ''),
    task( 2, 'ChildTask1', '', 1),
    task( 3, 'ChildTask2', '', 1),
    task( 4, 'ChildTask3', '', 1),
    task( 5, 'ChildTask4', '', 1),
    task( 6, 'ChildTask5', '', 1),
    task( 7, 'ChildTask6', '', 1),
    task( 8, 'ChildTask7', '', 1),
    task( 9, 'ParentTask2', ''),
    task(10, 'ChildTask1', '', 9),
    task(11, 'ChildTask1', '', 9),
    task(12, 'ChildTask1', '', 9),
    task(13, 'ChildTask1', '', 9),
    task(14, 'ChildTask1', '', 9),
    task(15, 'ChildTask1', '', 9),
    task(16, 'ChildTask1', '', 9),
    task(17, 'ChildTask1', '', 9)
  ]
});

function task(id: number, name: string, description: string, parentId?: number) {
  const startedAt = new Date(Date.now() + (DAY * 10) - DAY * Math.floor(Math.random() * 10));
  return {
    id: id,
    startedAt: startedAt,
    finishedAt: new Date(startedAt.getTime() + DAY * Math.floor(Math.random() * 30)),
    name: name,
    description: description,
    parentId: parentId
  };
}

