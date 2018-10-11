import React from 'react';
import styled from 'styled-components';
import ScrollIntoView from 'react-scroll-into-view-if-needed';
import enhanceWithClickOutside from 'react-click-outside';
import * as Action from '../../../action';
import * as State from '../../../state';

export type Props = {
  node: State.Task.TaskTreeNode;
  height: number;
  indentWidth: number;
  selectedTaskId?: State.Task.TaskId;
};

export default enhanceWithClickOutside(
  class Node extends React.Component<Props> {

    public render() {
      const node = this.props.node;
      return (
        <>
          <ScrollIntoView active={this.props.selectedTaskId === this.props.node.task.id}>
            <Header {...this.props} onClick={this.onClick}>
              {node.task.name}
            </Header>
          </ScrollIntoView>

          {node.children.length && !node.task.collapsed ? (
            <HeaderChildren {...this.props}>
              {node.children.map(node => <Node key={node.task.id} {...{ ...this.props, node}} />)}
            </HeaderChildren>
          ) : null}
        </>
      );
    }

    public onClick = () => {
      Action.UI.selectTask(this.props.node.task.id);
    };

    public handleClickOutside() {
      Action.UI.selectTask(undefined);
    }
  }
);

const Header = styled.div<Props>`
  padding: 0 8px;
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  font-size: 10px;
  white-space: nowrap;
  outline: ${props => props.selectedTaskId === props.node.task.id ? 'auto' : 'none'};
`;

const HeaderChildren = styled.div<Props>`
  margin-left: ${props => props.indentWidth}px;
`;

