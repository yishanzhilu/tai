/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { H6, Classes, Divider, H3 } from '@yishanzhilubp/core';

import { BasicStatus } from '@/src/model/schemas';
import { P } from '@/src/components/layouts/p';
import { Flex } from '@/src/components/flex';
import { InfoBlock } from '@/src/components/infoBlock';
import { formatMinutes, formatDate } from '@/src/utils/funcs';
import { isNumber } from 'util';

interface ICardBaseProps {
  goalMissin: {
    title: string;
    description: string;
    status: BasicStatus;
    createdAt: string;
    updatedAt: string;
    minutes: number;
  };
  minutes?: number;
}

export const CardBase: React.FC<ICardBaseProps> = ({
  goalMissin: {
    title,
    description,
    createdAt,
    updatedAt,
    minutes: goalMinutes,
  },
  minutes,
}) => {
  return (
    <>
      <H3
        style={{
          margin: '50px auto',
          textAlign: 'center',
          maxWidth: 300,
        }}
      >
        {title}
      </H3>
      <H6 className={Classes.TEXT_MUTED}>描述</H6>
      <P>{description || '无'}</P>
      <Divider style={{ margin: 20 }} />
      <Flex justifyContent="space-between">
        <InfoBlock
          label="累计历程"
          value={formatMinutes(isNumber(minutes) ? minutes : goalMinutes)}
        />
        <InfoBlock label="创建于" value={formatDate(createdAt)} />
        <InfoBlock label="更新于" value={formatDate(updatedAt)} />
      </Flex>
    </>
  );
};
