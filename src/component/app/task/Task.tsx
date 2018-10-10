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

const Task = styled.div<Props>`
  height: ${props => props.height}px;
  display: flex;
  align-items: center;
`;

const BAR_MARGIN = 3;
const TaskLine = styled.div<Props>`
  position: relative;
  padding: 0 4px;
  height: ${props => props.height - (BAR_MARGIN * 2)}px;
  line-height: ${props => props.height - (BAR_MARGIN * 2)}px;
  font-size: 10px;
  border-radius: 3px;
  background: ${props => props.selectedTaskId === props.node.task.id ? '#484' : '#448'};
  color: #fff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

const TaskLabel = styled.div`
  pointer-events: none;
`;

const HandleNext = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  z-index: 1;
  pointer: cursor;

  ::before {
    content: '>>';
  }
`;

const HandlePrev = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  z-index: 1;
  pointer: cursor;

  ::before {
    content: '<<';
  }
`;
