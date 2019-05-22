import React from 'react';
import ReactDOM from 'react-dom';
import closest from 'closest-element';

export type Diff = {
  currentX: number;
  currentY: number;
  totalX: number;
  totalY: number;
};

export type MoveEventHandler = (e: MouseEvent, diff: Diff) => void;

export type Props = {
  onMoveStart?: (e: MouseEvent) => void;
  onMoving?: MoveEventHandler;
  onMoveEnd?: MoveEventHandler;
  children: React.ReactNode;
};

export class Movable extends React.PureComponent<Props> {
  private isMoving = false;
  private startPosition: { x: number; y: number } = {
    x: 0,
    y: 0
  };
  private currentPosition: { x: number; y: number } = {
    x: 0,
    y: 0
  };

  public render() {
    const kid = React.Children.only(this.props.children);
    return React.cloneElement(kid, {
      ...kid.props,
      'data-movable': true,
      onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
        kid.props.onMouseDown && kid.props.onMouseDown(e);
        this.onMouseDown(e);
      }
    });
  }

  private onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    // skip if self is not first ancestor of movables.
    if (
      ReactDOM.findDOMNode(this) !== closest(e.target as any, '[data-movable]')
    ) {
      return;
    }
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMoving) {
      this.props.onMoving &&
        this.props.onMoving(e, {
          currentX: e.clientX - this.currentPosition.x,
          currentY: e.clientY - this.currentPosition.y,
          totalX: e.clientX - this.startPosition.x,
          totalY: e.clientY - this.startPosition.y
        });
    } else {
      this.isMoving = true;
      this.startPosition = {
        x: e.clientX,
        y: e.clientY
      };
      this.props.onMoveStart && this.props.onMoveStart(e);
    }

    this.currentPosition = {
      x: e.clientX,
      y: e.clientY
    };
  };

  private onMouseUp = (e: MouseEvent) => {
    this.isMoving = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.props.onMoveEnd &&
      this.props.onMoveEnd(e, {
        currentX: e.clientX - this.currentPosition.x,
        currentY: e.clientY - this.currentPosition.y,
        totalX: e.clientX - this.startPosition.x,
        totalY: e.clientY - this.startPosition.y
      });
  };
}
