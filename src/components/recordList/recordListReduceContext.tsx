/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { IRecord } from '@/src/model/schemas';

type IRecordListAction =
  | { type: 'DeleteRecordDone'; id: number }
  | { type: 'AddRecord' }
  | { type: 'AddRecordCancel' }
  | { type: 'AddRecordDone'; record: IRecord }
  | { type: 'AppendRecordListDone'; records: IRecord[] }
  | { type: 'Freeze' }
  | { type: 'Unfreeze' };

interface IRecordListState {
  records: IRecord[];
  addNew: boolean;
  isFreeze: boolean;
}

export const RecordsContext = React.createContext({
  state: { records: [], addNew: false, isFreeze: false },
  dispatch: (action: IRecordListAction) => {
    console.debug('RecordsContext default dispatch', action);
  },
});

export const recordListReducer = (
  recordListState: IRecordListState,
  recordListAction: IRecordListAction
): IRecordListState => {
  console.debug('recordListReducer', recordListAction);

  if (recordListState.isFreeze && !/Done$/.test(recordListAction.type)) {
    return recordListState;
  }
  switch (recordListAction.type) {
    case 'Freeze':
      return {
        ...recordListState,
        isFreeze: true,
      };
    case 'AddRecord':
      return {
        ...recordListState,
        addNew: true,
      };
    case 'AddRecordCancel':
      return {
        ...recordListState,
        addNew: false,
      };
    case 'AddRecordDone':
      return {
        records: [recordListAction.record, ...recordListState.records],
        addNew: false,
        isFreeze: false,
      };
    case 'DeleteRecordDone':
      return {
        records: recordListState.records.filter(
          r => r.id !== recordListAction.id
        ),
        addNew: false,
        isFreeze: false,
      };
    case 'AppendRecordListDone':
      return {
        records: [...recordListState.records, ...recordListAction.records],
        addNew: false,
        isFreeze: false,
      };
    default:
      return recordListState;
  }
};
