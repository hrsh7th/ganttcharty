import React from 'react';
import styled from 'styled-components';
import ScrollIntoView from 'react-scroll-into-view-if-needed';
import enhanceWithClickOutside from 'react-click-outside';
import * as Action from '../../../action';
import * as State from '../../../state';

export type Props = {
  node: State.Task.TaskTreeNode;
  option: State.Option.Option;
  selectedTaskId?: State.Task.TaskId;
};

export default enhanceWithClickOutside(
  class Node extends React.Component<Props> {

    public render() {
      return (
        <Header {...this.props}>
          <ScrollIntoView active={this.props.selectedTaskId === this.props.node.task.id}>
            <HeaderNode {...this.props} onClick={this.onClick}>
              {this.props.node.task.name}
            </HeaderNode>
          </ScrollIntoView>

          {this.props.node.children.length && !this.props.node.task.collapsed ? (
            <HeaderChildren {...this.props}>
              {this.props.node.children.map(node => <Node key={node.task.id} {...{ ...this.props, node}} />)}
            </HeaderChildren>
          ) : null}
        </Header>
      );
    }

    public onClick = () => {
      Action.Task.selectTask(this.props.node.task.id);
    };

    public handleClickOutside() {
      Action.Task.selectTask(undefined);
    }
  }
);

const Header = styled.div<Props>`
`;

const HeaderNode = styled.div<Props>`
  padding: 0 8px;
  height: ${props => props.option.rowHeight}px;
  line-height: ${props => props.option.rowHeight}px;
  font-size: 10px;
  white-space: nowrap;
  outline: ${props => props.selectedTaskId === props.node.task.id ? 'auto' : 'none'};
`;

const HeaderChildren = styled.div<Props>`
  margin-left: ${props => props.option.indentWidth}px;
`;

