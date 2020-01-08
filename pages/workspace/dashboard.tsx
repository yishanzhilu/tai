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

const Dashboard: NextPage = () => {
  return (
    <WorkspaceLayout>
      <TodoList todos={[]} />
      <RecordList initialRecords={[]} initialRecordsNextURL=""/>
    </WorkspaceLayout>
  );
};

// Dashboard.getInitialProps = async ctx => {
//   const defaultProps = {
//     todos: [],
//   };
//   const { token } = nextCookie(ctx);
//   if (!token) {
//     redirect('/index', ctx);
//     return defaultProps;
//   }

//   try {
//     axios.get('');
//     return defaultProps;
//   } catch (error) {
//     // Implementation or Network error
//     redirect('/index', ctx, true);
//     return defaultProps;
//   }
// };

export default Dashboard;
