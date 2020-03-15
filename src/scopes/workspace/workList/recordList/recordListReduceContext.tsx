/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { IRecord } from '@/src/model/schemas';
import { noop } from '@/src/utils/funcs';

type IRecordListAction =
  | { type: 'DeleteRecordDone'; id: number }
  | { type: 'AddRecord' }
  | { type: 'AddRecordCancel' }
  | { type: 'AddRecordDone'; record: IRecord }
  | { type: 'AppendRecordListDone'; records: IRecord[] }
  | { type: 'EditRecord'; id: number }
  | { type: 'EditRecordCancel' }
  | { type: 'EditRecordDone'; record: IRecord }
  | { type: 'Reset'; records: IRecord[] }
  | { type: 'Freeze' }
  | { type: 'Unfreeze' };

interface IRecordListState {
  records: IRecord[];
  addNew: boolean;
  editingID: number;
  isFreeze: boolean;
}

export const RecordsContext = React.createContext<{
  state: IRecordListState;
  dispatch: React.Dispatch<IRecordListAction>;
}>({
  state: { records: [], addNew: false, isFreeze: false, editingID: 0 },
  dispatch: noop,
});

export const recordListReducer = (
  state: IRecordListState,
  action: IRecordListAction
): IRecordListState => {
  if (action.type === 'Reset') {
    return {
      editingID: 0,
      records: action.records,
      addNew: false,
      isFreeze: false,
    };
  }

  if (state.isFreeze && !/Done$/.test(action.type)) {
    return state;
  }
  switch (action.type) {
    case 'Freeze':
      return {
        ...state,
        isFreeze: true,
      };
    case 'AddRecord':
      return {
        ...state,
        editingID: 0,
        addNew: true,
      };
    case 'AddRecordCancel':
      return {
        ...state,
        addNew: false,
      };
    case 'AddRecordDone':
      return {
        editingID: 0,
        records: [action.record, ...state.records],
        addNew: false,
        isFreeze: false,
      };
    case 'EditRecord':
      return {
        editingID: action.id,
        records: state.records,
        addNew: false,
        isFreeze: false,
      };
    case 'EditRecordCancel':
      return {
        editingID: 0,
        records: state.records,
        addNew: false,
        isFreeze: false,
      };
    case 'EditRecordDone':
      return {
        editingID: 0,
        records: state.records.map(r =>
          r.id === action.record.id ? action.record : r
        ),
        addNew: false,
        isFreeze: false,
      };
    case 'DeleteRecordDone':
      return {
        editingID: 0,
        records: state.records.filter(r => r.id !== action.id),
        addNew: false,
        isFreeze: false,
      };

    case 'AppendRecordListDone':
      return {
        editingID: 0,
        records: [...state.records, ...action.records],
        addNew: false,
        isFreeze: false,
      };
    case 'Unfreeze':
      return {
        ...state,
        isFreeze: false,
      };
    default:
      return state;
  }
};
