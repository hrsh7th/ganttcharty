import React from 'react';
import styled from 'styled-components';
import * as Action from '../../../../action';
import * as State from '../../../../state';
import { Droppable } from '../../dnd/task';

export type Props = {
  row: State.Task.TaskNode;
  rowHeight: number;
  children: React.ReactNode;
};

export type State = {
  droppable: boolean;
};

export default class BodyRow extends React.Component<Props, State> {
  public state: State = {
    droppable: false
  };

  public render() {
    return (
      <Droppable
        onDroppableEnter={this.onDroppableEnter}
        onDroppableLeave={this.onDroppableLeave}
        onDrop={this.onDrop}
      >
        <Self rowHeight={this.props.rowHeight}>
          {this.state.droppable && (
            <>
              <PrevDropArea data-dir="prev" />
              <NextDropArea data-dir="next" />
            </>
          )}
          {this.props.children}
        </Self>
      </Droppable>
    );
  }

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
        console.log(dir);
        if (dir === 'next') {
          Action.Task.insertNext(this.props.row.id, payload.id);
        } else {
          Action.Task.insertPrev(this.props.row.id, payload.id);
        }
      }
    );
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
  width: 100%;
  height: 50%;
  background: linear-gradient(180deg, #ddd 0, transparent 100%);
  z-index: 2;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;

const NextDropArea = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(180deg, #ddd 0, transparent 100%);
  transform: rotate(180deg);
  z-index: 2;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;
