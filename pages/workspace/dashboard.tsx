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
import { useGetInitialPropsGuard } from '@/src/utils/hooks';
import { IPageProps } from '@/src/model/utils';
import TaiError from '@/pages/_error';

const Dashboard: NextPage<IPageProps> = ({ error }) => {
  if (error) {
    return <TaiError statusCode={error.statusCode} title={error.title} />;
  }
  return (
    <WorkspaceLayout>
      <TodoList todos={[]} />
      <RecordList initialRecords={[]} initialRecordsNextURL="" />
    </WorkspaceLayout>
  );
};

Dashboard.getInitialProps = async ctx => {
  const { error } = useGetInitialPropsGuard(ctx);
  return {
    error,
  };
};

export default Dashboard;
