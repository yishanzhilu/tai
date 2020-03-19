/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useEffect, useCallback } from 'react';
import {
  Divider,
  Card,
  H5,
  Popover,
  Menu,
  MenuItem,
  Button,
} from '@yishanzhilubp/core';

import { IGoalMission } from '@/src/model/schemas';
import { f } from '@/src/api';
// import { TaiList } from '@/src/components/layouts/taiList';

import { Todo, IUITodo } from './todo';
import { NewTodo } from './newTodo';
import { todosReducer } from './todoReducer';

interface IProps {
  todos: IUITodo[];
  currentGoalMission?: IGoalMission;
}

export const TodoList = ({
  todos: initTodos = [],
}: IProps): React.ReactElement => {
  const [
    { todos, addNew, finishedTodos, showFinishedTodos },
    dispatchTodosAction,
  ] = React.useReducer(todosReducer, {
    todos: initTodos,
    finishedTodos: [],
    showFinishedTodos: false,
    addNew: false,
    isFreeze: false,
  });

  useEffect(() => {
    dispatchTodosAction({ type: 'InitTodo', todos: initTodos });
  }, [initTodos]);

  const toggleFinishedTodos = useCallback(async () => {
    if (showFinishedTodos) {
      dispatchTodosAction({ type: 'ToggleFinishedTodos' });
      dispatchTodosAction({ type: 'SetFinishedTodos', todos: [] });
    } else {
      const { data: res } = await f.get('/todos?status=done');
      dispatchTodosAction({ type: 'ToggleFinishedTodos' });
      dispatchTodosAction({ type: 'SetFinishedTodos', todos: res });
    }
  }, [showFinishedTodos]);

  return (
    <div style={{ marginTop: 10 }}>
      <H5>
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ marginRight: 5 }}>事项</span>
          <Popover
            autoFocus={false}
            position="bottom-right"
            content={
              <Menu>
                <MenuItem
                  icon={<span>🗄️</span>}
                  text={showFinishedTodos ? '隐藏已完成任务' : '查看已完成任务'}
                  onClick={toggleFinishedTodos}
                />
              </Menu>
            }
          >
            <Button small icon="more" minimal />
          </Popover>
        </div>
      </H5>
      <Card>
        {todos.map(t => (
          <div key={t.id} style={{ marginBottom: 10 }}>
            <Todo todo={t} dispatchTodosAction={dispatchTodosAction} />
            <Divider style={{ margin: 0 }} />
          </div>
        ))}
        {finishedTodos.map(t => (
          <div key={t.id} style={{ marginBottom: 10 }}>
            <Todo todo={t} dispatchTodosAction={dispatchTodosAction} />
            <Divider style={{ margin: 0 }} />
          </div>
        ))}
        <NewTodo isEditing={addNew} dispatchTodosAction={dispatchTodosAction} />
      </Card>
    </div>
  );
};
