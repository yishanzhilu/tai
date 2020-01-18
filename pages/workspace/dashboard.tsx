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

const Dashboard: NextPage<IPageProps> = () => {
  return (
    <WorkspaceLayout>
      <TodoList todos={[]} />
      <RecordList initialRecords={[]} initialRecordsNextURL="" />
    </WorkspaceLayout>
  );
};

export default withPageGuard(Dashboard, true);
