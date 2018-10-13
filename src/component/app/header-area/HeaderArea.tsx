import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import * as State from '../../../state';
import { Grid, Column } from '../../ui-kit/grid/Grid';

const Consumer = State.select(state => ({
  viewportHeight: state.ui.viewportHeight,
  axisHeight: state.option.axisHeight,
  headerWidth: state.option.headerWidth,
  rowHeight: state.option.rowHeight,
  columns: state.option.columns,
  tasks: state.tasks
}));

export type Props = {
  innerRef: React.RefObject<HTMLDivElement>;
  onWheel: React.WheelEventHandler;
};

export default ({ innerRef, onWheel }: Props) => (
  <Consumer>
    {state => (
      <HeaderArea {...state}>
        <Grid<State.Task.TaskNode>
          keyName="id"
          columns={state.columns}
          rows={State.Task.tasks(state.tasks)}
          Box={GridBox.extend.attrs(state)``}
          header={{
            Box: HeaderBox.extend.attrs(state)``,
            Row: HeaderRow.extend.attrs(state)``,
            Cell: props => <HeaderCell {...state} {...props}>{props.column.name}</HeaderCell>
          }}
          body={{
            Box: BodyBox.extend.attrs(state)``,
            ScrollArea: ScrollArea.extend.attrs(state)``,
            Row: BodyRow.extend.attrs(state)``,
            Cell: props => (
              <BodyCell {...state} {...props}>{(() => {
                switch (props.column.key) {
                  case 'startedAt':
                  case 'finishedAt':
                    return format(props.row[props.column.key], 'YYYY/MM/DD');
                  default:
                    return props.row[props.column.key];
                }
              })()}</BodyCell>
            )
          }}
          innerRef={innerRef}
          onWheel={onWheel}
        />
      </HeaderArea>
    )}
  </Consumer>
);

const HeaderArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.headerWidth}px;
  height: 100%;
`;

const GridBox = styled.div<State.Select<typeof Consumer>>`
  width; 100%;
  height: 100%;
  overflow: hidden;
`;

const HeaderBox = styled.div<State.Select<typeof Consumer>>`
  height: ${props => props.axisHeight}px;
`;

const HeaderRow = styled.div<State.Select<typeof Consumer>>`
  height: ${props => props.axisHeight}px;
  display: flex;
`;

const HeaderCell = styled.div<State.Select<typeof Consumer> & { column: Column<State.Task.TaskNode>; }>`
  min-width: ${props => props.column.width}px;
`;

const BodyBox = styled.div<State.Select<typeof Consumer>>`
  height: ${props => props.viewportHeight - props.axisHeight}px;
  overflow: hidden;
`;

const ScrollArea = styled.div<State.Select<typeof Consumer>>`
  min-height: 100%;
`;

const BodyRow = styled.div<State.Select<typeof Consumer>>`
  height: ${props => props.rowHeight}px;
  display: flex;
`;

const BodyCell = styled.div<State.Select<typeof Consumer> & { column: Column<State.Task.TaskNode>; row: State.Task.TaskNode; }>`
  min-width: ${props => props.column.width}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

