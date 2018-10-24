import React from 'react';
import styled from 'styled-components';
import startOfDay from 'date-fns/start_of_day';
import * as Action from '../../../../action';
import * as State from '../../../../state';
import { Movable } from '../../../ui-kit/movable';

export type Props = {
  node: State.Task.TaskNode;
  rowHeight: number;
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
  };
};

export class Task extends React.PureComponent<Props, State> {
  public state: State = {};

  public render = () => {
    const { node, baseTime, scale, columnWidth } = this.props;
    const startedAt =
      (this.state.dragging && this.state.dragging.startedAt) || node.startedAt;
    const finishedAt =
      (this.state.dragging && this.state.dragging.finishedAt) ||
      node.finishedAt;

    return (
      <Self
        {...this.props}
        onClick={this.onClick}
        style={{
          transform: `translateX(${State.UI.x(
            startedAt,
            baseTime,
            scale,
            columnWidth
          )}px)`,
          width: `${State.UI.width(
            startedAt,
            finishedAt,
            scale,
            columnWidth
          )}px`
        }}
      >
        <TaskLabel rowHeight={this.props.rowHeight}>
          {this.props.node.name}
        </TaskLabel>
        <Movable
          onMoveStart={this.onMoveStart}
          onMoveEnd={this.onMoveEnd}
          onMoving={this.onMovePrev}
        >
          <HandlePrev />
        </Movable>
        <Movable
          onMoveStart={this.onMoveStart}
          onMoveEnd={this.onMoveEnd}
          onMoving={this.onMoveSelf}
        >
          <TaskLine title={this.props.node.name} {...this.props} />
        </Movable>
        <Movable
          onMoveStart={this.onMoveStart}
          onMoveEnd={this.onMoveEnd}
          onMoving={this.onMoveNext}
        >
          <HandleNext />
        </Movable>
      </Self>
    );
  };

  /**
   * click task.
   */
  private onClick = () => {
    Action.UI.select(this.props.node.id);
  };

  /**
   * start drag.
   */
  private onMoveStart = (e: MouseEvent) => {
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
  private onMoveEnd = () => {
    if (!this.state.dragging) return;

    Action.Task.update(this.props.node.id, {
      startedAt: this.state.dragging.startedAt || this.props.node.startedAt,
      finishedAt: this.state.dragging.finishedAt || this.props.node.finishedAt
    });
    this.setState({ dragging: undefined });
  };

  /**
   * drag self.
   */
  private onMoveSelf = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const { startedAt, finishedAt } = this.props.node;
    const diffX = e.clientX - this.state.dragging.x;
    const startedAtDiff = State.UI.x2time(diffX, columnWidth, scale);
    const finishedAtDiff = State.UI.x2time(diffX, columnWidth, scale);
    this.setState({
      dragging: {
        ...this.state.dragging,
        startedAt: startOfDay(startedAt.getTime() + startedAtDiff),
        finishedAt: startOfDay(finishedAt.getTime() + finishedAtDiff)
      }
    });
  };

  /**
   * drag finishedAt.
   */
  private onMoveNext = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const finishedAt = this.props.node.finishedAt;
    const diffX = e.clientX - this.state.dragging.x;
    const diffTime = State.UI.x2time(diffX, columnWidth, scale);
    this.setState({
      dragging: {
        ...this.state.dragging,
        finishedAt: startOfDay(finishedAt.getTime() + diffTime)
      }
    });
  };

  /**
   * drag startedAt.
   */
  private onMovePrev = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const startedAt = this.props.node.startedAt;
    const diffX = e.clientX - this.state.dragging.x;
    const diffTime = State.UI.x2time(diffX, columnWidth, scale);
    this.setState({
      dragging: {
        ...this.state.dragging,
        startedAt: startOfDay(startedAt.getTime() + diffTime)
      }
    });
  };
}

const Self = styled.div<{ rowHeight: number; barHeight: number }>`
  position: relative;
  height: ${props => props.rowHeight}px;
  padding: ${props => (props.rowHeight - props.barHeight) / 2}px 0;
`;

const TaskLine = styled.div<{
  selectedTaskId?: State.Task.TaskId;
  node: State.Task.TaskNode;
}>`
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: ${props =>
    props.selectedTaskId === props.node.id ? '#484' : '#448'};
  cursor: move;
`;

const TaskLabel = styled.div<{ rowHeight: number }>`
  position: absolute;
  top: 0;
  right: 100%;
  margin-right: 4px;
  line-height: ${props => props.rowHeight}px;
  white-space: nowrap;
  pointer-events: none;
`;

const Handle = styled.div<{
  x: string;
  left: string;
  cursor: 'w-resize' | 'e-resize';
}>`
  position: absolute;
  top: 0;
  left: ${props => props.left};
  width: 12px;
  height: 100%;
  transform: translateX(${props => props.x});
  cursor: ${props => props.cursor};
  z-index: 1;
`;

const HandleNext = styled(Handle).attrs({
  x: '-100%',
  left: '100%',
  cursor: 'e-resize'
})``;

const HandlePrev = styled(Handle).attrs({
  x: '0%',
  left: '0',
  cursor: 'w-resize'
})``;
