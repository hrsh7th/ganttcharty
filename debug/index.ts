import * as State from '../src/state';
import { render } from '../src/index';

(window as any).State = State;
(window as any).chart = render('app', {
  option: {
    headerWidth: 240,
    rowHeight: 24,
    columnWidth: 18,
    scale: 'day',
    barHeight: 4,
    axisHeight: 32,
    indentWidth: 12,
    baseTime: '2018-10-17T15:00:00.000Z',
    dayLabel: ['日', '月', '火', '水', '木', '金', '土'],
    columns: [
      { key: 'name', name: 'タスク', width: 200 },
      { key: 'startedAt', name: '開始日', width: 120 },
      { key: 'finishedAt', name: '終了日', width: 120 }
    ]
  },
  tasks: [
    {
      id: '1841471c-4d7b-4952-a8bf-31ae37c3bfac',
      name: 'Support nested updater call.',
      description: '',
      startedAt: '2018-10-26T15:00:00.000Z',
      finishedAt: '2018-10-29T15:00:00.000Z',
      parentId: '14'
    },
    {
      id: 'b00563f1-c354-40a4-944f-2541db84b6f9',
      name: "Support immer's patch feature.",
      description: '',
      startedAt: '2018-11-01T15:00:00.000Z',
      finishedAt: '2018-11-08T15:00:00.000Z',
      parentId: '14'
    },
    {
      id: 'b364ac9c-d396-4da9-a6dc-05695770337c',
      name: 'Fix drag&drop bug',
      description: '',
      startedAt: '2018-10-29T15:00:00.000Z',
      finishedAt: '2018-11-02T15:00:00.000Z',
      parentId: '4c752606-11c1-40fc-bc1b-0a01c333e9d0'
    },
    {
      id: '4c752606-11c1-40fc-bc1b-0a01c333e9d0',
      name: 'GanttCharty',
      description: '',
      startedAt: '2018-10-24T15:00:00.000Z',
      finishedAt: '2018-11-14T15:00:00.000Z'
    },
    {
      id: '14',
      startedAt: '2018-10-24T15:00:00.000Z',
      finishedAt: '2018-11-14T15:00:00.000Z',
      name: 'Srimmer',
      description: ''
    }
  ]
});
