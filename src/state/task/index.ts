import memoize from 'memoize-one';
import * as State from '../';

/**
 * task types.
 */
export type TaskId = string | number;
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
export type TaskTreeNode = {
  task: Task;
  children: TaskTreeNode[];
};

/**
 * create task tree.
 */
export const getTree = memoize((tasks: Task[]) => {
  return (function traverse(
    tasks: Task[],
    parentId?: TaskId,
  ): TaskTreeNode[] {
    return tasks
      .filter(task => task.parentId === parentId)
      .map(task => {
        return {
          task: task,
          children: traverse(tasks, task.id)
        };
      });
  })(tasks);
});

/**
 * create view width.
 */
export const width = (
  scale: State.Option.Scale,
  columnWidth: number,
  startedAt: Date,
  finishedAt: Date
) => {
  return (finishedAt.getTime() - startedAt.getTime()) / State.Option.scaleTime(scale) * columnWidth;
};

/**
 * create view x.
 */
export const x = (
  scale: State.Option.Scale,
  baseTime: Date,
  columnWidth: number,
  startedAt: Date
) => {
  return Math.floor((
    startedAt.getTime() - baseTime.getTime()
  ) / State.Option.scaleTime(scale) * columnWidth);
};

/**
 * normalize date.
 */
export const normalizeDate = (scale: State.Option.Scale, date: Date) => {
  const time = date.getTime();
  return new Date(
    time - time % State.Option.scaleTime(scale)
  );
};

/**
 * get task by id.
 */
export const getTask = (tasks: Task[], taskId?: TaskId) => {
  return tasks.find(task => task.id === taskId);
};

/**
 * get children by id.
 */
export const getChildren = (tasks: Task[], taskId?: TaskId) => {
  const target = getTask(tasks, taskId)!;
  if (target && target.collapsed) {
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
  return tasks.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
};

