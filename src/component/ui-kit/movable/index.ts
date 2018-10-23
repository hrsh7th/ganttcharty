import React from 'react';

export type Props = {
  onMoveStart?: (e: MouseEvent) => void;
  onMoving?: (e: MouseEvent) => void;
  onMoveEnd?: (e: MouseEvent) => void;
  children: React.ReactNode;
};

export class Movable extends React.Component<Props> {
  private isMoving = false;

  public render() {
    const kid = React.Children.only(this.props.children);
    return React.cloneElement(kid, {
      onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
        kid.props.onMouseDown && kid.props.onMouseDown(e);
        this.onMouseDown(e);
      }
    });
  }

  private onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMoving) {
      this.props.onMoving && this.props.onMoving(e);
      return;
    }

    this.isMoving = true;
    this.props.onMoveStart && this.props.onMoveStart(e);
  };

  private onMouseUp = (e: MouseEvent) => {
    this.isMoving = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.props.onMoveEnd && this.props.onMoveEnd(e);
  };
}
