/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import * as React from 'react';
import { NextPage } from 'next';

import { WorkspaceLayout } from '@/src/layout';
import { TodoList } from '@/src/components/todoList';
import { RecordList } from '@/src/components/recordList';
import { IPageProps } from '@/src/model/utils';
import { withPageGuard } from '@/src/utils/pageGuard';
import { ITodo } from '@/src/model/schemas';
import { sf } from '@/src/api';

interface IProps extends IPageProps {
  todos: ITodo[];
}

const Dashboard: NextPage<IProps> = () => {
  return (
    <WorkspaceLayout>
      <TodoList todos={[]} />
      <RecordList initialRecords={[]} initialRecordsNextURL="" />
    </WorkspaceLayout>
  );
};

Dashboard.getInitialProps = async (ctx) => {
  const todos = await sf<Array<ITodo>>('/tasks', {} ,ctx);
  return {
    todos,
  }
}

export default withPageGuard(Dashboard, true);
