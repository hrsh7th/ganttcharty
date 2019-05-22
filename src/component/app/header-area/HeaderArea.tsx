import React from 'react';
import styled from 'styled-components';
import * as State from '../../../state';
import { Grid } from '../../ui-kit/grid';
import { BodyRow, BodyCell } from './body';
import { Diff } from '../../ui-kit/movable';

const Consumer = State.select(state => ({
  viewportHeight: state.ui.viewportHeight,
  selectedTaskId: state.ui.selectedTaskId,
  axisHeight: state.option.axisHeight,
  headerWidth: state.option.headerWidth,
  rowHeight: state.option.rowHeight,
  indentWidth: state.option.indentWidth,
  columns: state.option.columns,
  tasks: state.tasks
}));

export type Props = {
  onMoving: (e: MouseEvent, diff: Diff) => void;
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
};

export const HeaderArea = React.forwardRef(
  ({ onMoving, onWheel }: Props, ref: any) => (
    <Consumer>
      {state => (
        <Self headerWidth={state.headerWidth}>
          <Grid<State.Task.TaskNode>
            keyName="id"
            columns={state.columns}
            rows={State.Task.tasks(state.tasks)}
            Box={props => (
              <Box height={state.viewportHeight}>{props.children}</Box>
            )}
            header={{
              HeaderBox: props => (
                <HeaderBox height={state.axisHeight}>
                  {props.children}
                </HeaderBox>
              ),
              HeaderRow: props => (
                <HeaderRow height={state.axisHeight}>
                  {props.children}
                </HeaderRow>
              ),
              HeaderCell: props => (
                <HeaderCell
                  width={props.column.width}
                  height={state.axisHeight}
                >
                  {props.column.name}
                </HeaderCell>
              )
            }}
            body={{
              BodyBox: props => (
                <Box height={state.viewportHeight - state.axisHeight}>
                  {props.children}
                </Box>
              ),
              BodyRow: props => (
                <BodyRow rowHeight={state.rowHeight} row={props.row}>
                  {props.children}
                </BodyRow>
              ),
              BodyCell: props => (
                <BodyCell
                  row={props.row}
                  selected={props.row.id === state.selectedTaskId}
                  column={props.column}
                  indentWidth={state.indentWidth}
                  rowHeight={state.rowHeight}
                />
              )
            }}
            forwardedRef={ref}
            onMoving={onMoving}
            onWheel={onWheel}
          />
        </Self>
      )}
    </Consumer>
  )
);

const Self = styled.div<{ headerWidth: number }>`
  width: ${props => props.headerWidth}px;
  height: 100%;
  z-index: 2;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.26);
`;

const Box = styled.div<{ height: string | number }>`
  min-width: 100%;
  height: ${props =>
    typeof props.height === 'number' ? `${props.height}px` : props.height};
  overflow: hidden;
`;

const HeaderBox = styled(Box)`
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.26);
`;

const HeaderRow = styled.div<{ height: number }>`
  display: flex;
  height: ${props => props.height}px;
`;

const HeaderCell = styled.div<{ width: number; height: number }>`
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;

  & + & {
    border-left: none;
  }
`;
