import React from 'react';
import styled from 'styled-components';
import * as Action from '../../../../action';
import * as State from '../../../../state';
import { Movable, Diff } from '../../../ui-kit/movable';

export type Props = {
  node: State.Task.TaskNode;
  rowHeight: number;
  scale: State.Option.Scale;
  barHeight: number;
  columnWidth: number;
  baseTime: Date;
  selected: boolean;
};

type State = {
  startedAt?: Date;
  finishedAt?: Date;
};

export class Task extends React.PureComponent<Props, State> {
  public state: State = {};

  public render = () => {
    const { baseTime, scale, columnWidth } = this.props;
    const isParent = !!this.props.node.children.length;
    const startedAt = this.props.node.startedAt;
    const finishedAt = this.props.node.finishedAt;

    return (
      <Self
        rowHeight={this.props.rowHeight}
        barHeight={this.props.barHeight}
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
        {/* HandlePrev */}
        {!isParent ? (
          <Movable
            onMoveStart={this.onMoveStart}
            onMoving={this.onMovingPrev}
            onMoveEnd={this.onMoveEnd}
          >
            <HandlePrev />
          </Movable>
        ) : null}

        {/* TaskLine */}
        <Movable
          onMoveStart={this.onMoveStart}
          onMoving={this.onMovingSelf}
          onMoveEnd={this.onMoveEnd}
        >
          <TaskLine
            selected={this.props.selected}
            childrenLength={this.props.node.children.length}
          />
        </Movable>

        {/* HandleNext */}
        {!isParent ? (
          <Movable
            onMoveStart={this.onMoveStart}
            onMoving={this.onMovingNext}
            onMoveEnd={this.onMoveEnd}
          >
            <HandleNext />
          </Movable>
        ) : null}

        {/* TaskLabel */}
        <TaskLabel
          rowHeight={this.props.rowHeight}
          barHeight={this.props.barHeight}
        >
          {this.props.node.name}
        </TaskLabel>
      </Self>
    );
  };

  private onMoveStart = () => {
    this.setState(() => ({
      startedAt: this.props.node.startedAt,
      finishedAt: this.props.node.finishedAt
    }));
  };

  private onMoveEnd = () => {
    this.setState(() => ({
      startedAt: undefined,
      finishedAt: undefined
    }));
  };

  private onMovingPrev = (_: MouseEvent, diff: Diff) => {
    if (!this.state.startedAt || !this.state.finishedAt) {
      return;
    }
    const { scale, columnWidth } = this.props;
    const startedAt = new Date(
      this.state.startedAt.getTime() +
        State.UI.x2time(diff.totalX, columnWidth, scale)
    );
    Action.Task.update(this.props.node.id, { startedAt });
  };

  private onMovingSelf = (_: MouseEvent, diff: Diff) => {
    if (!this.state.startedAt || !this.state.finishedAt) {
      return;
    }
    const { scale, columnWidth } = this.props;
    const startedAt = new Date(
      this.state.startedAt.getTime() +
        State.UI.x2time(diff.totalX, columnWidth, scale)
    );
    const finishedAt = new Date(
      this.state.finishedAt.getTime() +
        State.UI.x2time(diff.totalX, columnWidth, scale)
    );
    Action.Task.update(this.props.node.id, { startedAt, finishedAt });
  };

  private onMovingNext = (_: MouseEvent, diff: Diff) => {
    if (!this.state.startedAt || !this.state.finishedAt) {
      return;
    }
    const { scale, columnWidth } = this.props;
    const finishedAt = new Date(
      this.state.finishedAt.getTime() +
        State.UI.x2time(diff.totalX, columnWidth, scale)
    );
    Action.Task.update(this.props.node.id, { finishedAt });
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
  childrenLength: number;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  ${props =>
    props.childrenLength
      ? `
    border-bottom: 2px solid ${props.selected ? '#f88' : '#ddd'};
    background: rgba(0, 0, 0, 0.025);
  `
      : `
    border-radius: 2px;
    border: 1px solid ${props.selected ? '#f88' : '#ddd'};
    background: #448;
  `}
  user-select: none;
  cursor: move;
`;

const TaskLabel = styled.div<{ rowHeight: number; barHeight: number }>`
  position: absolute;
  top: 0;
  left: 8px;
  margin-right: 4px;
  line-height: ${props => props.rowHeight}px;
  white-space: nowrap;
  pointer-events: none;
  font-size: 10px;
  text-shadow: #000 1px 1px 0, #000 -1px -1px 0, #000 -1px 1px 0,
    #000 1px -1px 0, #000 0px 1px 0, #000 0-1px 0, #000 -1px 0 0, #000 1px 0 0;
  color: #f8f8f8;
  user-select: none;
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
