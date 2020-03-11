/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useState, Dispatch, SetStateAction } from 'react';

import { ITodo, IRecord } from '@/src/model/schemas';
import { noop } from '@/src/utils/funcs';

import { TodoList } from './todoList';
import { RecordList } from './recordList';
import { useWorkProfileContext } from '../../global/workProfileContext';

interface IWorkListState {
  // when finish todo, user can easily create a record
  // based on this todo
  finishedTodo?: ITodo;
}

type IWorkListAction = Dispatch<SetStateAction<IWorkListState>>;

export const WorkListContext = React.createContext<
  [IWorkListState, IWorkListAction]
>([{ finishedTodo: null }, noop]);

export const useWorkListContext = () => {
  const context = React.useContext(WorkListContext);
  if (!context) {
    // this is especially useful in TypeScript
    // so you don't need to be checking for null all the time
    throw new Error('WorkListContext must be used within a context.');
  }
  return context;
};

/**
 * WorkList is used to manage todos and recordsm it has a
 * TodoList and a RecordList.
 * And It also has a shared context value finishedTodo,
 * which is used to pass info to record list so user can create new record
 * based on the finished todo.
 */
export const WorkList: React.FC<{ todos: ITodo[]; records: IRecord[] }> = ({
  todos,
  records,
}) => {
  const [workListState, setWorkListState] = useState<IWorkListState>({
    finishedTodo: null,
  });
  const {
    computed: { freezed },
  } = useWorkProfileContext();
  return (
    <WorkListContext.Provider value={[workListState, setWorkListState]}>
      {!freezed && <TodoList todos={todos} />}
      <RecordList records={records} />
    </WorkListContext.Provider>
  );
};
