import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { startOfWeek } from 'date-fns';
import * as State from '../../../../../state';

export const DayAxis = () => {
  const state = State.use(state => ({
    scale: state.option.scale,
    columnWidth: state.option.columnWidth,
    dayLabel: state.option.dayLabel,
    viewportWidth: state.ui.viewportWidth,
    currentTimestamp: startOfWeek(state.ui.currentTime, {
      weekStartsOn: 1
    }).getTime()
  }))
  return (
    <>
      {State.UI.dayAxis(
        new Date(state.currentTimestamp),
        state.scale,
        state.columnWidth,
        state.viewportWidth
      ).map(week => (
        <Week key={week.day.getTime()} columnWidth={state.columnWidth}>
          <WeekLabel>{format(week.day, 'yyyy/MM/dd')}</WeekLabel>
          <Days>
            {week.days.map(day => (
              <Day
                key={day.getTime()}
                title={format(day, 'yyyy/MM/dd')}
                columnWidth={state.columnWidth}
              >
                {state.dayLabel[day.getDay()]}
              </Day>
            ))}
          </Days>
        </Week>
      ))}
    </>
  );
};

const Week = styled.div<{ columnWidth: number }>`
  width: ${props => props.columnWidth * 7}px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  & + & {
    border-left: 1px solid #ddd;
  }
`;

const WeekLabel = styled.div`
  text-align: center;
`;

const Days = styled.div`
  display: flex;
  align-items: center;
`;

const Day = styled.div<{ columnWidth: number }>`
  width: ${props => props.columnWidth}px;
  text-align: center;
  overflow: hidden;
`;
