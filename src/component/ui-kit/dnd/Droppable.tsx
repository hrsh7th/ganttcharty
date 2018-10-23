import React from 'react';
import { DragDropContext } from './';

export type Props<T> = {
  onDroppableEnter: (e: React.MouseEvent<HTMLElement>, payload: T) => void;
  onDroppableLeave: (e: React.MouseEvent<HTMLElement>, payload: T) => void;
  onDrop: (e: React.MouseEvent<HTMLElement>, payload: T) => void;
  children: React.ReactNode;
};

export function createDroppable<T>(context: DragDropContext<T>) {
  return class Droppable extends React.Component<Props<T>> {
    public render() {
      const kid = React.Children.only(this.props.children);
      return React.cloneElement(kid, {
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
          kid.props.onMouseEnter && kid.props.onMouseEnter(e);
          this.onMouseEnter(e);
        },
        onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
          kid.props.onMouseLeave && kid.props.onMouseLeave(e);
          this.onMouseLeave(e);
        },
        onMouseUp: (e: React.MouseEvent<HTMLElement>) => {
          kid.props.onMouseUp && kid.props.onMouseUp(e);
          this.onMouseUp(e);
        }
      });
    }

    private onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
      if (context.dragging && context.payload) {
        this.props.onDroppableEnter(e, context.payload);
      }
    };

    private onMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
      if (context.dragging && context.payload) {
        this.props.onDroppableLeave(e, context.payload);
      }
    };

    private onMouseUp = (e: React.MouseEvent<HTMLElement>) => {
      e.persist();

      const payload = context.payload;
      if (context.dragging && payload) {
        requestAnimationFrame(() => {
          this.props.onDrop(e, payload);
        });
      }
    };
  };
}
