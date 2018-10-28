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
  task: Task;
  parent?: Task;
  children: TaskNode[];
  depth: number;
};

/**
 * create tasks.
 */
export const tasks = (allTasks: Task[]) => {
  return (function traverse(
    tasks: Task[],
    parentId?: TaskId,
    depth: number = 0
  ): TaskNode[] {
    const parent = get(tasks, parentId);
    return allTasks.filter(task => task.parentId === parentId).reduce(
      (nodes, task) => {
        const children = !task.collapsed
          ? traverse(allTasks, task.id, depth + 1)
          : [];

        return nodes
          .concat([
            {
              ...task,
              task,
              parent,
              startedAt: startedAt(allTasks, task.id),
              finishedAt: finishedAt(allTasks, task.id),
              children,
              depth
            }
          ])
          .concat(children);
      },
      [] as TaskNode[]
    );
  })(allTasks, undefined);
};

/**
 * get task by id.
 */
export const get = (tasks: Task[], taskId?: TaskId) => {
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
  const target = get(tasks, taskId)!;
  if (target && (target.collapsed && checkExpanded)) {
    return [];
  }
  return tasks.filter(task => task.parentId === taskId);
};

/**
 * startedAt.
 */
export const startedAt = (tasks: Task[], taskId: TaskId) => {
  const children = getChildren(tasks, taskId, false).sort((a, b) => {
    return startedAt(tasks, a.id).getTime() - startedAt(tasks, b.id).getTime();
  });
  if (children.length) {
    return children[0].startedAt;
  }

  return get(tasks, taskId)!.startedAt;
};

/**
 * finishedAt.
 */
export const finishedAt = (tasks: Task[], taskId: TaskId) => {
  const children = getChildren(tasks, taskId, false).sort((a, b) => {
    return (
      finishedAt(tasks, b.id).getTime() - finishedAt(tasks, a.id).getTime()
    );
  });
  if (children.length) {
    return children[0].finishedAt;
  }

  return get(tasks, taskId)!.finishedAt;
};

/**
 * get siblings by id.
 */
export const getSiblings = (tasks: Task[], taskId: TaskId) => {
  const target = get(tasks, taskId)!;
  const parent = get(tasks, target.parentId);
  return getChildren(tasks, parent ? parent.id : undefined);
};

/**
 * get siblings prev by id.
 */
export const getSiblingPrev = (tasks: Task[], taskId: TaskId): Task | null => {
  const target = get(tasks, taskId)!;
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
  const target = get(tasks, taskId)!;
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

  const target = get(tasks, taskId)!;
  const parent = get(tasks, target.parentId);
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

  const target = get(tasks, taskId)!;
  const parent = get(tasks, target.parentId);
  if (parent) {
    const next = getSiblingNext(tasks, parent.id);
    if (next) {
      return next;
    }
  }
  return null;
};

export const defaults = (tasks: any[]) => {
  return tasks
    .map(task => {
      task.startedAt = startOfDay(task.startedAt);
      task.finishedAt = startOfDay(task.finishedAt);
      return task;
    })
    .sort(
      (a, b) => (a as any).startedAt.getTime() - (b as any).startedAt.getTime()
    );
};
