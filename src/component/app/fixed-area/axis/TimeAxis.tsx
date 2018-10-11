import React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import * as State from '../../../../state';

const Consumer = State.select(state => {
  return {
    scale: state.option.scale,
    columnWidth: state.option.columnWidth,
    dayLabel: state.option.dayLabel,
    currentTime: state.ui.currentTime,
    viewportWidth: state.ui.viewportWidth
  };
});

export default () => (
  <Consumer>
    {state => (
      <TimeAxis {...state}>{days(state)}</TimeAxis>
    )}
  </Consumer>
);

const days = (state: State.Select<typeof Consumer>) => {
  const weeks = State.UI.daysAxis(state.currentTime, state.scale, state.columnWidth, state.viewportWidth);
  return (
    <Weeks {...state} style={{
      transform: `translateX(${State.UI.x(weeks[0].day, state.currentTime, state.scale, state.columnWidth)}px)`
    }}>
      {weeks.map(week => (
        <Week key={week.day.getTime()} {...state}>
          <WeekLabel {...state}>{format(week.day, 'YYYY/MM/DD')}</WeekLabel>
          <Days {...state}>
            {week.days.map(day => (
              <Day key={day.getTime()} title={format(day, 'YYYY/MM/DD')} {...state}>{state.dayLabel[day.getDay()]}</Day>
            ))}
          </Days>
        </Week>
      ))}
    </Weeks>
  );
};

const TimeAxis = styled.div<State.Select<typeof Consumer>>`
  width: 100%;
  height: 100%;
`;

const Weeks = styled.div<State.Select<typeof Consumer>>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
`;

const Week = styled.div<State.Select<typeof Consumer>>`
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

