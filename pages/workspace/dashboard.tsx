/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { NextPage } from 'next';

import { withGlobalState } from '@/src/store/global';
import { TodoList } from '@/src/components/todoList';
import { useServerRequest } from '@/src/api';
import { ITodo } from '@/src/types/schemas';
import { redirect } from '@/src/utils/funcs';

interface IDashboardInitialData {
  todos: ITodo[];
}

interface IDashboardProps {
  initialData: IDashboardInitialData;
}

const Dashboard: NextPage<IDashboardProps> = ({
  initialData,
}): React.ReactElement => {
  console.debug('Dashboard | render', initialData);

  return <TodoList todos={initialData ? initialData.todos : []} />;
};

Dashboard.getInitialProps = async context => {
  let initialData: IDashboardInitialData = { todos: [] };
  try {
    initialData = await useServerRequest<IDashboardInitialData>(
      '/workspace/todos',
      context
    );
    console.debug('Dashboard | initialData', initialData);

    return { initialData };
  } catch (error) {
    redirect('/error');
    console.error('Dashboard | initialData', error);

    return { initialData };
  }
};

export default withGlobalState(Dashboard);
