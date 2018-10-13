import React from 'react';import styled from 'styled-components';
import format from 'date-fns/format';
import ScrollIntoView from 'react-scroll-into-view-if-needed';
import enhanceWithClickOutside from 'react-click-outside';
import * as Action from '../../../../action';
import * as State from '../../../../state';

export type Props = {
  node: State.Task.TaskNode;
  height: number;
  indentWidth: number;
  selectedTaskId?: State.Task.TaskId;
};

export default enhanceWithClickOutside(
  class Node extends React.Component<Props> {

    public render() {
      const node = this.props.node;
      return (
        <ScrollIntoView active={this.props.selectedTaskId === this.props.node.id}>
          <Header {...this.props} onClick={this.onClick}>
            <Column><Spacer {...this.props} />{node.name}</Column>
            <Column>{format(node.startedAt, 'YYYY/MM/DD')}</Column>
            <Column>{format(node.finishedAt, 'YYYY/MM/DD')}</Column>
          </Header>
        </ScrollIntoView>
      );
    }

    public onClick = () => {
      Action.UI.selectTask(this.props.node.id);
    };

    public handleClickOutside() {
      Action.UI.selectTask(undefined);
    }
  }
);

const Header = styled.div<Props>`
  display: flex;
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  font-size: 10px;
  white-space: nowrap;
  outline: ${props => props.selectedTaskId === props.node.id ? 'auto' : 'none'};
`;

const Spacer = styled.div<Props>`
  display: inline-block;
  vertical-align: top;
  padding-left: ${props => props.node.depth * props.indentWidth}px;
`;

const Column = styled.div`
  padding: 0 8px;
  overflow: hidden;
  min-width: 80px;
  white-space: nowrap;

  & + & {
    border-left: 1px solid #888;
  }
`;

