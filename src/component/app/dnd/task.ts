import * as State from '../../../state';
import { create } from '../../ui-kit/dnd';

export const { Draggable, Droppable } = create<State.Task.Task>();
