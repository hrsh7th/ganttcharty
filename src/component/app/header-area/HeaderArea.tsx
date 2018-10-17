import React from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';
import * as Action from '../../../action';
import * as State from '../../../state';
import { Draggable } from '../../ui-kit/dnd';
import Grid from '../../ui-kit/grid';
import InlineEdit from '../../ui-kit/inline-edit';

const Consumer = State.select(state => ({
  viewportHeight: state.ui.viewportHeight,
  axisHeight: state.option.axisHeight,
  headerWidth: state.option.headerWidth,
  rowHeight: state.option.rowHeight,
  indentWidth: state.option.indentWidth,
  columns: state.option.columns,
  tasks: state.tasks
}));

export type Props = {
  onWheel: React.WheelEventHandler;
};

export default React.forwardRef(({ onWheel }: Props, ref: any) => (
  <Consumer>
    {state => (
      <HeaderArea headerWidth={state.headerWidth}>
        <Grid<State.Task.TaskNode>
          keyName="id"
          columns={state.columns}
          rows={State.Task.tasks(state.tasks)}
          Box={props => <Box height={state.viewportHeight}>{props.children}</Box>}
          header={{
            HeaderBox: props => <HeaderBox height={state.axisHeight}>{props.children}</HeaderBox>,
            HeaderRow: props => <HeaderRow height={state.axisHeight}>{props.children}</HeaderRow>,
            HeaderCell: props => <HeaderCell width={props.column.width} height={state.axisHeight}>{props.column.name}</HeaderCell>
          }}
          body={{
            BodyBox: props => <Box height={state.viewportHeight - state.axisHeight}>{props.children}</Box>,
            BodyRow: props => <BodyRow height={state.rowHeight}>{props.children}</BodyRow>,
            BodyCell: props => createBodyCell(props, state)
          }}
          forwardedRef={ref}
          onWheel={onWheel}
        />
      </HeaderArea>
    )}
  </Consumer>
));

const createBodyCell = (props: { row: State.Task.TaskNode; column: State.Option.Column; }, state: State.Select<typeof Consumer>) => {
  return (
    <BodyCell data-task-id={props.row.id} width={props.column.width} height={state.rowHeight} onClick={onTaskClick}>
      {(() => {
        const { row, column } = props;
        const onChange = (value: any) => Action.Task.updateTask(row.id, { [column.key]: value });
        switch (column.key) {
          case 'startedAt':
            return <InlineEdit value={row[column.key]} format={'YYYY/MM/DD'} onChange={onChange} />
          case 'finishedAt':
            return <InlineEdit value={row[column.key]} format={'YYYY/MM/DD'} onChange={onChange} />
          case 'name':
            return (
              <>
                <Draggable preview={() => createBodyCell(props, state)}>
                  <Handle />
                </Draggable>
                {row.children.length || row.collapsed ? (
                  <Expander indentWidth={state.indentWidth} rowHeight={state.rowHeight} depth={row.depth}>
                    {row.collapsed ? (
                      <MdKeyboardArrowRight data-task-id={row.id} size="100%" onClick={onExpandClick} />
                    ) : (
                      <MdKeyboardArrowDown data-task-id={row.id} size="100%" onClick={onExpandClick} />
                    )}
                  </Expander>
                ) : (
                  <Spacer
                    indentWidth={state.indentWidth}
                    rowHeight={state.rowHeight}
                    depth={row.depth}
                  />
                )}
                <InlineEdit value={row[column.key]} onChange={onChange} />
              </>
            );
          default:
            return null;
        }

        return null
      })()}
    </BodyCell>
  );
}

const onTaskClick = (e: React.MouseEvent<HTMLElement>) => {
  Action.UI.selectTask(e.currentTarget.getAttribute('data-task-id')!);
};

const onExpandClick = (e: React.MouseEvent<SVGElement>) => {
  const task = State.Task.getTask(State.get()!.tasks, e.currentTarget.getAttribute('data-task-id')!)!;
  if (task.collapsed) {
    Action.Task.expand(task.id);
  } else {
    Action.Task.collapse(task.id);
  }
};

const HeaderArea = styled.div<{ headerWidth: number; }>`
  width: ${props => props.headerWidth}px;
  height: 100%;
  z-index: 2;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.26);
`;

const Expander = styled.div<{ indentWidth: number; rowHeight: number; depth: number; }>`
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

const Spacer = styled.div<{ indentWidth: number; rowHeight: number; depth: number; }>`
  width: ${props => props.indentWidth * props.depth + props.rowHeight}px;
  display: inline-block;
  vertical-align: top;
`;

const Handle = styled.div`
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

const Box = styled.div<{ height: string | number; }>`
  min-width: 100%;
  height: ${props => typeof props.height === 'number' ? `${props.height}px` : props.height};
  overflow: hidden;
`;

const HeaderBox = styled(Box)`
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.26);
`;

const HeaderRow = styled.div<{ height: number; }>`
  display: flex;
  height: ${props => props.height}px;
`;

const HeaderCell = styled.div<{ width: number; height: number; }>`
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

const BodyRow = styled.div<{ height: number; }>`
  display: flex;
  height: ${props => props.height}px;
`;

const BodyCell = styled.div<{ width: number; height: number; }>`
  padding: 0 8px;
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  line-height: ${props => props.height}px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  background: #fff;

  & + & {
    border-left: none;
  }
`;

