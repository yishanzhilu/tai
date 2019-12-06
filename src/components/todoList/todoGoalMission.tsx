/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import Link from 'next/link';
import { Tag } from '@yishanzhilu/blueprint-core';

import { IGoalMission } from '@/src/types/schemas';

export const TodoGoalMission = ({
  goalMission,
  emptyText = '独立事项',
  isLinkTag = false,
  isTag = true,
}: {
  goalMission: IGoalMission;
  isLinkTag?: boolean;
  isTag?: boolean;
  emptyText?: string;
}) => {
  let goalElement: React.ReactNode;
  let missionElement: React.ReactNode;
  if (goalMission.goalID) {
    goalElement = isLinkTag ? (
      <Link href={`/workspace/goal/${goalMission.goalID}`}>
        <a>
          <Tag icon={<span>🎯</span>} interactive>
            {goalMission.goalTitle}
          </Tag>
        </a>
      </Link>
    ) : (
      goalMission.goalTitle
    );
  }
  if (goalMission.missionID) {
    missionElement = isLinkTag ? (
      <Link href={`/workspace/goal/${goalMission.missionID}`}>
        <a>
          <Tag icon={<span>📜</span>} interactive>
            {goalMission.missionTitle}
          </Tag>
        </a>
      </Link>
    ) : (
      goalMission.missionTitle
    );
  }
  if (goalElement || missionElement) {
    const content = (
      <>
        {goalElement}
        {goalMission.goalID && goalMission.missionID ? ' / ' : ''}
        {missionElement}
      </>
    );
    if (isLinkTag) {
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
      return <Tag>{content}</Tag>;
    }
    return <div>{content}</div>;
  }
  if (isTag) {
    return <Tag>{emptyText}</Tag>;
  }
  return <div>{emptyText}</div>;
};
