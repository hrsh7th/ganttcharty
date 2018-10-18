import memoize from 'memoize-one';
import startOfDay from 'date-fns/start_of_day';

/**
 * task types.
 */
export type TaskId = string;
export type Task = {
  id: TaskId;
  startedAt: Date;
  finishedAt: Date;
  name: string;
  description: string;
  parentId?: TaskId;
  collapsed?: boolean;
};

/**
 * task tree types.
 */
export type TaskNode = Task & {
  parent?: Task;
  children: TaskNode[];
  depth: number;
};

/**
 * create tasks.
 */
export const tasks = memoize((tasks: Task[]) => {
  return (function traverse(
    tasks: Task[],
    parentId?: TaskId,
    depth: number = 0
  ): TaskNode[] {
    const parent = getTask(tasks, parentId);
    return tasks.filter(task => task.parentId === parentId).reduce(
      (nodes, task) => {
        const children = !task.collapsed
          ? traverse(tasks, task.id, depth + 1)
          : [];
        return nodes
          .concat([
            {
              ...task,
              parent,
              children,
              depth
            }
          ])
          .concat(children);
      },
      [] as TaskNode[]
    );
  })(tasks);
});

/**
 * get task by id.
 */
export const getTask = (tasks: Task[], taskId?: TaskId) => {
  return tasks.find(task => String(task.id) === String(taskId));
};

/**
 * get children by id.
 */
export const getChildren = (
  tasks: Task[],
  taskId?: TaskId,
  checkExpanded: boolean = true
) => {
  const target = getTask(tasks, taskId)!;
  if (target && (target.collapsed && checkExpanded)) {
    return [];
  }
  return tasks.filter(task => task.parentId === taskId);
};

/**
 * get siblings by id.
 */
export const getSiblings = (tasks: Task[], taskId: TaskId) => {
  const target = getTask(tasks, taskId)!;
  const parent = getTask(tasks, target.parentId);
  return getChildren(tasks, parent ? parent.id : undefined);
};

/**
 * get siblings prev by id.
 */
export const getSiblingPrev = (tasks: Task[], taskId: TaskId): Task | null => {
  const target = getTask(tasks, taskId)!;
  const siblings = getSiblings(tasks, target.id);
  const index = siblings.indexOf(target);
  if (siblings[index - 1]) {
    return siblings[index - 1];
  }
  return null;
};

/**
 * get siblings next by id.
 */
export const getSiblingNext = (tasks: Task[], taskId: TaskId): Task | null => {
  const target = getTask(tasks, taskId)!;
  const siblings = getSiblings(tasks, target.id);
  const index = siblings.indexOf(target);
  if (siblings[index + 1]) {
    return siblings[index + 1];
  }
  return null;
};

/**
 * useful getting prev task by id.
 */
export const getPrev = (tasks: Task[], taskId: TaskId): Task | null => {
  const prev = getSiblingPrev(tasks, taskId);
  if (prev) {
    const children = getChildren(tasks, prev.id);
    if (children.length) {
      return children[children.length - 1];
    }
    return prev;
  }

  const target = getTask(tasks, taskId)!;
  const parent = getTask(tasks, target.parentId);
  if (parent) {
    return parent;
  }
  return null;
};

/**
 * useful getting next task by id.
 */
export const getNext = (tasks: Task[], taskId: TaskId): Task | null => {
  const children = getChildren(tasks, taskId);
  if (!!children.length) {
    return children[0];
  }

  const next = getSiblingNext(tasks, taskId);
  if (next) {
    return next;
  }

  const target = getTask(tasks, taskId)!;
  const parent = getTask(tasks, target.parentId);
  if (parent) {
    const next = getSiblingNext(tasks, parent.id);
    if (next) {
      return next;
    }
  }
  return null;
};

export const defaults = (tasks: Task[]) => {
  return tasks
    .sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime())
    .map(task => {
      task.startedAt = startOfDay(task.startedAt);
      task.finishedAt = startOfDay(task.finishedAt);
      return task;
    });
};
