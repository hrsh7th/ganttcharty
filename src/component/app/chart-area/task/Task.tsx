import React from 'react';
import styled from 'styled-components';
import startOfDay from 'date-fns/start_of_day';
import { Draggable } from '../../../ui-kit/dnd'
import * as Action from '../../../../action';
import * as State from '../../../../state';

export type Props = {
  node: State.Task.TaskNode;
  height: number;
  scale: State.Option.Scale;
  barHeight: number;
  columnWidth: number;
  baseTime: Date;
  selectedTaskId?: State.Task.TaskId;
};

export type State = {
  dragging?: {
    x: number;
    y: number;
    startedAt: Date;
    finishedAt: Date;
  }
};

export default class Node extends React.Component<Props, State> {

  public state: State = {};

  public render = () => {
    const { node, baseTime, scale, columnWidth } = this.props;
    const startedAt = (this.state.dragging && this.state.dragging.startedAt) || node.startedAt;
    const finishedAt = (this.state.dragging && this.state.dragging.finishedAt) || node.finishedAt;

    return (
      <Task {...this.props} onClick={this.onClick} style={{
        transform: `translateX(${State.UI.x(startedAt, baseTime, scale, columnWidth)}px)`,
        width: `${State.UI.width(startedAt, finishedAt, scale, columnWidth)}px`
      }}>
        <TaskLabel {...this.props}>{this.props.node.name}</TaskLabel>
        <Draggable onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} onDragging={this.onDragPrev}><HandlePrev /></Draggable>
        <Draggable onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} onDragging={this.onDragSelf}>
          <TaskLine title={this.props.node.name} {...this.props}></TaskLine>
        </Draggable>
        <Draggable onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} onDragging={this.onDragNext}><HandleNext /></Draggable>
      </Task>
    );
  }

  /**
   * click task.
   */
  private onClick = () => {
    Action.UI.selectTask(this.props.node.id);
  };

  /**
   * start drag.
   */
  private onDragStart = (e: MouseEvent) => {
    const { startedAt, finishedAt } = this.props.node;
    this.setState({
      dragging: {
        startedAt,
        finishedAt,
        x: e.clientX,
        y: e.clientY
      }
    });
  };

  /**
   * end drag.
   */
  private onDragEnd = () => {
    if (!this.state.dragging) return;

    Action.Task.updateTask(this.props.node.id, {
      startedAt: this.state.dragging.startedAt || this.props.node.startedAt,
      finishedAt: this.state.dragging.finishedAt || this.props.node.finishedAt
    });
    this.setState({ dragging: undefined });
  };

  /**
   * drag self.
   */
  private onDragSelf = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const { startedAt, finishedAt } = this.props.node;
    const diffX = e.clientX - this.state.dragging.x;
    const nextStartedAt = startedAt.getTime() + Math.floor((diffX / columnWidth) * State.Option.scaleTime(scale));
    const nextFinishedAt = finishedAt.getTime() + Math.floor((diffX / columnWidth) * State.Option.scaleTime(scale));
    this.setState({
      dragging: {
        ...this.state.dragging,
        startedAt: startOfDay(nextStartedAt),
        finishedAt: startOfDay(nextFinishedAt)
      }
    });
  };

  /**
   * drag finishedAt.
   */
  private onDragNext = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const finishedAt = this.props.node.finishedAt;
    const diffX = e.clientX - this.state.dragging.x;
    const nextTime = finishedAt.getTime() + Math.floor((diffX / columnWidth) * State.Option.scaleTime(scale));
    this.setState({
      dragging: {
        ...this.state.dragging,
        finishedAt: startOfDay(nextTime)
      }
    });
  };

  /**
   * drag startedAt.
   */
  private onDragPrev = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const startedAt = this.props.node.startedAt;
    const diffX = e.clientX - this.state.dragging.x;
    const nextTime = startedAt.getTime() + Math.floor((diffX / columnWidth) * State.Option.scaleTime(scale));
    this.setState({
      dragging: {
        ...this.state.dragging,
        startedAt: startOfDay(nextTime)
      }
    });
  };

}

const Task = styled.div<Props>`
  position: relative;
  height: ${props => props.height}px;
  padding: ${props => (props.height - props.barHeight) / 2}px 0;
`;

const TaskLine = styled.div<Props>`
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: ${props => props.selectedTaskId === props.node.id ? '#484' : '#448'};
  cursor: move;
`;

const TaskLabel = styled.div<Props>`
  position: absolute;
  top: 0;
  right: 100%;
  margin-right: 4px;
  font-size: 8px;
  line-height: ${props => props.height}px;
  white-space: nowrap;
  pointer-events: none;
`;

const Handle = styled.div<{ x: string; left: string; cursor: 'w-resize' | 'e-resize'; }>`
  position: absolute;
  top: 0;
  left: ${props => props.left};
  width: 12px;
  height: 100%;
  transform: translateX(${props => props.x});
  cursor: ${props => props.cursor};
  z-index: 1;
`;

const HandleNext = styled(Handle).attrs({ x: '-100%', left: '100%', cursor: 'e-resize' })``;
const HandlePrev = styled(Handle).attrs({ x: '0%', left: '0', cursor: 'w-resize' })``;

