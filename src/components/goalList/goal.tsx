/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import classNames from 'classnames';

import {
  Card,
  H5,
  Button,
  Classes,
  Divider,
  H6,
} from '@yishanzhilubp/core';
import { Flex } from '../flex';
import { IGoal, IMission } from '@/src/model/schemas';

function GoalSubMission({ mission }: { mission: IMission }) {
  return (
    <div
      key={mission.id}
      className={classNames('goal-sub-mission', Classes.INTERACTIVE)}
    >
      <H6>{mission.title}</H6>
      <span className={Classes.TEXT_MUTED}>累计 {mission.minutes} 小时</span>
      <div className="description">{mission.description}</div>
      <style jsx>{`
        .goal-sub-mission {
          width: 45%;
          min-width: 300px;
        }
        .goal-sub-mission .description {
          margin: 5px 0 15px;
        }
      `}</style>
    </div>
  );
}

function GoalSubMissions({ missions }: { missions: IMission[] }) {
  return (
    <div className="goal-sub-missions">
      <Flex justifyContent="space-between" wrap>
        {missions.map(m => (
          <GoalSubMission key={m.id} mission={m} />
        ))}
      </Flex>
      <style jsx>{`
        .goal-sub-missions {
          margin: 15px 0 0;
        }
      `}</style>
    </div>
  );
}

interface IProps {
  goal: IGoal;
}

export function Goal({ goal }: IProps) {
  return (
    <Card>
      <Flex childMargin={15}>
        <img
          src="/static/layout/logo.png"
          className={classNames(Classes.ELEVATION_2, 'goal-logo')}
          alt="goal-logo"
          width="55"
          height="55"
        />
        <div style={{ flexGrow: 1 }}>
          <H5>{goal.title}</H5>
          <span className={Classes.TEXT_MUTED}>累计 {goal.minutes} 小时</span>
        </div>
        <Button icon="more" minimal style={{ alignSelf: 'self-start' }} />
      </Flex>
      <div className={classNames('goal-description')}>{goal.description}</div>
      <Divider />
      <GoalSubMissions missions={goal.missions} />
      <style jsx>{`
        .goal-logo {
          border-radius: 10px;
        }
        .goal-description {
          margin: 15px 0;
        }
      `}</style>
    </Card>
  );
}

export function IndependentMissions({ missions }) {
  return (
    <Card>
      <Flex childMargin={15}>
        <div style={{ flexGrow: 1 }}>
          <H5>独立任务</H5>
        </div>
      </Flex>
      <GoalSubMissions missions={missions} />
    </Card>
  );
}
