/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { Card, Classes, H6 } from '@yishanzhilubp/core';
import classNames from 'classnames';

import { IRecord } from '@/src/model/schemas';
import { FinishedTodoContext } from '@/src/contexts/finishedTodo';

import { Record } from './record';
import { NewRecord } from './newRecord';
import { recordListReducer, RecordsContext } from './recordListReduceContext';
import { axios } from '@/src/api';
import { Toast } from '@/src/utils/toaster';
import { TaiList } from '@/src/layout/taiList';
import { getDateDiffFromNow } from '@/src/utils/funcs';
import { useGlobalContext } from '@/src/contexts/global';

interface IProps {
  initialRecords: IRecord[];
  initialRecordsNextURL: string;
}

export const RecordList = ({
  initialRecords,
  initialRecordsNextURL,
}: IProps): React.ReactElement => {
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
  const [nextURL, setNextURL] = React.useState(initialRecordsNextURL);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const handleMoreClick = async () => {
    if (!nextURL) {
      return;
    }
    setLoadingMore(true);
    dispatch({ type: 'Freeze' });
    try {
      const res = await axios.get<{ data: IRecord[]; nextURL?: string }>(
        nextURL
      );
      dispatch({ type: 'AppendRecordListDone', records: res.data.data });
      setNextURL(res.data.nextURL);
      setLoadingMore(false);
    } catch (error) {
      Toast.show({ message: error.message, intent: 'primary' });
      setLoadingMore(false);
    }
  };

  const [globalState] = useGlobalContext();
  const moreText = nextURL ? (
    '更多'
  ) : (
    <H6 style={{ margin: 0 }}>
      <span className={classNames(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
        @{getDateDiffFromNow(globalState.user.createdAt)}
      </span>
      <div style={{ lineHeight: '24px' }}>💫开始使用移山</div>
    </H6>
  );
  return (
    <RecordsContext.Provider value={{ state, dispatch }}>
      <TaiList title="历程">
        <li>
          <NewRecord />
        </li>
        {state.records.map(record => (
          <li key={record.id}>
            <Record record={record} />
          </li>
        ))}
        <li className="more">
          <Card interactive={nextURL != null} onClick={handleMoreClick}>
            {loadingMore ? '加载更多...' : moreText}
          </Card>
        </li>
      </TaiList>
    </RecordsContext.Provider>
  );
};
