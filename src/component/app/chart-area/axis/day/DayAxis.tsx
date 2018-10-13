import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/start_of_week';
import * as State from '../../../../../state';

const Consumer = State.select(state => ({
  scale: state.option.scale,
  columnWidth: state.option.columnWidth,
  dayLabel: state.option.dayLabel,
  viewportWidth: state.ui.viewportWidth,
  currentTimestamp:  startOfWeek(state.ui.currentTime, { weekStartsOn: 1 }).getTime()
}));

export default () => (
  <Consumer>
    {state => (
      State.UI.dayAxis(new Date(state.currentTimestamp), state.scale, state.columnWidth, state.viewportWidth).map(week => (
        <Week key={week.day.getTime()} {...state}>
          <WeekLabel {...state}>{format(week.day, 'YYYY/MM/DD')}</WeekLabel>
          <Days {...state}>
          {week.days.map(day => (
            <Day key={day.getTime()} title={format(day, 'YYYY/MM/DD')} {...state}>{state.dayLabel[day.getDay()]}</Day>
          ))}
          </Days>
        </Week>
      ))
    )}
  </Consumer>
);

const Week = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.columnWidth * 7}px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  & + & {
    border-left: 1px solid #ddd;
  }
`;

const WeekLabel = styled.div<State.Select<typeof Consumer>>`
  font-size: 8px;
  text-align: center;
`;

const Days = styled.div<State.Select<typeof Consumer>>`
  display: flex;
  align-items: center;
`;

const Day = styled.div<State.Select<typeof Consumer>>`
  width: ${props => props.columnWidth}px;
  text-align: center;
  font-size: 8px;
  overflow: hidden;
`;

