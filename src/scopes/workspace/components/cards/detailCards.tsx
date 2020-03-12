/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useState, useEffect } from 'react';

import Link, { LinkProps } from 'next/link';
import Head from 'next/head';
import {
  Breadcrumbs,
  IBreadcrumbProps,
  Classes,
  Icon,
  Tag,
} from '@yishanzhilubp/core';
import classNames from 'classnames';

import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import { IGoal, IMission, BasicStatus } from '@/src/model/schemas';
import { TaiCard } from '@/src/components/layouts';
import { STATUS_CONFIG_MAP } from '@/src/utils/constants';

import { CardBase } from './cardBase';
import { CardOptions } from './cardOptions';
import { DetailCardEditing } from './detailCardEditing';

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

type ITaiBreadcrumbProps = IBreadcrumbProps & LinkProps;

const Breadcrumb: React.FC<ITaiBreadcrumbProps> = breadcrumbProps => {
  const classes = classNames(
    Classes.BREADCRUMB,
    {
      [Classes.BREADCRUMB_CURRENT]: breadcrumbProps.current,
      [Classes.DISABLED]: breadcrumbProps.disabled,
    },
    breadcrumbProps.className
  );

  const icon =
    breadcrumbProps.icon != null ? (
      <Icon icon={breadcrumbProps.icon} />
    ) : (
      undefined
    );

  if (breadcrumbProps.href == null && breadcrumbProps.onClick == null) {
    return (
      <span className={classes}>
        {icon}
        {breadcrumbProps.text}
        {breadcrumbProps.children}
      </span>
    );
  }
  return (
    <Link href={breadcrumbProps.href} as={breadcrumbProps.as}>
      <a
        className={classes}
        onClick={breadcrumbProps.disabled ? null : breadcrumbProps.onClick}
        tabIndex={breadcrumbProps.disabled ? null : 0}
        target={breadcrumbProps.target}
      >
        {icon}
        {breadcrumbProps.text}
        {breadcrumbProps.children}
      </a>
    </Link>
  );
};

const StatusTag: React.FC<{ status: BasicStatus }> = ({ status }) => {
  const statusConfig = STATUS_CONFIG_MAP[status || 'doing'];
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

const TaiBreadcrumb: React.FC = () => {
  const {
    state: {
      currentDetail: { goalTitle, missionTitle, goalID },
    },
    computed: { freezed, currentNavStatus },
  } = useWorkProfileContext();
  let breadcrumbsItems: ITaiBreadcrumbProps[] = [];
  if (missionTitle) {
    if (goalTitle) {
      breadcrumbsItems = [
        {
          icon: <span style={{ marginRight: 5 }}>🎯</span>,
          href: `/workspace/goal/[id]`,
          as: `/workspace/goal/${goalID}`,
          text: goalTitle,
        },
        {
          icon: <span style={{ marginRight: 5 }}>📌</span>,
          text: '任务详情',
          href: null,
        },
      ];
    } else {
      breadcrumbsItems = [
        {
          icon: <span style={{ marginRight: 5 }}>📌</span>,
          href: null,
          text: '任务详情',
        },
      ];
    }
  } else {
    breadcrumbsItems = [
      {
        icon: <span style={{ marginRight: 5 }}>🎯</span>,
        href: null,
        text: '目标详情',
      },
    ];
  }
  if (freezed) {
    if (currentNavStatus === 'done') {
      breadcrumbsItems.unshift({
        icon: <span style={{ marginRight: 5 }}>🏆</span>,
        text: '成就',
        href: `/workspace/trophy`,
      });
    } else if (currentNavStatus === 'drop') {
      breadcrumbsItems.unshift({
        icon: <span style={{ marginRight: 5 }}>♻️</span>,
        text: '回收站',
        href: `/workspace/recycle`,
      });
    }
  }

  return (
    <div style={{ whiteSpace: 'nowrap' }}>
      <Breadcrumbs
        breadcrumbRenderer={Breadcrumb}
        items={breadcrumbsItems}
        collapseFrom="start"
      />
    </div>
  );
};

const DetailCard: React.FC<{
  detail: IDetail;
  type: 'mission' | 'goal';
}> = ({ detail: initDetail, type }) => {
  const {
    state: {
      currentDetail: { minutes },
    },
    computed: { currentDetailStatus, statusChangeable },
  } = useWorkProfileContext();
  const [isEditing, setIsEditing] = useState(false);
  const [detail, setDetail] = useState(initDetail);
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
      <TaiBreadcrumb />
      <TaiCard>
        {statusChangeable && (
          <div style={{ float: 'right' }}>
            <CardOptions
              type={type}
              id={detail.id}
              status={currentDetailStatus}
              onEditClick={() => setIsEditing(true)}
            />
          </div>
        )}
        <StatusTag status={currentDetailStatus} />
        <CardBase goalMissin={detail} minutes={minutes} />
      </TaiCard>
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
