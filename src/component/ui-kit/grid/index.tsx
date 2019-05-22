import React from 'react';
import { Movable, MoveEventHandler, Diff } from '../movable';

export type Column<Row extends object> = {
  key: keyof Row;
  name: string;
  width: number;
};

export type Props<Row extends object> = {
  keyName: keyof Row;
  rows: Row[];
  columns: Column<Row>[];
  Box: React.ComponentType<any>;
  header: {
    HeaderBox: React.ComponentType<any>;
    HeaderRow: React.ComponentType<any>;
    HeaderCell: React.ComponentType<unknown & { column: Column<Row> }>;
  };
  body: {
    BodyBox: React.ComponentType<any>;
    BodyRow: React.ComponentType<unknown & { row: Row }>;
    BodyCell: React.ComponentType<unknown & { column: Column<Row>; row: Row }>;
  };
  forwardedRef: React.RefObject<HTMLDivElement>;
  onMoving: MoveEventHandler;
  onWheel: React.WheelEventHandler<HTMLDivElement>;
};

const ScrollableStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

export class Grid<Row extends object> extends React.PureComponent<Props<Row>> {
  private header = React.createRef<HTMLDivElement>();

  public getSnapshotBeforeUpdate() {
    if (this.header.current && this.props.forwardedRef.current) {
      return {
        x: this.header.current.scrollLeft,
        y: this.props.forwardedRef.current.scrollTop
      };
    }
    return null;
  }

  public componentDidUpdate(
    _: Props<Row>,
    __: any,
    snapshot: { x: number; y: number }
  ) {
    if (this.header.current && this.props.forwardedRef.current) {
      this.header.current.scrollLeft = snapshot.x;
      this.props.forwardedRef.current.scrollLeft = snapshot.x;
      this.props.forwardedRef.current.scrollTop = snapshot.y;
    }
  }

  public render() {
    const { Box } = this.props;
    const { HeaderBox } = this.props.header;
    const { BodyBox } = this.props.body;
    return (
      <Box>
        <HeaderBox>
          <div style={ScrollableStyle} ref={this.header}>
            {this.columns()}
          </div>
        </HeaderBox>
        <BodyBox>
          <Movable onMoving={this.onMoving}>
            <div
              style={Object.assign({}, ScrollableStyle, {
                overflowX: 'scroll'
              })}
              ref={this.props.forwardedRef}
              onWheel={this.props.onWheel}
              onScroll={this.onScroll}
            >
              {this.rows()}
            </div>
          </Movable>
        </BodyBox>
      </Box>
    );
  }

  private columns() {
    const { HeaderRow, HeaderCell } = this.props.header;
    return (
      <HeaderRow>
        {this.props.columns.map(column => (
          <HeaderCell key={`header-cell-${column.key}`} column={column} />
        ))}
      </HeaderRow>
    );
  }

  private rows() {
    const { BodyRow, BodyCell } = this.props.body;
    return this.props.rows.map(row => (
      <BodyRow key={`body-row-${row[this.props.keyName]}`} row={row}>
        {this.props.columns.map(column => (
          <BodyCell
            key={`body-cell-${row[this.props.keyName]}-${column.key}`}
            column={column}
            row={row}
          />
        ))}
      </BodyRow>
    ));
  }

  private onMoving = (e: MouseEvent, diff: Diff) => {
    if (this.header.current) {
      this.header.current.scrollLeft += -diff.currentX;
    }
    this.props.onMoving(e, diff);
  };

  private onScroll = (_: React.UIEvent<HTMLDivElement>) => {
    if (this.header.current && this.props.forwardedRef.current) {
      this.header.current.scrollLeft = this.props.forwardedRef.current.scrollLeft;
    }
  };
}
