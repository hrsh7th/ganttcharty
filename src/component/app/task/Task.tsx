import React from 'react';
import styled from 'styled-components';
import { Draggable } from '../../ui-kit/dnd'
import * as Action from '../../../action';
import * as State from '../../../state';

export type Props = {
  node: State.Task.TaskTreeNode;
  height: number;
  scale: State.Option.Scale;
  columnWidth: number;
  baseTime: Date;
  selectedTaskId?: State.Task.TaskId;
};

export type State = {
  dragging?: {
    date: {
      startedAt: Date;
      finishedAt: Date;
    };
    x: number;
    y: number;
  };
  startedAt?: Date;
  finishedAt?: Date;
};

export default class Node extends React.Component<Props, State> {

  public state: State = {};

  public render = () => {
    const startedAt = this.state.startedAt || this.props.node.task.startedAt;
    const finishedAt = this.state.finishedAt || this.props.node.task.finishedAt;
    return (
      <>
        <Task {...this.props} style={{
          transform: `translateX(${State.Task.x(this.props.scale, this.props.baseTime, this.props.columnWidth, startedAt)}px)`,
        }}>
          {/* This task */}
          <TaskLine title={this.props.node.task.name} {...this.props} style={{
             width: `${State.Task.width(this.props.scale, this.props.columnWidth, startedAt, finishedAt)}px`
          }}>
            <Draggable onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} onDragging={this.onDragPrev}>
              <HandlePrev />
            </Draggable>
            <TaskLabel>{this.props.node.task.name}</TaskLabel>
            <Draggable onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} onDragging={this.onDragNext}>
              <HandleNext />
            </Draggable>
          </TaskLine>
        </Task>

        {/* Children tasks */}
        {(this.props.node.children.length && !this.props.node.task.collapsed) ? (
          this.props.node.children.map(node => (
            <Node key={node.task.id} {...{ ...this.props, node }} />
          ))
        ) : null}
      </>
    );
  }

  private onDragStart = (e: MouseEvent) => {
    const { startedAt, finishedAt } = this.props.node.task;
    this.setState({
      ...this.state,
      dragging: {
        date: {
          startedAt,
          finishedAt
        },
        x: e.clientX,
        y: e.clientY
      }
    });
  };

  private onDragEnd = () => {
    Action.Task.updateTask(this.props.node.task.id, {
      startedAt: this.state.startedAt || this.props.node.task.startedAt,
      finishedAt: this.state.finishedAt || this.props.node.task.finishedAt
    });
    this.setState({ dragging: undefined, startedAt: undefined, finishedAt: undefined });
  };

  private onDragNext = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const finishedAt = this.state.dragging.date.finishedAt;
    const diffX = e.clientX - this.state.dragging.x;
    const nextTime = finishedAt.getTime() + Math.floor((diffX / columnWidth) * State.Option.scaleTime(scale));
    this.setState({
      finishedAt: State.Task.normalizeDate(scale, new Date(nextTime))
    });
  };

  private onDragPrev = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const startedAt = this.state.dragging.date.startedAt;
    const diffX = e.clientX - this.state.dragging.x;
    const nextTime = startedAt.getTime() + Math.floor((diffX / columnWidth) * State.Option.scaleTime(scale));
    this.setState({
      startedAt: State.Task.normalizeDate(scale, new Date(nextTime))
    });
  };

}

const BAR_MARGIN = 5;

const Task = styled.div<Props>`
  height: ${props => props.height}px;
  padding: ${BAR_MARGIN}px 0;
`;

const TaskLine = styled.div<Props>`
  position: relative;
  padding: 0 4px;
  height: 100%;
  line-height: ${props => props.height - (BAR_MARGIN * 2)}px;
  font-size: 8px;
  border-radius: 3px;
  background: ${props => props.selectedTaskId === props.node.task.id ? '#484' : '#448'};
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

  :hover {
    ${() => HandleNext}, ${() => HandlePrev} {
      display: block;
    }
  }
`;

const TaskLabel = styled.div`
  pointer-events: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #fff;
`;

const Handle = styled.div<{
  content: string;
  x: string;
  left: string;
}>`
  display: none;
  position: absolute;
  top: 50%;
  transform: translate(${props => props.x}, -50%);
  left: ${props => props.left};
  z-index: 1;
  cursor: pointer;
  ::before {
    content: '${props => props.content}';
    color: #000;
  }
`;

const HandleNext = Handle.extend.attrs({
  content: '>>',
  x: '0',
  left: '100%'
})``;

const HandlePrev = Handle.extend.attrs({
  content: '<<',
  x: '-100%',
  left: '0%'
})``;

