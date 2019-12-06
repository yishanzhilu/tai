/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';
import { Card } from '@yishanzhilu/blueprint-core';

import { Todo, IUITodo } from './todo';
import { NewTodo } from './newTodo';
import { ITodo, IRecord } from '@/src/types/schemas';

export type ITodosActions =
  | { type: 'PropsUpdate'; todos: ITodo[] }
  | { type: 'EditTodo'; id: number }
  | { type: 'EditTodoSave'; todo: ITodo; id: number }
  | { type: 'FinishTodo'; id: number }
  | { type: 'FinishTodoSave'; record: IRecord; id: number }
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
    case 'FinishTodo':
      return {
        ...todoState,
        uiState: todoState.id === todosAction.id ? 'finishing' : 'default',
      };
    case 'EditTodoSave':
      if (todoState.id === todosAction.id) {
        console.log(todosAction.todo);
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
  localNewTodoID: number;
  isFreeze: boolean;
}
// todo 本质上状态为 doing 的 work
const todosReducer = (
  todosState: ITodosState,
  todosAction: ITodosActions
): ITodosState => {
  if (todosState.isFreeze) {
    if (todosAction.type === 'Unfreeze') {
      return {
        ...todosState,
        isFreeze: false,
      };
    }
    return todosState;
  }
  switch (todosAction.type) {
    case 'Freeze':
      return {
        ...todosState,
        isFreeze: true,
      };
    case 'PropsUpdate':
      return {
        todos: todosAction.todos,
        addNew: todosState.addNew,
        localNewTodoID: todosState.localNewTodoID,
        isFreeze: false,
      };
    case 'NewTodo':
      return {
        todos: todosState.todos.map(t => todoReducer(t, todosAction)),
        addNew: true,
        localNewTodoID: todosState.localNewTodoID,
        isFreeze: false,
      };
    case 'FinishTodoSave':
      return {
        todos: todosState.todos.filter(t => t.id !== todosAction.id),
        addNew: false,
        localNewTodoID: todosState.localNewTodoID,
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
        localNewTodoID: todosState.localNewTodoID - 1,
        isFreeze: false,
      };
    default:
      return {
        todos: todosState.todos.map(t => todoReducer(t, todosAction)),
        addNew: false,
        localNewTodoID: todosState.localNewTodoID,
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
    localNewTodoID: -1,
    isFreeze: false,
  });

  return (
    <div className="todo-list">
      <h2>事项</h2>
      <Card className="card">
        <ul className="bp3-list-unstyled">
          {todosState.todos &&
            todosState.todos.map(t => (
              <li key={t.id}>
                <Todo todo={t} dispatchTodosAction={dispatchTodosAction} />
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
        li:not(:last-child) {
          margin: 5px 0;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .todo-list :global(.card){
          padding: 20px 40px;
        }
      `}</style>
    </div>
  );
};
