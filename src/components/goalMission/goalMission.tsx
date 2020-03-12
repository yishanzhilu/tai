/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import Link from 'next/link';
import { Tag } from '@yishanzhilubp/core';

import { IGoalMission } from '@/src/model/schemas';
import { Span } from '../layouts/p';
// import { P } from '../layouts/p';

export const GoalMission = ({
  goalMission,
  emptyText = '无',
  isLink = false,
  isTag = true,
  inline = false,
}: {
  goalMission: IGoalMission;
  isLink?: boolean;
  isTag?: boolean;
  emptyText?: string;
  inline?: boolean;
}) => {
  let goalElement: React.ReactNode;
  if (goalMission.goalTitle) {
    const goalTitle = <Span>{goalMission.goalTitle}</Span>;
    goalElement = isTag ? (
      <Tag icon={<span>🎯</span>} interactive>
        {goalTitle}
      </Tag>
    ) : (
      goalTitle
    );
    if (isLink) {
      goalElement = (
        <Link
          as={`/workspace/goal/${goalMission.goalID}`}
          href="/workspace/goal/[id]"
        >
          <a>{goalElement}</a>
        </Link>
      );
    }
  }

  let missionElement: React.ReactNode;
  if (goalMission.missionTitle) {
    const missionTitle = <Span>{goalMission.missionTitle}</Span>;
    missionElement = isTag ? (
      <Tag icon={<span>📌</span>} interactive>
        {missionTitle}
      </Tag>
    ) : (
      missionTitle
    );
    if (isLink) {
      missionElement = (
        <Link
          as={`/workspace/mission/${goalMission.missionID}`}
          href="/workspace/mission/[id]"
        >
          <a>{missionElement}</a>
        </Link>
      );
    }
  }
  if (goalElement || missionElement) {
    const content = (
      <>
        {goalElement}
        {goalMission.goalTitle && goalMission.missionTitle ? ' / ' : ''}
        {missionElement}
      </>
    );
    if (!isTag) {
      return <div style={{ minWidth: 100 }}>{content}</div>;
    }
    return (
      <div
        className="goal-mission-link"
        style={{ display: inline ? 'inline' : 'block' }}
      >
        {content}
        <style jsx>{`
          .goal-mission-link :global(a:hover) {
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  }
  if (isTag) {
    return <Tag>{emptyText}</Tag>;
  }
  return <div style={{ minWidth: 100 }}>{emptyText}</div>;
};
