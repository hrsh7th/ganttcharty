import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import ScrollIntoView from 'react-scroll-into-view-if-needed';
import enhanceWithClickOutside from 'react-click-outside';
import * as Action from '../../../../action';
import * as State from '../../../../state';

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
              <Column>{node.task.name}</Column>
              <Column>{format(node.task.startedAt, 'YYYY/MM/DD')}</Column>
              <Column>{format(node.task.finishedAt, 'YYYY/MM/DD')}</Column>
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
  display: flex;
  padding: 0 8px;
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  font-size: 10px;
  white-space: nowrap;
  outline: ${props => props.selectedTaskId === props.node.task.id ? 'auto' : 'none'};
`;

const Column = styled.div`
  overflow: hidden;
  min-width: 80px;
  white-space: nowrap;

  & + & {
    border-left: 1px solid #888;
  }
`;

const HeaderChildren = styled.div<Props>`
  & ${Header} {
    padding-left: ${props => props.indentWidth}px;
  }
`;

