import React from 'react';
import styled from 'styled-components';
import * as State from '../../../state';

export type Props = {
  node: State.Task.TaskTreeNode;
  option: State.Option.Option;
  selectedTaskId?: State.Task.TaskId;
};

export default class Node extends React.Component<Props> {

  public render = () => {
    return (
      <>
        <Task {...this.props} style={{
          transform: `translateX(${State.Task.x(this.props.option, this.props.node.task)}px)`,
          width: `${State.Task.width(this.props.option, this.props.node.task)}px`
        }}>
          <TaskLine title={this.props.node.task.name} {...this.props}>{this.props.node.task.name}</TaskLine>
        </Task>
        {(this.props.node.children.length && !this.props.node.task.collapsed) ? (
          this.props.node.children.map(node => (
            <Node key={node.task.id} {...{ ...this.props, node }} />
          ))
        ) : null}
      </>
    );
  }

}

const Task = styled.div<Props>`
  height: ${props => props.option.rowHeight}px;
  display: flex;
  align-items: center;
`;

const BAR_MARGIN = 3;
const TaskLine = styled.div<Props>`
  padding: 0 4px;
  height: ${props => props.option.rowHeight - (BAR_MARGIN * 2)}px;
  line-height: ${props => props.option.rowHeight - (BAR_MARGIN * 2)}px;
  font-size: 10px;
  border-radius: 3px;
  background: ${props => props.selectedTaskId === props.node.task.id ? '#484' : '#448'};
  color: #fff;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

