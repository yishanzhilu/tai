/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import {
  Keys,
  Icon,
  Spinner,
  Button,
  Popover,
} from '@yishanzhilubp/core';
import classNames from 'classnames';

import { ITodo } from '@/src/model/schemas';
import { GoalMission } from '../goalMission';
import { ITodosActions } from './todoList';
import { axios } from '@/src/api';
import { Flex } from '../flex';
import { FinishedTodoContext } from '@/src/contexts/finishedTodo';

interface IProps {
  todo: ITodo;
  dispatchTodosAction: React.Dispatch<ITodosActions>;
}

type TodoStatus = 'default' | 'hover' | 'loading' | 'done';

export const DefaultTodo = ({ todo, dispatchTodosAction }: IProps) => {
  const [status, setStatus] = React.useState<TodoStatus>('default');
  const onClickFinish = async () => {
    setStatus('loading');
    dispatchTodosAction({
      type: 'Freeze',
    });
    try {
      await axios.patch<ITodo>(`/workspace/todo/${todo.id}`, {
        status: 'done',
      });
      setStatus('done');
    } catch (error) {
      setStatus('default');
    }
  };
  const onClickContent = () => {
    if (status === 'default') {
      dispatchTodosAction({
        type: 'EditTodo',
        id: todo.id,
      });
    }
  };

  const { setFinishedTodo } = React.useContext(FinishedTodoContext);
  const handlePopoverClose = () => {
    dispatchTodosAction({
      type: 'Unfreeze',
    });
    dispatchTodosAction({
      type: 'FinishTodoSave',
      id: todo.id,
    });
  };
  const handlePopoverOK = () => {
    setFinishedTodo(todo);
    handlePopoverClose();
  };

  const renderIcon = () => {
    switch (status) {
      case 'hover':
        return <Icon icon="tick-circle" />;
      case 'loading':
        return <Spinner size={16} />;
      case 'done':
        return <Icon icon="tick-circle" intent="primary" />;
      case 'default':
      default:
        return <Icon icon="circle" />;
    }
  };

  const contentClassName = classNames('content', status === 'done' && 'done');
  return (
    <div>
      <div className="todo-text">
        <Popover
          position="bottom-left"
          usePortal={false}
          isOpen={status === 'done'}
          onClose={handlePopoverClose}
        >
          <span
            tabIndex={0}
            className="circle"
            onMouseOver={() =>
              setStatus(pre => (pre === 'default' ? 'hover' : pre))
            }
            onMouseLeave={() =>
              setStatus(pre => (pre === 'hover' ? 'default' : pre))
            }
            onClick={onClickFinish}
            onKeyDown={e => {
              if (e.which === Keys.ENTER) {
                onClickFinish();
              }
            }}
          >
            {renderIcon()}
          </span>
          <div className="popover">
            <p>
              恭喜你完成了{todo.content}，<br />
              要不要顺便记录一下？
            </p>
            <Flex justifyContent="flex-end">
              <Button small intent="primary" onClick={handlePopoverOK}>
                好的
              </Button>
              <Button small minimal onClick={handlePopoverClose}>
                不
              </Button>
            </Flex>
          </div>
        </Popover>

        <span
          className={contentClassName}
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
        <GoalMission goalMission={todo} isLink />
      </div>
      <style jsx>
        {`
          .todo-text {
            display: flex;
          }
          .popover {
            padding: 20px;
          }
          .content {
            flex: 1 1;
            cursor: text;
          }
          .content.done {
            text-decoration: line-through;
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
