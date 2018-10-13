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
    Box: React.ComponentType<any>;
    Row: React.ComponentType<any>;
    Cell: React.ComponentType<{ column: Column<Row>; }>;
  };
  body: {
    Box: React.ComponentType<any>;
    ScrollArea: React.ComponentType<any>;
    Row: React.ComponentType<any>;
    Cell: React.ComponentType<{ column: Column<Row>; row: Row; }>;
  };
  innerRef: React.RefObject<HTMLDivElement>;
  onWheel: React.WheelEventHandler;
};

export class Grid<Row extends object> extends React.Component<Props<Row>> {

  private body: React.RefObject<HTMLDivElement> = React.createRef();

  public render() {
    const Box = this.props.Box;
    const { Box: HeaderBox } = this.props.header;
    const { Box: BodyBox, ScrollArea } = this.props.body;
    return (
      <Box onWheel={this.onWheel}>
        <HeaderBox>{this.columns()}</HeaderBox>
        <BodyBox innerRef={this.props.innerRef}>
          <ScrollArea>
            {this.rows()}
          </ScrollArea>
        </BodyBox>
      </Box>
    );
  }

  private columns() {
    const { Row, Cell } = this.props.header;
    return (
      <Row>
        {this.props.columns.map(column => (
          <Cell key={`header-cell-${column.key}`} column={column} />
        ))}
      </Row>
    );
  }

  private rows() {
    const { Row, Cell }= this.props.body;
    return this.props.rows.map(row => (
      <Row key={`body-row-${row[this.props.keyName]}`}>
        {this.props.columns.map(column => (
          <Cell key={`body-cell-${row[this.props.keyName]}-${column.key}`} column={column} row={row} />
        ))}
      </Row>
    ));
  }

  private onWheel = (e: React.WheelEvent) => {
    if (this.body.current) {
      this.body.current.scrollTop += e.deltaY;
    }
    this.props.onWheel(e);
  };

}

