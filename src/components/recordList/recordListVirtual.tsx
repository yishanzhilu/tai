/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { List, WindowScroller, AutoSizer } from 'react-virtualized';

import { IRecord } from '@/src/model/schemas';
import { Record } from './record';
import { NewRecord } from './newRecord';
import { recordListReducer, RecordsContext } from './recordListReduceContext';
import { FinishedTodoContext } from '@/src/contexts/finishedTodo';

interface IProps {
  initialRecords: IRecord[];
}

export const RecordList = ({ initialRecords }: IProps): React.ReactElement => {
  const [state, dispatch] = React.useReducer(recordListReducer, {
    records: initialRecords,
    addNew: false,
    isFreeze: false,
  });
  const { finishedTodo } = React.useContext(FinishedTodoContext);
  React.useEffect(() => {
    if (finishedTodo.content) {
      dispatch({ type: 'AddRecord' });
    }
  }, [finishedTodo]);
  const rowRenderer = ({ index, isScrolling, isVisible, key, style }) => {
    const record = state.records[index];

    return (
      <div key={key} style={style}>
        <Record record={record} />
      </div>
    );
  };
  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight defaultWidth={800}>
          {({ width }) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={state.records.length}
              rowHeight={156}
              rowRenderer={rowRenderer}
              scrollTop={scrollTop}
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
};
