/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';
import { Card, Divider } from '@yishanzhilubp/core';

import { Todo, IUITodo } from './todo';
import { NewTodo } from './newTodo';
import { ITodo } from '@/src/model/schemas';
import { TaiList } from '@/src/layout/taiList';

export type ITodosActions =
  | { type: 'EditTodo'; id: number }
  | { type: 'EditTodoSave'; todo: ITodo; id: number }
  | { type: 'FinishTodoSave'; id: number }
  | { type: 'Cancel' }
  | { type: 'NewTodo' }
  | { type: 'Freeze' }
  | { type: 'Unfreeze' }
  | { type: 'NewTodoSubmit'; todo: ITodo };

const todoReducer = (
  todoState: IUITodo,
  todosAction: ITodosActions
): IUITodo => {
  switch (todosAction.type) {
    case 'EditTodo':
      return {
        ...todoState,
        uiState: todoState.id === todosAction.id ? 'editing' : 'default',
      };
    case 'EditTodoSave':
      if (todoState.id === todosAction.id) {
        return {
          ...todosAction.todo,
          uiState: 'default',
        };
      }
      return {
        ...todoState,
        uiState: 'default',
      };
    default:
      return {
        ...todoState,
        uiState: 'default',
      };
  }
};

interface ITodosState {
  todos: IUITodo[];
  addNew: boolean;
  isFreeze: boolean;
}
// todo 本质上状态为 doing 的 work
const todosReducer = (
  todosState: ITodosState,
  todosAction: ITodosActions
): ITodosState => {
  console.debug('todosReducer | todosAction', todosAction);
  if (
    todosState.isFreeze &&
    ['NewTodo', 'FinishTodo', 'EditTodo'].some(a => a === todosAction.type)
  ) {
    return todosState;
  }
  switch (todosAction.type) {
    case 'Freeze':
      return {
        ...todosState,
        isFreeze: true,
      };

    case 'Unfreeze':
      return {
        ...todosState,
        isFreeze: false,
      };
    case 'NewTodo':
      return {
        todos: todosState.todos.map(t => todoReducer(t, todosAction)),
        addNew: true,
        isFreeze: false,
      };
    case 'EditTodoSave':
      return {
        todos: todosState.todos.map(t => todoReducer(t, todosAction)),
        addNew: false,
        isFreeze: false,
      };
    case 'FinishTodoSave':
      return {
        todos: todosState.todos.filter(t => t.id !== todosAction.id),
        addNew: false,
        isFreeze: false,
      };
    case 'NewTodoSubmit':
      return {
        todos: [
          ...todosState.todos,
          {
            ...todosAction.todo,
          },
        ],
        addNew: true,
        isFreeze: false,
      };
    default:
      return {
        todos: todosState.todos.map(t => todoReducer(t, todosAction)),
        addNew: false,
        isFreeze: false,
      };
  }
};

interface IProps {
  todos: IUITodo[];
}

export const TodoList = ({ todos = [] }: IProps): React.ReactElement => {
  const [todosState, dispatchTodosAction] = React.useReducer(todosReducer, {
    todos: [...todos],
    addNew: false,
    isFreeze: false,
  });

  return (
    <TaiList title="事项">
      <Card className="card" style={{ marginTop: 20 }}>
        <ul className="bp3-list-unstyled">
          {todosState.todos &&
            todosState.todos.map(t => (
              <li key={t.id}>
                <div className="todo">
                  <Todo todo={t} dispatchTodosAction={dispatchTodosAction} />
                </div>
                <Divider />
              </li>
            ))}

          <li>
            <NewTodo
              isEditing={todosState.addNew}
              dispatchTodosAction={dispatchTodosAction}
            />
          </li>
        </ul>
      </Card>
      <style jsx>{`
        .todo {
          padding: 10px 0;
        }
      `}</style>
    </TaiList>
  );
};
