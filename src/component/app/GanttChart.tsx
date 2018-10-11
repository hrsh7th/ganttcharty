import React from 'react';
import { injectGlobal } from 'styled-components';
import { HotKeys } from 'react-hotkeys';
import ResizeDetector from 'react-resize-detector';
import FixedArea  from './fixed-area/FixedArea';
import ChartArea from './chart-area/ChartArea';
import * as Action from '../../action';
import * as State from '../../state';

export default class extends React.Component {

  private chart = React.createRef<HTMLDivElement>();

  public render() {
    return (
      <>
        <ResizeDetector handleWidth handleHeight onResize={this.onResize} />
        <HotKeys keyMap={Action.Hotkey.keyMap} handlers={Action.Hotkey.handlers}>
          <FixedArea />
          <ChartArea innerRef={this.chart} onWheel={this.onChartAreaWheel} />
        </HotKeys>
      </>
    );
  }

  private onChartAreaWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const state = State.get()!;
    const diffX = State.Option.scaleTime(state.option.scale) * (e.deltaX / state.option.columnWidth);
    Action.UI.updateCurrentTime(diffX);
    const diffY = e.deltaY;
    this.chart.current && (this.chart.current.scrollTop += diffY);
  };

  private onResize = (width: number, height: number) => {
    console.log({ width, height });
    Action.UI.updateViewport({ width, height });
  };
}

injectGlobal`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

