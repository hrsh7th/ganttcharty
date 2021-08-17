import React, { useCallback } from 'react';
import styled from 'styled-components';
import * as State from '../../../state';
import { Grid } from '../../ui-kit/grid';
import { BodyRow, BodyCell } from './body';
import { Diff } from '../../ui-kit/movable';

export type Props = {
  onMoving: (e: MouseEvent, diff: Diff) => void;
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
};

const C = React.forwardRef(
  ({ onMoving, onWheel }: Props, ref: any) => {
    const state = State.use(s => ({
      headerWidth: s.option.headerWidth,
      columns: s.option.columns,
      tasks: s.tasks
    }));
    return (
      <Self headerWidth={state.headerWidth}>
        <Grid<State.Task.TaskNode>
          keyName="id"
          columns={state.columns}
          rows={State.Task.tasks(state.tasks)}
          Box={useCallback(props => {
            const state = State.use(s => ({
              viewportHeight: s.ui.viewportHeight
            }))
            return (
              <Box height={state.viewportHeight}>{props.children}</Box>
            )
          }, [])}
          header={{
            HeaderBox: useCallback(props => {
              const state = State.use(s => ({
                axisHeight: s.option.axisHeight
              }))
              return (
                <HeaderBox height={state.axisHeight}>
                  {props.children}
                </HeaderBox>
              )
            }, []),
            HeaderRow: useCallback(props => {
              const state = State.use(s => ({
                axisHeight: s.option.axisHeight
              }))
              return (
                <HeaderRow height={state.axisHeight}>
                  {props.children}
                </HeaderRow>
              )
            }, []),
            HeaderCell: useCallback(props => {
              const state = State.use(s => ({
                axisHeight: s.option.axisHeight
              }))
              return (
                <HeaderCell
                  width={props.column.width}
                  height={state.axisHeight}
                >
                  {props.column.name}
                </HeaderCell>
              )
            }, [])
          }}
          body={{
            BodyBox: useCallback(props => {
              const state = State.use(s => ({
                viewportHeight: s.ui.viewportHeight,
                axisHeight: s.option.axisHeight
              }))
              return (
                <Box height={state.viewportHeight - state.axisHeight}>
                  {props.children}
                </Box>
              )
            }, []),
            BodyRow: useCallback(props => {
              const state = State.use(s => ({
                rowHeight: s.option.rowHeight
              }))
              return (
                <BodyRow rowHeight={state.rowHeight} row={props.row}>
                  {props.children}
                </BodyRow>
              )
            }, []),
            BodyCell: useCallback(props => {
              const state = State.use(s => ({
                selectedTaskId: s.ui.selectedTaskId,
                indentWidth: s.option.indentWidth,
                rowHeight: s.option.rowHeight,
              }))
              return (
                <BodyCell
                  row={props.row}
                  selected={props.row.id === state.selectedTaskId}
                  column={props.column}
                  indentWidth={state.indentWidth}
                  rowHeight={state.rowHeight}
                />
              )
            }, [])
          }}
          forwardedRef={ref}
          onMoving={onMoving}
          onWheel={onWheel}
        />
      </Self>
    );
  }
);
export const HeaderArea = React.memo(C as any);

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
