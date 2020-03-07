/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { Tag, H6, Classes, Divider } from '@yishanzhilubp/core';

import { BasicStatus } from '@/src/model/schemas';
import { STATUS_CONFIG_MAP } from '@/src/utils/constants';
import { TaiCard } from '@/src/components/layouts';
import { P } from '@/src/components/layouts/p';
import { Flex } from '@/src/components/flex';
import { InfoBlock } from '@/src/components/infoBlock';
import { formatMinutes, formatDate } from '@/src/utils/funcs';
import { isNumber } from 'util';

const StatusTag: React.FC<{ status: BasicStatus }> = ({ status }) => {
  const statusConfig = STATUS_CONFIG_MAP[status];
  return (
    <Tag
      style={{
        backgroundColor: statusConfig.color,
        color: 'white',
        fontSize: 10,
        height: 18,
        minHeight: 18,
      }}
    >
      {statusConfig.text}
    </Tag>
  );
};

export const BaseCard: React.FC<{
  options?: React.ReactNode;
  goalMissin: {
    title: string;
    status: BasicStatus;
    description: string;
    createdAt: string;
    updatedAt: string;
    minutes: number;
  };
  minutes?: number;
}> = ({
  options,
  goalMissin: {
    title,
    status,
    description,
    createdAt,
    updatedAt,
    minutes: goalMinutes,
  },
  minutes,
  children,
}) => {
  return (
    <TaiCard>
      <div style={{ float: 'right' }}>{options}</div>
      <H6>{title}</H6>
      <p>
        <StatusTag status={status} />
      </p>

      {description && (
        <>
          <p className={Classes.TEXT_MUTED}>描述</p>
          <P>{description}</P>
        </>
      )}
      <Divider />
      <Flex justifyContent="space-between">
        <InfoBlock
          label="累计时长"
          value={formatMinutes(isNumber(minutes) ? minutes : goalMinutes)}
        />
        <InfoBlock label="创建于" value={formatDate(createdAt)} />
        <InfoBlock label="更新于" value={formatDate(updatedAt)} />
      </Flex>
      {children}
    </TaiCard>
  );
};
