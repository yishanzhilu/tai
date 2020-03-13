/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import Head from 'next/head';
import { Breadcrumbs, Tag } from '@yishanzhilubp/core';

import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import { IGoal, IMission, BasicStatus } from '@/src/model/schemas';
import { Span } from '@/src/components/layouts/p';
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
  let breadcrumbsItems = [];
  if (missionTitle) {
    if (goalTitle) {
      breadcrumbsItems = [
        {
          tagName: 'span',
          icon: <span style={{ marginRight: 5 }}>🎯</span>,
          text: (
            <Link href="/workspace/goal/[id]" as={`/workspace/goal/${goalID}`}>
              <a>
                <Span ellipsize maxWidth={150}>
                  {goalTitle}
                </Span>
              </a>
            </Link>
          ),
        },
        {
          tagName: 'span',
          icon: <span style={{ marginRight: 5 }}>📌</span>,
          text: (
            <Span ellipsize maxWidth={150}>
              {missionTitle}
            </Span>
          ),
        },
      ];
    } else {
      breadcrumbsItems = [
        {
          icon: <span style={{ marginRight: 5 }}>📌</span>,
          tagName: 'span',
          text: (
            <Span ellipsize maxWidth={150}>
              {missionTitle}
            </Span>
          ),
        },
      ];
    }
  } else if (goalTitle) {
    breadcrumbsItems = [
      {
        icon: <span style={{ marginRight: 5 }}>🎯</span>,
        tagName: 'span',
        text: (
          <Span ellipsize maxWidth={150}>
            {goalTitle}
          </Span>
        ),
      },
    ];
  }
  if (freezed) {
    if (currentNavStatus === 'done') {
      breadcrumbsItems.unshift({
        icon: <span style={{ marginRight: 5 }}>🏆</span>,
        tagName: 'span',
        text: (
          <Link href="/workspace/trophy">
            <a>成就</a>
          </Link>
        ),
      });
    } else if (currentNavStatus === 'drop') {
      breadcrumbsItems.unshift({
        icon: <span style={{ marginRight: 5 }}>♻️</span>,
        tagName: 'span',
        text: (
          <Link href="/workspace/recycle">
            <a>回收站</a>
          </Link>
        ),
      });
    }
  }

  return (
    <div style={{ whiteSpace: 'nowrap' }}>
      <Breadcrumbs items={breadcrumbsItems} collapseFrom="start" />
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
