/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Classes, H3 } from '@yishanzhilubp/core';

import { WorkSpace } from '@/src/scopes/workspace';
import { withPageGuard } from '@/src/utils/auth';
import { IGoal, IMission } from '@/src/model/schemas';
import { sf, HandleError } from '@/src/api';
import { IPageProps } from '@/src/model/utils';
import {
  MiniGoalCard,
  MiniMissionCard,
} from '@/src/scopes/workspace/components/cards/miniCards';
import { TaiGrid } from '@/src/components/layouts/taiGrid';

interface IPlan extends IPageProps {
  goals: IGoal[];
  missions: IMission[];
}

const Recycle: NextPage<IPlan> = ({ goals, missions }) => {
  return (
    <WorkSpace>
      <Head>
        <title> 回收站 · 移山</title>
      </Head>
      <H3>♻️ 回收站</H3>
      <p className={Classes.TEXT_MUTED}>放弃的目标和任务，可以重新开始</p>
      <TaiGrid title="目标" isEmpty={goals.length === 0}>
        {goals.map(item => (
          <MiniGoalCard key={item.id} goal={item} />
        ))}
      </TaiGrid>
      <TaiGrid title="独立任务" isEmpty={missions.length === 0}>
        {missions.map(item => (
          <MiniMissionCard key={item.id} mission={item} />
        ))}
      </TaiGrid>
    </WorkSpace>
  );
};

Recycle.getInitialProps = async ctx => {
  try {
    const [goals, missions] = await Promise.all([
      sf<IGoal[]>('/goals?status=drop&missions=true', {}, ctx),
      sf<IMission[]>('/missions?status=drop', {}, ctx),
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

export default withPageGuard(Recycle);
