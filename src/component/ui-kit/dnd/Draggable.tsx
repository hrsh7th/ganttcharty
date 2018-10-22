import React from 'react';
import Preview from './Preview';
import { DragDropContext } from './';

export type Props<T> = {
  onDragStart?: (e: MouseEvent) => void;
  onDragging?: (e: MouseEvent) => void;
  onDragEnd?: (e: MouseEvent) => void;
  children: React.ReactNode;
  preview?: () => React.ReactNode;
  payload?: T;
};

export type State = {
  dragging?: {
    x: number;
    y: number;
  };
};

export function createDraggable<T>(context: DragDropContext<T>) {
  return class Draggable extends React.Component<Props<T>, State> {
    public state: State = {};

    public render() {
      const kid = React.Children.only(this.props.children);
      return (
        <>
          {this.state.dragging && this.props.preview ? (
            <Preview
              x={this.state.dragging.x!}
              y={this.state.dragging.y!}
              preview={this.props.preview!}
            />
          ) : null}
          {React.cloneElement(kid, {
            onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
              kid.props.onMouseDown && kid.props.onMouseDown(e);
              this.onMouseDown(e);
            }
          })}
        </>
      );
    }

    private onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    };

    private onMouseMove = (e: MouseEvent) => {
      if (this.state.dragging) {
        this.setState({
          dragging: {
            x: e.clientX,
            y: e.clientY
          }
        });
        this.props.onDragging && this.props.onDragging(e);
        return;
      }

      context.dragging = true;
      context.payload = this.props.payload;
      this.setState({
        dragging: {
          x: e.clientX,
          y: e.clientY
        }
      });
      this.props.onDragStart && this.props.onDragStart(e);
    };

    private onMouseUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      context.release();
      this.setState({ dragging: undefined });
      this.props.onDragEnd && this.props.onDragEnd(e);
    };
  };
}
