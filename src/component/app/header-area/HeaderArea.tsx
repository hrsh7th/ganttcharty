import React from 'react';
import styled from 'styled-components';
import * as Action from '../../../action';
import * as State from '../../../state';
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
      <HeaderArea {...state}>
        <Grid<State.Task.TaskNode>
          keyName="id"
          columns={state.columns}
          rows={State.Task.tasks(state.tasks)}
          Box={props => <Box height={'100%'}>{props.children}</Box>}
          header={{
            HeaderBox: props => <HeaderBox height={state.axisHeight}>{props.children}</HeaderBox>,
            HeaderRow: props => <HeaderRow height={state.axisHeight}>{props.children}</HeaderRow>,
            HeaderCell: props => <HeaderCell width={props.column.width} height={state.axisHeight}>{props.column.name}</HeaderCell>
          }}
          body={{
            BodyBox: props => <Box height={state.viewportHeight - state.axisHeight}>{props.children}</Box>,
            BodyRow: props => <BodyRow height={state.rowHeight}>{props.children}</BodyRow>,
            BodyCell: props => <BodyCell data-task-id={props.row.id} width={props.column.width} height={state.rowHeight} onClick={onTaskClick}>{(() => {
              const onChange = (value: any) => Action.Task.updateTask(props.row.id, { [props.column.key]: value });
              switch (props.column.key) {
                case 'startedAt':
                  return <InlineEdit value={props.row[props.column.key]} format={'YYYY/MM/DD'} onChange={onChange} />
                case 'finishedAt':
                  return <InlineEdit value={props.row[props.column.key]} format={'YYYY/MM/DD'} onChange={onChange} />
                case 'name':
                  return (
                    <>
                      <Handle />
                      {(props.row.children.length || props.row.collapsed) ? (
                        <Expander data-task-id={props.row.id} indentWidth={state.indentWidth} depth={props.row.depth} collapsed={!!props.row.collapsed} onClick={onExpandClick} />
                      ) : (
                        <Spacer indentWidth={state.indentWidth} depth={props.row.depth} />
                      )}
                      <InlineEdit value={props.row[props.column.key]} onChange={onChange} />
                    </>
                  );
                default:
                  return null;
              }
            })()}</BodyCell>
          }}
          forwardedRef={ref}
          onWheel={onWheel}
        />
      </HeaderArea>
    )}
  </Consumer>
));

const onTaskClick = (e: React.MouseEvent<HTMLElement>) => {
  Action.UI.selectTask(e.currentTarget.getAttribute('data-task-id')!);
};

const onExpandClick = (e: React.MouseEvent<HTMLElement>) => {
  const task = State.Task.getTask(State.get()!.tasks, e.currentTarget.getAttribute('data-task-id')!)!;
  if (task.collapsed) {
    Action.Task.expand(task.id);
  } else {
    Action.Task.collapse(task.id);
  }
};

const HeaderArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.headerWidth}px;
  height: 100%;
  z-index: 2;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.26);
`;

const Spacer = styled.div<{ indentWidth: number; depth: number; }>`
  width: ${props => props.indentWidth * (props.depth + 1)}px;
  display: inline-block;
  vertical-align: top;
`;

const Expander = styled(Spacer)<{ collapsed: boolean; }>`
  &::after {
    display: block;
    padding-right: 4px;
    height: 100%;
    text-align: right;
    content: '${props => props.collapsed ? '+' : '-'}';
  }
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
  cursor: pointer;

  &::before {
    display: block;
    content: '';
    margin: 2px 0;
    border-top: 1px solid #ccc;
  }
`;

const Box = styled.div<{ height: string | number; }>`
  min-width: 100%;
  height: ${props => props.height};
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

  & + & {
    border-left: none;
  }
`;

