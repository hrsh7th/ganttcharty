import { createDraggable } from './Draggable';
import { createDroppable } from './Droppable';

export function create<T>() {
  const context = new DragDropContext<T>();
  return {
    Draggable: createDraggable(context),
    Droppable: createDroppable(context)
  };
}

export class DragDropContext<T> {
  public dragging = false;

  public x?: number;

  public y?: number;

  public payload?: T;

  public release() {
    this.dragging = false;
    this.x = undefined;
    this.y = undefined;
    this.payload = undefined;
  }
}
