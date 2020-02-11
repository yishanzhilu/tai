/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { Tag, H6, Classes } from '@yishanzhilubp/core';

import { BasicStatus } from '@/src/model/schemas';
import { STATUS_CONFIG_MAP } from '@/src/utils/constants';
import { TaiCard } from '@/src/components/layouts';

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
  title?: string;
  status: BasicStatus;
  description?: string;
}> = ({ options, title, status, description, children }) => {
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
          <p>{description}</p>
        </>
      )}
      {children}
      <style jsx>{`
        p {
          word-break: break-all;
          white-space: pre-wrap;
        }
      `}</style>
    </TaiCard>
  );
};
