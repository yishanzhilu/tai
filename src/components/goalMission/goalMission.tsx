/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import Link from 'next/link';
import { Tag } from '@yishanzhilubp/core';

import { IGoalMission } from '@/src/model/schemas';

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
  let missionElement: React.ReactNode;
  if (goalMission.goalID) {
    goalElement = isTag ? (
      <Tag icon={<span>🎯</span>} interactive>
        {goalMission.goalTitle}
      </Tag>
    ) : (
      goalMission.goalTitle
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
  if (goalMission.missionID) {
    missionElement = isTag ? (
      <Tag icon={<span>📜</span>} interactive>
        {goalMission.missionTitle}
      </Tag>
    ) : (
      goalMission.missionTitle
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
        {goalMission.goalID && goalMission.missionID ? ' / ' : ''}
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
