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
import { TaiList } from '@/src/components/layouts/taiList';
import { IGoal, IMission } from '@/src/model/schemas';
import { sf, HandleError } from '@/src/api';
import { IPageProps } from '@/src/model/utils';
import {
  MiniGoalCard,
  MiniMissionCard,
} from '@/src/scopes/workspace/components/cards/miniCards';

interface IPlan extends IPageProps {
  goals: IGoal[];
  missions: IMission[];
}

const Trophy: NextPage<IPlan> = ({ goals, missions }) => {
  return (
    <WorkSpace>
      <Head>
        <title> 成就 · 移山</title>
      </Head>
      <H3>🏆 成就</H3>
      <p className={Classes.TEXT_MUTED}>完成了的目标和任务</p>
      <TaiList<IGoal>
        title="目标"
        showEmptyPlaceholder
        items={goals}
        render={item => <MiniGoalCard goal={item} />}
      />
      <TaiList<IMission>
        title="独立任务"
        showEmptyPlaceholder
        items={missions}
        render={item => <MiniMissionCard mission={item} />}
      />
    </WorkSpace>
  );
};

Trophy.getInitialProps = async ctx => {
  try {
    const [goals, missions] = await Promise.all([
      sf<IGoal[]>('/goals?status=done&missions=true', {}, ctx),
      sf<IMission[]>('/missions?status=done', {}, ctx),
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

export default withPageGuard(Trophy);
