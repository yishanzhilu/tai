/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { NextPage } from 'next';

import { TodoList } from '@/src/components/todoList';
import { RecordList } from '@/src/components/recordList';
import { useServerRequest } from '@/src/api';
import { ITodo, IRecord } from '@/src/model/schemas';
import { redirect } from '@/src/utils/funcs';
import { FinishedTodoContext } from '@/src/contexts/finishedTodo';
import { TaiLayout } from '@/src/layout';
import { GoalList } from '@/src/components/goalList';

interface IDashboardProps {
  initialTodos?: ITodo[];
  initialRecords?: IRecord[];
  initialRecordsNextURL: string;
}

const Dashboard: NextPage<IDashboardProps> = ({
  initialTodos = [],
  initialRecords = [],
  initialRecordsNextURL,
}): React.ReactElement => {
  const [finishedTodo, setFinishedTodo] = React.useState({});
  return (
    <TaiLayout>
      <FinishedTodoContext.Provider value={{ finishedTodo, setFinishedTodo }}>
        <TodoList todos={initialTodos} />
        <GoalList />
        <RecordList
          initialRecords={initialRecords}
          initialRecordsNextURL={initialRecordsNextURL}
        />
      </FinishedTodoContext.Provider>
    </TaiLayout>
  );
};

Dashboard.getInitialProps = async context => {
  try {
    const [todoRes, recordRes] = await Promise.all([
      useServerRequest<{ todos: ITodo[] }>(
        '/workspace/todos',
        {
          params: {
            status: 'doing',
          },
        },
        context
      ),
      useServerRequest<{ data: IRecord[]; nextURL: string }>(
        '/workspace/records',
        {},
        context
      ),
    ]);

    return {
      initialTodos: todoRes.todos,
      initialRecords: recordRes.data,
      initialRecordsNextURL: recordRes.nextURL,
    };
  } catch (error) {
    redirect('/error');

    return { initialTodos: [], initialRecords: [], initialRecordsNextURL: '' };
  }
};

export default Dashboard;
