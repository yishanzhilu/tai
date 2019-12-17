/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import Link from 'next/link';
import { Tag } from '@yishanzhilu/blueprint-core';

import { IGoalMission } from '@/src/model/schemas';

export const GoalMission = ({
  goalMission,
  emptyText = '独立事项',
  isLink = false,
  isTag = true,
}: {
  goalMission: IGoalMission;
  isLink?: boolean;
  isTag?: boolean;
  emptyText?: string;
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
        <Link href={`/workspace/goal/${goalMission.goalID}`}>
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
        <Link href={`/workspace/mission/${goalMission.missionID}`}>
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
      <div className="goal-mission-link">
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
