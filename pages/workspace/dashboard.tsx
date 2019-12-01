/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { NextPage } from 'next';
import Error from 'next/error'
import faker from 'faker';

import { withGlobalState } from '@/src/store/global';
import { TodoList } from '@/src/components/todoList';
import {  useServerRequest, axios } from '@/src/api';
import { ITodo } from '@/src/types/schemas';
import { ErrorBoundary } from '@/src/components/errors/error-handling';

interface IDashboardInitialData {
  todos: ITodo[];
}

interface IDashboardProps {
  initialData: IDashboardInitialData;
}

const Dashboard: NextPage<IDashboardProps> = ({
  initialData,
}): React.ReactElement => {

  const onUpdateDataTodos = (todos: ITodo[]) => {
    console.debug('Dashboard | onUpdateDataTodos', todos);
  };

  return (
    <ErrorBoundary fallback={<Error statusCode={500} />}>
      <TodoList
        todos={initialData.todos || []}
        onUpdateDataTodos={onUpdateDataTodos}
      />
      <style jsx>{`
        li {
          margin: 5px 0;
        }
      `}</style>
    </ErrorBoundary>
  );
};

Dashboard.getInitialProps = async context => {
  const initialData = await useServerRequest<IDashboardInitialData>(
    '/workspace/todos',
    context
  );
  console.debug('Dashboard | initialData', initialData);

  return { initialData };
};

export default withGlobalState(Dashboard);
