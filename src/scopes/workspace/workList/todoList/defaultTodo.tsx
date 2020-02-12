/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useCallback } from 'react';
import { Keys, Icon, Spinner, Button, Popover } from '@yishanzhilubp/core';
import classNames from 'classnames';

import { ITodo } from '@/src/model/schemas';
import { f } from '@/src/api';
import { Flex } from '@/src/components/flex';
import { GoalMission } from '@/src/components/goalMission';
import { ITodosActions } from './todoReducer';
import { useWorkListContext } from '../workList';

interface IProps {
  todo: ITodo;
  dispatchTodosAction: React.Dispatch<ITodosActions>;
}

type TodoStatus = 'default' | 'hover' | 'loading' | 'done';

export const DefaultTodo = ({ todo, dispatchTodosAction }: IProps) => {
  const [status, setStatus] = React.useState<TodoStatus>('default');

  const onClickFinish = useCallback(async () => {
    setStatus('loading');
    dispatchTodosAction({
      type: 'Freeze',
    });
    try {
      await f.patch<ITodo>(`/todo/${todo.id}`, {
        status: 'done',
      });
      setStatus('done');
    } catch (error) {
      setStatus('default');
    }
  }, []);

  const onClickContent = useCallback(() => {
    if (status === 'default') {
      dispatchTodosAction({
        type: 'EditTodo',
        id: todo.id,
      });
    }
  }, []);

  const [_, setWorkList] = useWorkListContext();
  const handlePopoverClose = useCallback(() => {
    dispatchTodosAction({
      type: 'Unfreeze',
    });
    dispatchTodosAction({
      type: 'FinishTodoSave',
      id: todo.id,
    });
  }, [todo.id]);

  const handlePopoverOK = useCallback(() => {
    setWorkList({ finishedTodo: todo });
    handlePopoverClose();
  }, []);

  const renderIcon = () => {
    switch (status) {
      case 'hover':
        return <Icon icon="tick-circle" />;
      case 'loading':
        return <Spinner className="loading-circle" size={16} />;
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
              是否记录历程？
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
        <div>
          <GoalMission emptyText="独立事项" goalMission={todo} isLink />
        </div>
      </div>
      <style jsx>
        {`
          .todo-text {
            display: flex;
          }
          .todo-text :global(.loading-circle) {
            display: inline-flex;
          }
          .popover {
            padding: 20px;
          }
          .content {
            flex: 1 1;
            cursor: text;
            word-break: break-all;
            white-space: pre-wrap;
            margin-right: 10px;
          }
          .content.done {
            text-decoration: line-through;
          }
          .circle {
            margin: 0 10px;
            color: grey;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};
