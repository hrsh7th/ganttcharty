import React from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';
import * as Action from '../../../../action';
import * as State from '../../../../state';
import InlineEdit from '../../../ui-kit/inline-edit';
import { Draggable, Droppable } from '../../dnd/task';

export type Props = {
  row: State.Task.TaskNode;
  column: State.Option.Column;
  indentWidth: number;
  rowHeight: number;
};

export type State = {
  droppable?: {
    y: number;
  };
};

export default class Self extends React.Component<Props, State> {
  public state: State = {};

  public render() {
    return (
      <Droppable
        onDroppableEnter={this.onDroppableEnter}
        onDroppableLeave={this.onDroppableLeave}
        onDrop={this.onDrop}
      >
        <Task
          width={this.props.column.width}
          height={this.props.rowHeight}
          isDroppable={!!this.state.droppable}
          onClick={this.onTaskClick}
        >
          {(() => {
            switch (this.props.column.key) {
              case 'startedAt':
                return this.startedAt();
              case 'finishedAt':
                return this.finishedAt();
              case 'name':
                return this.name();
            }
            return null;
          })()}
        </Task>
      </Droppable>
    );
  }

  private startedAt() {
    return (
      <InlineEdit
        value={this.props.row.startedAt}
        format="YYYY/MM/DD"
        onChange={this.onInlineChange}
      />
    );
  }

  private finishedAt() {
    return (
      <InlineEdit
        value={this.props.row.finishedAt}
        format="YYYY/MM/DD"
        onChange={this.onInlineChange}
      />
    );
  }

  private name() {
    return (
      <>
        <Draggable
          payload={this.props.row}
          preview={() => <Self {...this.props} />}
        >
          <DragHandle />
        </Draggable>
        {this.isParent() ? (
          <Expander
            indentWidth={this.props.indentWidth}
            rowHeight={this.props.rowHeight}
            depth={this.props.row.depth}
            onClick={this.onExpandClick}
          >
            {this.props.row.collapsed ? (
              <MdKeyboardArrowRight
                data-task-id={this.props.row.id}
                size="100%"
              />
            ) : (
              <MdKeyboardArrowDown
                data-task-id={this.props.row.id}
                size="100%"
              />
            )}
          </Expander>
        ) : (
          <Spacer
            indentWidth={this.props.indentWidth}
            rowHeight={this.props.rowHeight}
            depth={this.props.row.depth}
          />
        )}
        <InlineEdit
          value={this.props.row.name}
          onChange={this.onInlineChange}
        />
      </>
    );
  }

  private isParent() {
    return this.props.row.children.length || this.props.row.collapsed;
  }

  private onTaskClick = () => {
    Action.UI.selectTask(this.props.row.id);
  };

  private onExpandClick = () => {
    const task = State.Task.getTask(State.get()!.tasks, this.props.row.id)!;
    if (task.collapsed) {
      Action.Task.expand(task.id);
    } else {
      Action.Task.collapse(task.id);
    }
  };

  private onInlineChange = (value: any) => {
    Action.Task.updateTask(this.props.row.id, {
      [this.props.column.key]: value
    });
  };

  private onDroppableEnter = (_: React.MouseEvent<HTMLElement>) => {
    this.setState({
      droppable: {
        y: 0.8
      }
    });
  };

  private onDroppableLeave = (_: React.MouseEvent<HTMLElement>) => {
    this.setState({
      droppable: undefined
    });
  };

  private onDrop = (_: React.MouseEvent<HTMLElement>) => {
    this.setState({
      droppable: undefined
    });
  };
}

const Task = styled.div<{
  width: number;
  height: number;
  isDroppable: boolean;
}>`
  padding: 0 8px;
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  background: ${props => (props.isDroppable ? '#fdd' : '#fff')};
  font-size: 8px; /* TODO */

  & + & {
    border-left: none;
  }
`;

const DragHandle = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  vertical-align: top;
  width: 12px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  cursor: move;

  &::before {
    display: block;
    content: '';
    margin: 2px 0;
    border-top: 1px solid #ccc;
  }
`;

const Expander = styled.div<{
  indentWidth: number;
  rowHeight: number;
  depth: number;
}>`
  display: inline-block;
  vertical-align: bottom;
  margin-left: ${props => props.indentWidth * props.depth}px;
  width: ${props => props.rowHeight}px;
  height: 100%;
  padding: ${props => props.rowHeight * 0.2}px 0;
  color: #ccc;
  cursor: pointer;

  & * {
    margin-top: 1px;
  }
`;

const Spacer = styled.div<{
  indentWidth: number;
  rowHeight: number;
  depth: number;
}>`
  width: ${props => props.indentWidth * props.depth + props.rowHeight}px;
  display: inline-block;
  vertical-align: top;
`;
