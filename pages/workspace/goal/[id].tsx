/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';

import { IGoal, ITodo, IRecord } from '@/src/model/schemas';
import { IPageProps, ITaiPageError } from '@/src/model/utils';
import { sf, HandleError } from '@/src/api';
import { withPageGuard } from '@/src/utils/auth';
import { WorkSpace } from '@/src/scopes/workspace';
import { WorkList } from '@/src/scopes/workspace/workList';
import { GoalCard } from '@/src/scopes/workspace/components/cards/detailCards';

interface IProps extends IPageProps {
  goal: IGoal;
  todos: ITodo[];
  records: IRecord[];
}

const GoalDetail: NextPage<IProps> = ({ goal, todos, records }) => {
  return (
    <WorkSpace
      initialState={{
        minutes: goal.minutes,
        goalMission: {
          goalID: goal.id,
          goalTitle: goal.title,
        },
      }}
    >
      <GoalCard goal={goal} />
      <WorkList todos={todos} records={records} />
    </WorkSpace>
  );
};

GoalDetail.getInitialProps = async ctx => {
  let goal: IGoal = null;
  let todos: ITodo[] = [];
  let records: IRecord[] = [];
  let err: ITaiPageError = null;
  try {
    [goal, todos, records] = await Promise.all([
      sf<IGoal>(`/goal/${ctx.query.id}`, {}, ctx),
      sf<ITodo[]>(`/todos`, { params: { goalID: ctx.query.id } }, ctx),
      sf<IRecord[]>(`/records`, { params: { goalID: ctx.query.id } }, ctx),
    ]);
    if (goal.status !== 'doing') {
      err = { code: 400, message: '错误的请求，目标无法查看详情' };
    }
  } catch (error) {
    err = HandleError(error);
  }
  return { goal, todos, records, error: err };
};

export default withPageGuard(GoalDetail);
