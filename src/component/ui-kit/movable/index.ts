import React from 'react';
import ReactDOM from 'react-dom';
import closest from 'closest-element';

export type Diff = {
  x: number;
  y: number;
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
    document.addEventListener('mousemove', this.onMouseMove, { capture: true });
    document.addEventListener('mouseup', this.onMouseUp, { capture: true });
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMoving) {
      this.props.onMoving &&
        this.props.onMoving(e, {
          x: this.currentPosition.x - e.clientX,
          y: this.currentPosition.y - e.clientY
        });
    } else {
      this.isMoving = true;
      this.props.onMoveStart && this.props.onMoveStart(e);
    }

    this.currentPosition = {
      x: e.clientX,
      y: e.clientY
    };
  };

  private onMouseUp = (e: MouseEvent) => {
    this.isMoving = false;
    document.removeEventListener('mousemove', this.onMouseMove, {
      capture: true
    });
    document.removeEventListener('mouseup', this.onMouseUp, { capture: true });
    this.props.onMoveEnd &&
      this.props.onMoveEnd(e, {
        x: this.currentPosition.x - e.clientX,
        y: this.currentPosition.y - e.clientY
      });
  };
}
