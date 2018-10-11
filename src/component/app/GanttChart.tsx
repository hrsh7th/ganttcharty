import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { HotKeys } from 'react-hotkeys';
import ResizeDetector from 'react-resize-detector';
import TimeAxis from './fixed-area/axis/TimeAxis';
import ChartArea from './chart-area/ChartArea';
import * as Action from '../../action';

import * as State from '../../state';

const Consumer = State.select(state => state);

export default class extends React.Component {

  private chart = React.createRef<HTMLDivElement>();

  public render() {
    return (
      <HotKeys keyMap={Action.Hotkey.keyMap} handlers={Action.Hotkey.handlers}>
        <Consumer>
          {state => (
            <>
              <ResizeDetector handleWidth handleHeight onResize={this.onResize} />
              <FixedArea {...state}>
                <FixedHeaderArea {...state} />
                <FixedAxisArea {...state}>
                  <TimeAxis />
                </FixedAxisArea>
              </FixedArea>
              <ChartArea innerRef={this.chart} onWheel={this.onChartAreaWheel} />
            </>
          )}
        </Consumer>
      </HotKeys>
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

const FixedArea = styled.div<State.Select<typeof Consumer>>`
  width: 100%;
  height: ${props => props.option.fixedAreaHeight}px;
  display: flex;
`;

const FixedHeaderArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.option.headerWidth}px;
  height: 100%;
  background: #f8f8ff;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;

const FixedAxisArea = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.ui.viewportWidth - props.option.headerWidth}px;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #f8ff8;
`;

