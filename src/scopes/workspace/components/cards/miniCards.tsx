/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';
import { Classes, Card, Text } from '@yishanzhilubp/core';

import { IGoal, IMission } from '@/src/model/schemas';
import { Flex } from '@/src/components/flex';

import { CardOptions } from './cardOptions';
import { BaseCard } from './baseCard';

const MiniGoalCardMissions: React.FC<{ missions: IMission[] }> = ({
  missions,
}) => {
  if (!missions) {
    return null;
  }
  const s: React.CSSProperties = {
    flexGrow: 1,
    padding: 10,
  };
  return (
    <div>
      <p className={Classes.TEXT_MUTED}>子任务</p>
      <Flex wrap>
        {missions.map(m => (
          <Card style={s} key={m.id} className={Classes.TEXT_SMALL}>
            <strong>{m.title}</strong>
            <Text ellipsize>{m.description}</Text>
          </Card>
        ))}
      </Flex>
    </div>
  );
};

export const MiniGoalCard: React.FC<{ goal: IGoal }> = ({ goal }) => {
  return (
    <BaseCard
      title={goal.title}
      status={goal.status}
      description={goal.description}
      options={
        <CardOptions type="goal" id={goal.id} status={goal.status} mini />
      }
    >
      <MiniGoalCardMissions missions={goal.missions} />
    </BaseCard>
  );
};

export const MiniMissionCard: React.FC<{ mission: IMission }> = ({
  mission,
}) => {
  return (
    <BaseCard
      title={mission.title}
      status={mission.status}
      description={mission.description}
      options={
        <CardOptions
          type="mission"
          id={mission.id}
          status={mission.status}
          mini
        />
      }
    />
  );
};
