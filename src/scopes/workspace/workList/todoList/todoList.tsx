/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useEffect } from 'react';
import { Divider, Card } from '@yishanzhilubp/core';

import { Todo, IUITodo } from './todo';
import { NewTodo } from './newTodo';
import { ITodo, IGoalMission } from '@/src/model/schemas';
import { TaiList } from '@/src/components/layouts/taiList';
import { todosReducer } from './todoReducer';

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
    <div>
      <TaiList<ITodo>
        title="事项"
        items={todos}
        render={t => (
          <div key={t.id}>
            <div className="todo">
              <Todo todo={t} dispatchTodosAction={dispatchTodosAction} />
            </div>
            <Divider />
          </div>
        )}
        after={
          <NewTodo
            isEditing={addNew}
            dispatchTodosAction={dispatchTodosAction}
          />
        }
        container={<Card />}
      />
      <style jsx>{`
        .todo {
          padding: 10px 0;
        }
      `}</style>
    </div>
  );
};
