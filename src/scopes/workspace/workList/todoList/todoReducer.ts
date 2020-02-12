/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { ITodo } from '@/src/model/schemas';
import { IUITodo } from './todo';

export type ITodosActions =
  | { type: 'InitTodo'; todos: ITodo[] }
  | { type: 'EditTodo'; id: number }
  | { type: 'EditTodoSave'; todo: ITodo; id: number }
  | { type: 'DeleteTodo'; id: number }
  | { type: 'FinishTodoSave'; id: number }
  | { type: 'Cancel' }
  | { type: 'NewTodo' }
  | { type: 'Freeze' }
  | { type: 'Unfreeze' }
  | { type: 'NewTodoSubmit'; todo: ITodo };

interface ITodosState {
  todos: IUITodo[];
  addNew: boolean;
  isFreeze: boolean;
}

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

// todo 本质上状态为 doing 的 work
export const todosReducer = (
  todosState: ITodosState,
  todosAction: ITodosActions
): ITodosState => {
  if (todosAction.type === 'InitTodo') {
    return {
      todos: todosAction.todos,
      addNew: false,
      isFreeze: false,
    };
  }
  // can't add new todo, finish todo or edit todo when freezing
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
    case 'DeleteTodo':
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
