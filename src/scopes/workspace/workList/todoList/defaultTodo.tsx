/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useCallback } from 'react';
import { Keys, Icon, Spinner } from '@yishanzhilubp/core';
import classNames from 'classnames';

import { ITodo } from '@/src/model/schemas';
import { f } from '@/src/api';
import { ITaiPageError } from '@/src/model/utils';
import { GoalMission } from '@/src/components/goalMission';
import { TaiToast, TaiToastError } from '@/src/utils/toaster';
import { ITodosActions } from './todoReducer';
import { useWorkListContext } from '../workList';

interface IProps {
  todo: ITodo;
  dispatchTodosAction: React.Dispatch<ITodosActions>;
}

type TodoStatus = 'default' | 'hover' | 'loading' | 'done';

export const DefaultTodo = ({ todo, dispatchTodosAction }: IProps) => {
  const [status, setStatus] = React.useState<TodoStatus>('default');
  const [_, setWorkList] = useWorkListContext();

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
      dispatchTodosAction({
        type: 'Unfreeze',
      });
      dispatchTodosAction({
        type: 'FinishTodoSave',
        id: todo.id,
      });
      TaiToast.show({
        message: `完成了 ${todo.content}`,
        intent: 'primary',
        icon: 'clean',
        actions: [
          {
            text: '记录',
            onClick: () => {
              setWorkList({ finishedTodo: todo });
            },
          },
          {
            text: '撤销',
            onClick: async () => {
              try {
                await f.patch<ITodo>(`/todo/${todo.id}`, {
                  status: 'doing',
                });
                dispatchTodosAction({
                  type: 'FinishTodoUndo',
                  todo,
                });
              } catch (error) {
                TaiToastError((error as ITaiPageError).message);
              }
            },
          },
        ],
      });
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

  // const handlePopoverOK = useCallback(() => {
  //   setWorkList({ finishedTodo: todo });
  //   handlePopoverClose();
  // }, []);

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
        <div className="goal-mission">
          <GoalMission emptyText="独立事项" goalMission={todo} isLink />
        </div>
      </div>
      <style jsx>
        {`
          .todo-text {
            display: flex;
            margin-top: 10px;
            flex-wrap: wrap;
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
            min-width: 150px;
            margin-right: 10px;
            margin-bottom: 10px;
          }
          .content.done {
            text-decoration: line-through;
          }
          .circle {
            margin-right: 10px;
            color: grey;
            cursor: pointer;
          }
          .goal-mission {
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
};
