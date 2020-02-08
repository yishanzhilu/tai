/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { H6, Classes, Card, Text } from '@yishanzhilubp/core';

import { TaiCard } from '@/src/components/layouts';
import { IGoal, IMission } from '@/src/model/schemas';
import { CardOptions } from './cardOptions';
import { noop } from '@/src/utils/funcs';
import { Flex } from '@/src/components/flex';

const Missions: React.FC<{ missions: IMission[] }> = ({ missions }) => {
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
      <Flex
        justifyContent="space-between"
        wrap
        childMargin={5}
        alignItems="flex-start"
      >
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

export const PlanGoalCard: React.FC<{ goal: IGoal }> = ({ goal }) => {
  return (
    <TaiCard>
      <div style={{ float: 'right' }}>
        <CardOptions type="goal" id={goal.id} onEditClick={noop} />
      </div>
      <H6>{goal.title}</H6>
      {/* <Flex justifyContent="space-between">
      </Flex> */}
      {goal.description && (
        <>
          <p className={Classes.TEXT_MUTED}>目标描述</p>
          <p>{goal.description}</p>
        </>
      )}
      <Missions missions={goal.missions} />
    </TaiCard>
  );
};
