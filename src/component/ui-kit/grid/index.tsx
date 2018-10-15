import React from 'react';

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
    HeaderCell: React.ComponentType<unknown & { column: Column<Row>; }>;
  };
  body: {
    BodyBox: React.ComponentType<any>;
    BodyRow: React.ComponentType<unknown & { row: Row; }>;
    BodyCell: React.ComponentType<unknown & { column: Column<Row>; row: Row; }>;
  };
  innerRef: React.RefObject<HTMLDivElement>;
  onWheel: React.WheelEventHandler;
};

const ScrollableStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

export default class Grid<Row extends object> extends React.Component<Props<Row>> {

  private header = React.createRef<HTMLDivElement>();

  public render() {
    const { Box } = this.props;
    const { HeaderBox } = this.props.header;
    const { BodyBox } = this.props.body;
    return (
      <Box key="1">
        <HeaderBox>
          <div style={ScrollableStyle} ref={this.header}>
            {this.columns()}
          </div>
        </HeaderBox>
        <BodyBox>
          <div key="2" style={ScrollableStyle} ref={this.props.innerRef} onWheel={this.onWheel}>
            {this.rows()}
          </div>
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
    const { BodyRow, BodyCell }= this.props.body;
    return this.props.rows.map(row => (
      <BodyRow key={`body-row-${row[this.props.keyName]}`} row={row}>
        {this.props.columns.map(column => (
          <BodyCell key={`body-cell-${row[this.props.keyName]}-${column.key}`} column={column} row={row} />
        ))}
      </BodyRow>
    ));
  }

  private onWheel = (e: React.WheelEvent) => {
    if (this.header.current) {
      this.header.current.scrollLeft += e.deltaX;
    }
    this.props.onWheel(e);
  };

}

