import React from 'react';
import styled from 'styled-components';
import * as Action from '../../../../action';
import * as State from '../../../../state';
import { Droppable } from '../../dnd/task';

export type BodyRowProps = {
  row: State.Task.TaskNode;
  rowHeight: number;
  children: React.ReactNode;
};

export type BodyRowState = {
  droppable: boolean;
};

export default class BodyRow extends React.PureComponent<BodyRowProps, BodyRowState> {
  public state: BodyRowState = {
    droppable: false
  };

  public render() {
    return (
      <Droppable
        onDroppableEnter={this.onDroppableEnter}
        onDroppableLeave={this.onDroppableLeave}
        onDrop={this.onDrop}
      >
        <Self rowHeight={this.props.rowHeight} onClick={this.onClick}>
          {this.state.droppable && (
            <>
              <PrevDropArea data-dir="prev" />
              <NextDropArea data-dir="next" full={this.isParent()} />
              {!this.isParent() ? (
                <NextToChildDropArea data-dir="next-to-child" />
              ) : null}
            </>
          )}
          {this.props.children}
        </Self>
      </Droppable>
    );
  }

  private isParent = () => {
    return !!this.props.row.children.length || !!this.props.row.collapsed;
  };

  private onDroppableEnter = () => {
    this.setState({
      droppable: true
    });
  };

  private onDroppableLeave = () => {
    this.setState({
      droppable: false
    });
  };

  private onDrop = (
    e: React.MouseEvent<HTMLElement>,
    payload: State.Task.TaskNode
  ) => {
    this.setState(
      {
        droppable: false
      },
      () => {
        const dir = (e.target as any).getAttribute('data-dir');
        if (dir === 'next') {
          Action.Task.insertNext(this.props.row.id, payload.id);
        } else if (dir === 'next-to-child') {
          Action.Task.insertNext(this.props.row.id, payload.id, true);
        } else {
          Action.Task.insertPrev(this.props.row.id, payload.id);
        }
        Action.UI.select(payload.id);
      }
    );
  };

  private onClick = () => {
    if (this.state.droppable) return;
    // Patch for avoid conflicting click outside.
    requestAnimationFrame(() => {
      Action.UI.select(this.props.row.id);
    });
  };
}

const Self = styled.div<{ rowHeight: number }>`
  position: relative;
  display: flex;
  height: ${props => props.rowHeight}px;
`;

const PrevDropArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, #ddd 0, transparent 100%);
  z-index: 2;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;

const NextDropArea = styled.div<{ full: boolean }>`
  position: absolute;
  left: 0;
  right: ${props => (props.full ? '0' : '30%')};
  bottom: 0;
  height: 50%;
  background: linear-gradient(180deg, #ddd 0, transparent 100%);
  transform: rotate(180deg);
  z-index: 2;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;

const NextToChildDropArea = styled.div`
  position: absolute;
  left: 70%;
  right: 0;
  bottom: 0;
  height: 50%;
  background: linear-gradient(180deg, #ddd 0, transparent 100%);
  transform: rotate(180deg);
  z-index: 2;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;
