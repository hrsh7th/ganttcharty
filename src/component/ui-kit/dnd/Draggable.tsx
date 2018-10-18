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
    const {
      children,
      onDragging: _,
      onDragStart: __,
      onDragEnd: ___,
      ...props
    } = this.props;
    return (
      <>
        {this.state.isDragging && props.preview ? (
          <Preview
            x={this.state.x!}
            y={this.state.y!}
            preview={props.preview!}
          />
        ) : null}
        {React.cloneElement(React.Children.only(children), {
          ...props,
          onMouseDown: this.onMouseDown
        })}
      </>
    );
  }

  private onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.state.isDragging) {
      this.setState({
        x: e.clientX,
        y: e.clientY
      });
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
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
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
