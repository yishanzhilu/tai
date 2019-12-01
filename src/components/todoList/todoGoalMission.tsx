/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import Link from 'next/link';

import { ITodo } from '@/src/types/schemas';

export const TodoGoalMission = ({
  todo,
  isLink = false,
}: {
  todo: ITodo;
  isLink?: boolean;
}) => {
  let goalElement;
  let missionElement;
  if (todo.goalID) {
    goalElement = isLink ? (
      <Link href={`/workspace/goal/${todo.goalID}`}>
        <a>{todo.goalTitle}</a>
      </Link>
    ) : (
      todo.goalTitle
    );
  }
  if (todo.missionID) {
    missionElement = isLink ? (
      <Link href={`/workspace/goal/${todo.missionID}`}>
        <a>{todo.missionTitle}</a>
      </Link>
    ) : (
      todo.missionTitle
    );
  }
  if (goalElement || goalElement) {
    return (
      <div>
        {goalElement}
        {todo.goalID && todo.missionID ? ' / ' : ''}
        {missionElement}
      </div>
    );
  }
  return <div>独立事项</div>;
};
