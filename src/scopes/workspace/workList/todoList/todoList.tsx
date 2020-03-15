/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useEffect } from 'react';
import { Divider, Card, H5 } from '@yishanzhilubp/core';

import { IGoalMission } from '@/src/model/schemas';
// import { TaiList } from '@/src/components/layouts/taiList';

import { Todo, IUITodo } from './todo';
import { NewTodo } from './newTodo';
import { todosReducer } from './todoReducer';
// import { FinishedTodos } from './finishedTodos';

interface IProps {
  todos: IUITodo[];
  currentGoalMission?: IGoalMission;
}

export const TodoList = ({
  todos: initTodos = [],
}: IProps): React.ReactElement => {
  const [{ todos, addNew }, dispatchTodosAction] = React.useReducer(
    todosReducer,
    {
      todos: [],
      addNew: false,
      isFreeze: false,
    }
  );

  useEffect(() => {
    dispatchTodosAction({ type: 'InitTodo', todos: initTodos });
  }, [initTodos]);

  return (
    <div style={{ marginTop: 10 }}>
      <H5>事项</H5>
      <Card>
        {todos.map(t => (
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
