import React from 'react';
import Preview from './Preview';

export type Props = {
  preview: () => React.ReactNode;
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
        {this.state.isDragging ? (
          <Preview x={this.state.x!} y={this.state.y!} preview={this.props.preview!} />
        ) : null}
        {children}
      </>
    );
  }

  private onMouseDown = () => {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = (e: MouseEvent) => {
    this.setState({
      isDragging: true as true,
      x: e.clientX,
      y: e.clientY
    });
  };

  private onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.setState({ isDragging: false });
  };

}

