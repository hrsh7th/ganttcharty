import React, { useCallback, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ResizeDetector from 'react-resize-detector';
import { Hotkeys } from '../ui-kit/hotkeys';
import { HeaderArea } from './header-area/HeaderArea';
import { ChartArea } from './chart-area/ChartArea';
import { Export } from './export/Export';
import * as Action from '../../action';
import * as State from '../../state';
import { Diff } from '../ui-kit/movable';
import { Fullscreen } from '../ui-kit/fullscreen';

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

export const GanttChart = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const fullscreen = State.use(s => s.ui.fullscreen);

  const onResize = useCallback((width?: number, height?: number) => {
    if (width && height) {
      Action.UI.updateViewport({ width, height });
    }
  }, []);

  const onHeaderAreaMoving = useCallback((_: MouseEvent, diff: Diff) => {
    if (headerRef.current) {
      headerRef.current.scrollLeft += -diff.currentX;
    }
    syncY(headerRef, chartRef, -diff.currentY);
  }, []);

  const onHeaderAreaWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    syncY(headerRef, chartRef, e.deltaY);
  }, []);

  const onChartAreaWheel = useCallback((e: WheelEvent) => {
    Action.UI.updateCurrentTime(e.deltaX);
  }, []);

  const onChartAreaMoving = useCallback((_: MouseEvent, diff: Diff) => {
    Action.UI.updateCurrentTime(-diff.currentX);
    syncY(chartRef, headerRef, -diff.currentY);
  }, []);

  const onChartAreaScroll = useCallback((_: React.UIEvent<HTMLDivElement>) => {
    syncY(chartRef, headerRef, 0);
  }, []);

  const syncY = useCallback((
    from: React.RefObject<HTMLDivElement>,
    to: React.RefObject<HTMLDivElement>,
    diffY: number
  ) => {
    if (from.current && to.current) {
      from.current.scrollTop += diffY;
      to.current.scrollTop = from.current.scrollTop;
    }
  }, []);

  return (
    <>
      <ResizeDetector handleWidth handleHeight onResize={onResize} />
      <Hotkeys
        scope="root"
        keymap={Action.Hotkey.keyMap}
        listeners={Action.Hotkey.handlers}
      >
        <Fullscreen on={fullscreen}>
          <Self className="GanttChart">
            <HeaderArea
              key="1"
              ref={headerRef}
              onMoving={onHeaderAreaMoving}
              onWheel={onHeaderAreaWheel}
            />
            <ChartArea
              key="2"
              ref={chartRef}
              onWheel={onChartAreaWheel}
              onMoving={onChartAreaMoving}
              onScroll={onChartAreaScroll}
            />
            <Export />
          </Self>
        </Fullscreen>
      </Hotkeys>
      <GlobalStyle />
    </>
  );
}

const Self = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 8px;
  background: #fff;
  user-select: none;
`;
