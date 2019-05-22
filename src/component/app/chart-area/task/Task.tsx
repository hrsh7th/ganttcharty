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
  selected: boolean;
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
    const { baseTime, scale, columnWidth } = this.props;
    const isParent = !!this.props.node.children.length;
    const startedAt =
      (this.state.dragging && this.state.dragging.startedAt) ||
      this.props.node.startedAt;
    const finishedAt =
      (this.state.dragging && this.state.dragging.finishedAt) ||
      this.props.node.finishedAt;

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
        {!isParent ? (
          <Movable
            onMoveStart={this.onMoveStart}
            onMoveEnd={this.onMoveEnd}
            onMoving={this.onMovePrev}
          >
            <HandlePrev />
          </Movable>
        ) : null}
        <Movable
          onMoveStart={this.onMoveStart}
          onMoveEnd={this.onMoveEnd}
          onMoving={this.onMoveSelf}
        >
          <TaskLine
            title={this.props.node.name}
            isParent={isParent}
            {...this.props}
          />
        </Movable>
        {!isParent ? (
          <Movable
            onMoveStart={this.onMoveStart}
            onMoveEnd={this.onMoveEnd}
            onMoving={this.onMoveNext}
          >
            <HandleNext />
          </Movable>
        ) : null}
      </Self>
    );
  };

  private onMoveStart = (e: MouseEvent) => {
    this.setState({
      dragging: {
        startedAt: this.props.node.startedAt,
        finishedAt: this.props.node.finishedAt,
        x: e.clientX,
        y: e.clientY
      }
    });
  };

  private onMoveEnd = () => {
    if (!this.state.dragging) return;

    const { startedAt, finishedAt } = this.state.dragging;
    this.setState({ dragging: undefined }, () => {
      Action.Task.update(this.props.node.id, { startedAt, finishedAt });
    });
  };

  private onMoveSelf = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const diffX = e.clientX - this.state.dragging.x;
    this.setState({
      dragging: {
        ...this.state.dragging,
        startedAt: startOfDay(
          this.props.node.startedAt.getTime() +
            State.UI.x2time(diffX, columnWidth, scale)
        ),
        finishedAt: startOfDay(
          this.props.node.finishedAt.getTime() +
            State.UI.x2time(diffX, columnWidth, scale)
        )
      }
    });
  };

  private onMoveNext = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const diffX = e.clientX - this.state.dragging.x;
    this.setState({
      dragging: {
        ...this.state.dragging,
        finishedAt: startOfDay(
          this.props.node.finishedAt.getTime() +
            State.UI.x2time(diffX, columnWidth, scale)
        )
      }
    });
  };

  private onMovePrev = (e: MouseEvent) => {
    if (!this.state.dragging) return;

    const { scale, columnWidth } = this.props;
    const diffX = e.clientX - this.state.dragging.x;
    this.setState({
      dragging: {
        ...this.state.dragging,
        startedAt: startOfDay(
          this.props.node.startedAt.getTime() +
            State.UI.x2time(diffX, columnWidth, scale)
        )
      }
    });
  };

  private onClick = () => {
    Action.UI.select(this.props.node.id);
  };
}

const Self = styled.div<{ rowHeight: number; barHeight: number }>`
  position: relative;
  height: ${props => props.rowHeight}px;
  padding: ${props => (props.rowHeight - props.barHeight) / 2}px 0;
`;

const TaskLine = styled.div<{
  selected: boolean;
  node: State.Task.TaskNode;
  isParent: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  border: 1px solid #ddd;
  background: ${props =>
    props.selected ? '#484' : props.node.children.length ? '#fdd' : '#448'};
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
  width: 4px;
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
