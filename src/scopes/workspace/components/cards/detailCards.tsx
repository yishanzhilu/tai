/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useState, useEffect } from 'react';

import Link, { LinkProps } from 'next/link';
import Head from 'next/head';
import {
  H3,
  Breadcrumbs,
  IBreadcrumbProps,
  Classes,
  Icon,
} from '@yishanzhilubp/core';
import classNames from 'classnames';

import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
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

export const Breadcrumb: React.SFC<IBreadcrumbProps &
  LinkProps> = breadcrumbProps => {
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

const DetailCard: React.FC<{
  detail: IDetail;
  type: 'mission' | 'goal';
}> = ({ detail: initDetail, type }) => {
  const {
    state: {
      currentDetail: { minutes, goalTitle, missionTitle, goalID },
    },
  } = useWorkProfileContext();
  const [isEditing, setIsEditing] = useState(false);
  const [detail, setDetail] = useState(initDetail);
  const { labelName } = detailTypeConfigs[type];
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

  let breadcrumbsItems = [];
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
          icon: <span style={{ marginRight: 5 }}>📜</span>,
          text: missionTitle,
        },
      ];
    } else {
      breadcrumbsItems = [
        {
          icon: <span style={{ marginRight: 5 }}>📜</span>,
          text: missionTitle,
        },
      ];
    }
  } else {
    breadcrumbsItems = [
      {
        icon: <span style={{ marginRight: 5 }}>🎯</span>,
        text: goalTitle,
      },
    ];
  }
  return (
    <div>
      <Head>
        <title>{detail.title} · 移山</title>
      </Head>
      <H3>{labelName}详情</H3>
      <Breadcrumbs breadcrumbRenderer={Breadcrumb} items={breadcrumbsItems} />
      <BaseCard
        goalMissin={detail}
        minutes={minutes}
        options={
          <CardOptions
            type={type}
            id={detail.id}
            status={detail.status}
            onEditClick={() => setIsEditing(true)}
          />
        }
      />
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
