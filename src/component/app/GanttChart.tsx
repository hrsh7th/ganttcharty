import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import ResizeDetector from 'react-resize-detector';
import Hotkeys from '../ui-kit/hotkeys';
import HeaderArea from './header-area/HeaderArea';
import ChartArea from './chart-area/ChartArea';
import * as Action from '../../action';

export default class extends React.Component {

  private header = React.createRef<HTMLDivElement>();
  private chart = React.createRef<HTMLDivElement>();

  public render() {
    return (
      <>
        <ResizeDetector handleWidth handleHeight onResize={this.onResize} />
        <Hotkeys keymap={Action.Hotkey.keyMap} listeners={Action.Hotkey.handlers}>
          <GanttChart>
            <HeaderArea innerRef={this.header} onWheel={this.onHeaderAreaWheel} />
            <ChartArea innerRef={this.chart} onWheel={this.onChartAreaWheel} />
          </GanttChart>
        </Hotkeys>
      </>
    );
  }

  private onResize = (width: number, height: number) => {
    Action.UI.updateViewport({ width, height });
  };

  private onHeaderAreaWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (this.header.current) {
      this.header.current.scrollLeft += e.deltaX;
    }
    this.syncX(this.header, this.chart, e.deltaY);
  };

  private onChartAreaWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    Action.UI.updateCurrentTime(e.deltaX);
    this.syncX(this.chart, this.header, e.deltaY);
  };

  private syncX = (from: React.RefObject<HTMLDivElement>, to: React.RefObject<HTMLDivElement>, diffY: number) => {
    if (from.current && to.current) {
      from.current.scrollTop += diffY;
      to.current.scrollTop = from.current.scrollTop;
    }
  };
}

const GanttChart = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

injectGlobal`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-size: 8px;
  }
`;

