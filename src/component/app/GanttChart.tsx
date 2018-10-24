import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ResizeDetector from 'react-resize-detector';
import { Hotkeys } from '../ui-kit/hotkeys';
import { HeaderArea } from './header-area/HeaderArea';
import { ChartArea } from './chart-area/ChartArea';
import * as Action from '../../action';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

export class GanttChart extends React.PureComponent {
  private header = React.createRef<HTMLDivElement>();
  private chart = React.createRef<HTMLDivElement>();

  public render() {
    return (
      <>
        <ResizeDetector handleWidth handleHeight onResize={this.onResize} />
        <Hotkeys
          scope="root"
          keymap={Action.Hotkey.keyMap}
          listeners={Action.Hotkey.handlers}
        >
          <Self className="GanttChart">
            <HeaderArea ref={this.header} onWheel={this.onHeaderAreaWheel} />
            <ChartArea ref={this.chart} onWheel={this.onChartAreaWheel} />
          </Self>
        </Hotkeys>
        <GlobalStyle />
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
    this.syncY(this.header, this.chart, e.deltaY);
  };

  private onChartAreaWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    Action.UI.updateCurrentTime(e.deltaX);
    this.syncY(this.chart, this.header, e.deltaY);
  };

  private syncY = (
    from: React.RefObject<HTMLDivElement>,
    to: React.RefObject<HTMLDivElement>,
    diffY: number
  ) => {
    if (from.current && to.current) {
      from.current.scrollTop += diffY;
      to.current.scrollTop = from.current.scrollTop;
    }
  };
}

const Self = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 8px;
`;
