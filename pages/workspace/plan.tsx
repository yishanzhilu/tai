/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';
import { Card, Classes } from '@yishanzhilubp/core';

import { WorkSpace } from '@/src/scopes/workspace';
import { withPageGuard } from '@/src/utils/auth';
import { TaiList } from '@/src/components/layouts/taiList';
import { IGoal, IMission } from '@/src/model/schemas';
import { sf, HandleError } from '@/src/api';
import { IPageProps } from '@/src/model/utils';
import { PlanGoalCard } from '@/src/scopes/workspace/components/cards/planGoalCard';

interface IPlan extends IPageProps {
  goals: IGoal[];
  missions: IMission[];
}

const Plan: NextPage<IPlan> = ({ goals, missions }) => {
  return (
    <WorkSpace>
      <p className={Classes.TEXT_MUTED}>规划，将来要完成的目标和任务</p>
      <TaiList title="目标">
        {goals.length ? (
          goals.map(g => (
            <li key={g.id}>
              <PlanGoalCard goal={g} />
            </li>
          ))
        ) : (
          <li>
            <Card>
              <div>暂无</div>
            </Card>
          </li>
        )}
      </TaiList>
      <TaiList title="独立任务">
        {missions.length ? (
          missions.map(m => (
            <li key={m.id}>
              <Card>
                <div>{m.title}</div>
              </Card>
            </li>
          ))
        ) : (
          <li>
            <Card>
              <div>暂无</div>
            </Card>
          </li>
        )}
      </TaiList>
    </WorkSpace>
  );
};

Plan.getInitialProps = async ctx => {
  try {
    const [goals, missions] = await Promise.all([
      sf<IGoal[]>('/goals?status=todo&missions=true', {}, ctx),
      sf<IMission[]>('/missions?status=todo', {}, ctx),
    ]);
    return {
      goals,
      missions,
    };
  } catch (error) {
    return {
      goals: [],
      missions: [],
      error: HandleError(error),
    };
  }
};

export default withPageGuard(Plan);
