/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useState, useEffect } from 'react';

import Head from 'next/head';
import { Divider, H3 } from '@yishanzhilubp/core';

import { InfoBlock } from '@/src/components/infoBlock';
import { Flex } from '@/src/components/flex';
import { formatMinutes, formatDate } from '@/src/utils/funcs';
import { useWorkSpaceContext } from '@/src/scopes/workspace';
import { BasicStatus, IGoal, IMission } from '@/src/model/schemas';

import { BaseCard } from './baseCard';
import { CardOptions } from './cardOptions';
import { DetailCardEditing } from './detailCardEditing';
import { detailTypeConfigs } from './configs';

export interface IDetail {
  id: number;
  title: string;
  status: BasicStatus;
  description: string;
  minutes: number;
  goalID?: number;
  createdAt: string;
  updatedAt: string;
}

const DetailCard: React.FC<{
  detail: IDetail;
  type: 'mission' | 'goal';
}> = ({ detail: initDetail, type }) => {
  const {
    state: { minutes },
  } = useWorkSpaceContext();
  const [isEditing, setIsEditing] = useState(false);
  const [detail, setDetail] = useState(initDetail);
  const { labelName, emoji } = detailTypeConfigs[type];
  useEffect(() => {
    setDetail(initDetail);
  }, [initDetail.id]);
  if (isEditing) {
    return (
      <DetailCardEditing
        detail={detail}
        type={type}
        setDetail={setDetail}
        onStopEditing={() => setIsEditing(false)}
      />
    );
  }
  return (
    <div>
      <Head>
        <title>{detail.title} · 移山</title>
      </Head>
      <H3>
        {emoji} {labelName}详情
      </H3>
      <BaseCard
        title={detail.title}
        status={detail.status}
        description={detail.description}
        options={
          <CardOptions
            type={type}
            id={detail.id}
            status={detail.status}
            onEditClick={() => setIsEditing(true)}
          />
        }
      >
        <Divider style={{ margin: '15px 0' }} />
        <Flex justifyContent="space-between">
          <InfoBlock label="累计时长" value={formatMinutes(minutes)} />
          <InfoBlock label="创建于" value={formatDate(detail.createdAt)} />
          <InfoBlock label="更新于" value={formatDate(detail.updatedAt)} />
        </Flex>
      </BaseCard>
    </div>
  );
};

export const GoalCard: React.FC<{
  goal: IGoal;
}> = ({ goal }) => {
  return <DetailCard detail={goal} type="goal" />;
};

export const MissionCard: React.FC<{
  mission: IMission;
}> = ({ mission }) => {
  return <DetailCard detail={mission} type="mission" />;
};
