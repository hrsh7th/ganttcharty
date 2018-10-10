import React from 'react';
import Preview from './Preview';

export type Props = {
  preview?: () => React.ReactNode;
  onDragStart?: (e: MouseEvent) => void;
  onDragging?: (e: MouseEvent) => void;
  onDragEnd?: (e: MouseEvent) => void;
  children: React.ReactNode;
};

export type State = {
  isDragging?: boolean;
  x?: number;
  y?: number;
};

export default class Draggable extends React.Component<Props, State> {

  public state: State = {};

  public render() {
    const children = React.cloneElement(React.Children.only(this.props.children), {
      ...this.props,
      onMouseDown: this.onMouseDown
    });
    return (
      <>
        {this.state.isDragging && this.props.preview ? (
          <Preview x={this.state.x!} y={this.state.y!} preview={this.props.preview!} />
        ) : null}
        {children}
      </>
    );
  }

  private onMouseDown = () => {
    document.body.addEventListener('mousemove', this.onMouseMove);
    document.body.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.state.isDragging) {
      this.onDragging(e);
      return;
    }

    this.setState({
      isDragging: true as true,
      x: e.clientX,
      y: e.clientY
    });
    this.onDragStart(e);
  };

  private onMouseUp = (e: MouseEvent) => {
    document.body.removeEventListener('mousemove', this.onMouseMove);
    document.body.removeEventListener('mouseup', this.onMouseUp);
    this.setState({ isDragging: false });
    this.onDragEnd(e);
  };

  private onDragStart = (e: MouseEvent) => {
    this.props.onDragStart && this.props.onDragStart(e);
  };

  private onDragging = (e: MouseEvent) => {
    this.props.onDragging && this.props.onDragging(e);
  };

  private onDragEnd = (e: MouseEvent) => {
    this.props.onDragEnd && this.props.onDragEnd(e);
  };

}

