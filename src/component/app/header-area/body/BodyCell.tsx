import React from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';
import * as Action from '../../../../action';
import * as State from '../../../../state';
import { InlineEdit } from '../../../ui-kit/inline-edit';
import { Draggable } from '../../dnd/task';

export type Props = {
  row: State.Task.TaskNode;
  selected: boolean;
  column: State.Option.Column;
  indentWidth: number;
  rowHeight: number;
};

export default class BodyCell extends React.PureComponent<Props> {
  public render() {
    return (
      <Self
        width={this.props.column.width}
        height={this.props.rowHeight}
        selected={this.props.selected}
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
      </Self>
    );
  }

  private startedAt() {
    return (
      <InlineEdit
        value={this.props.row.startedAt}
        format="yyyy/MM/dd"
        onChange={this.onInlineChange}
      />
    );
  }

  private finishedAt() {
    return (
      <InlineEdit
        value={this.props.row.finishedAt}
        format="yyyy/MM/dd"
        onChange={this.onInlineChange}
      />
    );
  }

  private name() {
    return (
      <>
        <Draggable
          payload={this.props.row}
          preview={() => <BodyCell {...this.props} />}
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

  private onExpandClick = () => {
    const task = State.Task.get(State.get()!.tasks, this.props.row.id)!;
    if (task.collapsed) {
      Action.Task.expand(task.id);
    } else {
      Action.Task.collapse(task.id);
    }
  };

  private onInlineChange = (value: any) => {
    Action.Task.update(this.props.row.id, {
      [this.props.column.key]: value
    });
  };
}

const Self = styled.div<{
  width: number;
  height: number;
  selected: boolean;
}>`
  position: relative;
  padding: 0 8px;
  display: flex;
  align-items: center;
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  font-size: 8px; /* TODO */
  background: ${props => (props.selected ? '#dfd' : '#fff')};

  & + & {
    border-left: none;
  }
`;

const DragHandle = styled.div`
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
  height: 100%;
  vertical-align: top;
`;
