/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { Card, Classes, H6 } from '@yishanzhilubp/core';
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { IRecord } from '@/src/model/schemas';
import { f } from '@/src/api';
import { TaiToast } from '@/src/utils/toaster';
import { TaiListSimple } from '@/src/components/layouts/taiList';
import { getDateDiffFromNow } from '@/src/utils/funcs';
import { useUserContext } from '@/src/scopes/global/userContext';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';

import { Record } from './record';
import { NewRecord } from './newRecord';
import { recordListReducer, RecordsContext } from './recordListReduceContext';
import { useWorkListContext } from '../workList';

interface IProps {
  records: IRecord[];
}

const MoreRecordText = ({ loadingMore, cursor, userCreatedAt }) => {
  if (loadingMore) return <div style={{ textAlign: 'center' }}>加载中...</div>;
  if (cursor > 0) return <div style={{ textAlign: 'center' }}>更多</div>;
  return (
    <H6 style={{ margin: 0 }}>
      <span className={classNames(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
        @{getDateDiffFromNow(userCreatedAt)}
      </span>
      <div style={{ lineHeight: '24px' }}>💫 首次使用移山</div>
    </H6>
  );
};

export const RecordList = ({ records }: IProps): React.ReactElement => {
  const [state, dispatch] = React.useReducer(recordListReducer, {
    records,
    addNew: false,
    isFreeze: false,
  });
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [pageMounted, setPageMounted] = React.useState(true);

  const [{ finishedTodo }] = useWorkListContext();
  React.useEffect(() => {
    if (finishedTodo) {
      dispatch({ type: 'AddRecord' });
    }
  }, [finishedTodo]);
  const [cursor, setCursor] = React.useState<number>(0);
  React.useEffect(() => {
    setPageMounted(true);
  }, [records]);
  React.useEffect(() => {
    dispatch({ type: 'Reset', records });
    setCursor(records.length > 0 ? records[records.length - 1].id : 0);
    setPageMounted(false);
  }, [pageMounted]);

  const {
    state: {
      currentDetail: { goalID, missionID },
    },
    computed: { freezed },
  } = useWorkProfileContext();
  const {
    state: {
      user: { createdAt },
    },
  } = useUserContext();

  const handleMoreClick = async () => {
    if (!cursor) {
      return;
    }
    setLoadingMore(true);
    dispatch({ type: 'Freeze' });
    try {
      const res = await f.get<IRecord[]>(`/records`, {
        params: {
          cursor,
          goalID,
          missionID,
        },
      });
      if (res.data.length > 0) {
        dispatch({ type: 'AppendRecordListDone', records: res.data });
        setCursor(res.data[res.data.length - 1].id);
      } else {
        setCursor(null);
      }
      setLoadingMore(false);
    } catch (error) {
      TaiToast.show({ message: error.message, intent: 'primary' });
      setLoadingMore(false);
    }
  };

  return (
    <RecordsContext.Provider value={{ state, dispatch }}>
      <TaiListSimple title="历程">
        {!freezed && (
          <li>
            <NewRecord />
          </li>
        )}
        <TransitionGroup
          className="record-list"
          appear={false}
          exit={!pageMounted}
        >
          {state.records.map(record => (
            <CSSTransition key={record.id} timeout={500} classNames="item" in>
              <li>
                <Record record={record} />
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>
        <li className="more">
          <Card interactive={cursor > 0} onClick={handleMoreClick}>
            <MoreRecordText
              cursor={cursor}
              loadingMore={loadingMore}
              userCreatedAt={createdAt}
            />
          </Card>
        </li>
      </TaiListSimple>
      <style jsx>{`
        .item-enter {
          opacity: 0;
        }
        .item-enter-active {
          opacity: 1;
          transition: opacity 500ms ease-in;
        }
        .item-exit {
          max-height: 200px;
          opacity: 1;
          padding: 1px;
          overflow: hidden;
        }
        .item-exit-active {
          opacity: 0;
          max-height: 0;
          transition: max-height 500ms ease-in, opacity 500ms ease-in;
        }
      `}</style>
    </RecordsContext.Provider>
  );
};
