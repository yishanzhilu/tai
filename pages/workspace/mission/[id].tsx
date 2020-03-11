/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';

import { ITodo, IRecord, IMission } from '@/src/model/schemas';
import { IPageProps } from '@/src/model/utils';
import { sf } from '@/src/api';
import { withPageGuard } from '@/src/utils/auth';
import { WorkList } from '@/src/scopes/workspace/workList';
import { WorkSpace } from '@/src/scopes/workspace';
import { MissionCard } from '@/src/scopes/workspace/components/cards/detailCards';

interface IProps extends IPageProps {
  mission: IMission;
  todos: ITodo[];
  records: IRecord[];
}

const MissionDetail: NextPage<IProps> = ({ mission, todos, records }) => {
  return (
    <WorkSpace
      newDetail={{
        minutes: mission.minutes,
        goalID: mission.goalID,
        goalTitle: mission.goalTitle,
        goalStatus: mission.goalStatus,
        missionStatus: mission.status,
        missionID: mission.id,
        missionTitle: mission.title,
        missions: [],
      }}
    >
      <MissionCard mission={mission} />
      <WorkList todos={todos} records={records} />
    </WorkSpace>
  );
};

MissionDetail.getInitialProps = async ctx => {
  let mission: IMission = null;
  let todos: ITodo[] = [];
  let records: IRecord[] = [];
  try {
    [mission, todos, records] = await Promise.all([
      sf<IMission>(`/mission/${ctx.query.id}`, {}, ctx),
      sf<ITodo[]>(`/todos`, { params: { missionID: ctx.query.id } }, ctx),
      sf<IRecord[]>(`/records`, { params: { missionID: ctx.query.id } }, ctx),
    ]);
  } catch (error) {
    return { mission, todos, records, error };
  }
  return { mission, todos, records };
};

export default withPageGuard(MissionDetail);
