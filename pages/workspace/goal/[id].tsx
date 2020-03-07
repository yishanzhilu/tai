/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';

import { IGoal, ITodo, IRecord, IMission } from '@/src/model/schemas';
import { IPageProps, ITaiPageError } from '@/src/model/utils';
import { sf, newTaiError } from '@/src/api';
import { withPageGuard } from '@/src/utils/auth';
import { WorkSpace } from '@/src/scopes/workspace';
import { WorkList } from '@/src/scopes/workspace/workList';
import { GoalCard } from '@/src/scopes/workspace/components/cards/detailCards';
import { MissionSection } from '@/src/scopes/workspace/components/missionSection';

interface IProps extends IPageProps {
  goal: IGoal;
  todos: ITodo[];
  records: IRecord[];
  missions: IMission[];
}

const GoalDetail: NextPage<IProps> = ({ goal, todos, records, missions }) => {
  return (
    <WorkSpace
      newDetail={{
        goalID: goal.id,
        goalTitle: goal.title,
        minutes: goal.minutes,
        missions,
      }}
    >
      <GoalCard goal={goal} />
      <MissionSection />
      <WorkList todos={todos} records={records} />
    </WorkSpace>
  );
};

GoalDetail.getInitialProps = async ctx => {
  resetServerContext();
  let goal: IGoal = null;
  let todos: ITodo[] = [];
  let records: IRecord[] = [];
  let missions: IMission[] = [];
  let err: ITaiPageError = null;
  try {
    [goal, todos, records, missions] = await Promise.all([
      sf<IGoal>(`/goal/${ctx.query.id}`, {}, ctx),
      sf<ITodo[]>(`/todos`, { params: { goalID: ctx.query.id } }, ctx),
      sf<IRecord[]>(`/records`, { params: { goalID: ctx.query.id } }, ctx),
      sf<IMission[]>(`/missions`, { params: { goalID: ctx.query.id } }, ctx),
    ]);
    if (goal.status !== 'doing') {
      err = newTaiError('错误的请求，目标无法查看详情', 400);
    }
  } catch (error) {
    err = error;
    console.log('GoalDetail.getInitialProps', error, err);
  }
  return { goal, todos, records, missions, error: err };
};

export default withPageGuard(GoalDetail);
