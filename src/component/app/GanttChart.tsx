import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ResizeDetector from 'react-resize-detector';
import Fullscreen from 'react-full-screen';
import { Hotkeys } from '../ui-kit/hotkeys';
import { HeaderArea } from './header-area/HeaderArea';
import { ChartArea } from './chart-area/ChartArea';
import { Export } from './export/Export';
import * as Action from '../../action';
import * as State from '../../state';
import { Diff } from '../ui-kit/movable';

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

const Consumer = State.select(state => ({
  fullscreen: state.ui.fullscreen
}));

export class GanttChart extends React.PureComponent {
  private header = React.createRef<HTMLDivElement>();
  private chart = React.createRef<HTMLDivElement>();

  public render() {
    return (
      <Consumer>
        {state => (
          <Fullscreen enabled={state.fullscreen}>
            <ResizeDetector handleWidth handleHeight onResize={this.onResize} />
            <Hotkeys
              scope="root"
              keymap={Action.Hotkey.keyMap}
              listeners={Action.Hotkey.handlers}
            >
              <Self className="GanttChart">
                <HeaderArea
                  ref={this.header}
                  onMoving={this.onHeaderAreaMoving}
                  onWheel={this.onHeaderAreaWheel}
                />
                <ChartArea
                  ref={this.chart}
                  onMoving={this.onChartAreaMoving}
                  onScroll={this.onChartAreaScroll}
                />
                <Export />
              </Self>
            </Hotkeys>
            <GlobalStyle />
          </Fullscreen>
        )}
      </Consumer>
    );
  }

  private onResize = (width: number, height: number) => {
    Action.UI.updateViewport({ width, height });
  };

  private onHeaderAreaMoving = (_: MouseEvent, diff: Diff) => {
    if (this.header.current) {
      this.header.current.scrollLeft += -diff.currentX;
    }
    this.syncY(this.header, this.chart, -diff.currentY);
  };

  private onHeaderAreaWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    this.syncY(this.header, this.chart, e.deltaY);
  };

  private onChartAreaMoving = (_: MouseEvent, diff: Diff) => {
    Action.UI.updateCurrentTime(-diff.currentX);
    this.syncY(this.chart, this.header, -diff.currentY);
  };

  private onChartAreaScroll = (_: React.UIEvent<HTMLDivElement>) => {
    this.syncY(this.chart, this.header, 0);
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
  background: #fff;
`;
