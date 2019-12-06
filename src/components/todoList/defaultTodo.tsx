/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import Link from 'next/link';
import { Keys, Icon } from '@yishanzhilu/blueprint-core';

import { ITodo } from '@/src/types/schemas';
import { TodoGoalMission } from './todoGoalMission';

interface IProps {
  todo: ITodo;
  onClickFinish: () => void;
  onClickContent: () => void;
}

export const DefaultTodo = ({
  onClickFinish,
  onClickContent,
  todo,
}: IProps) => {
  const [showTick, setShowTick] = React.useState(false);
  return (
    <div className="todo-text">
      <span
        tabIndex={0}
        className="circle"
        onMouseOver={() => setShowTick(true)}
        onMouseLeave={() => setShowTick(false)}
        onClick={onClickFinish}
        onKeyDown={e => {
          if (e.which === Keys.ENTER) {
            onClickFinish();
          }
        }}
      >
        {showTick ? <Icon icon="tick-circle" /> : <Icon icon="circle" />}
      </span>
      <span
        className="content"
        onClick={onClickContent}
        tabIndex={0}
        onKeyDown={e => {
          if (e.which === Keys.ENTER) {
            onClickContent();
          }
        }}
      >
        {todo.content}
      </span>
      <TodoGoalMission goalMission={todo} isLinkTag />
      <style jsx>
        {`
          .todo-text {
            display: flex;
          }
          .content {
            flex: 1 1;
            cursor: text;
          }
          .circle {
            margin-right: 5px;
            color: grey;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};
