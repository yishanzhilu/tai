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
  | { type: 'FinishTodoUndo'; todo: ITodo }
  | { type: 'Cancel' }
  | { type: 'NewTodo' }
  | { type: 'ToggleFinishedTodos' }
  | { type: 'SetFinishedTodos'; todos: ITodo[] }
  | { type: 'Freeze' }
  | { type: 'Unfreeze' }
  | { type: 'NewTodoSubmit'; todo: ITodo };

interface ITodosState {
  todos: IUITodo[];
  finishedTodos: ITodo[];
  showFinishedTodos: boolean;
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

export const todosReducer = (
  state: ITodosState,
  action: ITodosActions
): ITodosState => {
  if (action.type === 'InitTodo') {
    return {
      todos: action.todos.sort((a, b) => a.id - b.id),
      finishedTodos: [],
      showFinishedTodos: false,
      addNew: false,
      isFreeze: false,
    };
  }
  // can't add new todo, finish todo or edit todo when freezing
  if (
    state.isFreeze &&
    ['NewTodo', 'FinishTodo', 'EditTodo'].some(a => a === action.type)
  ) {
    return state;
  }
  switch (action.type) {
    case 'Freeze':
      return {
        ...state,
        isFreeze: true,
      };

    case 'Unfreeze':
      return {
        ...state,
        isFreeze: false,
      };
    case 'NewTodo':
      return {
        ...state,
        todos: state.todos.map(t => todoReducer(t, action)),
        addNew: true,
        isFreeze: false,
      };
    case 'EditTodo':
    case 'EditTodoSave':
      return {
        ...state,
        todos: state.todos.map(t => todoReducer(t, action)),
        addNew: false,
        isFreeze: false,
      };
    case 'DeleteTodo':
    case 'FinishTodoSave':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.id),
        addNew: false,
        isFreeze: false,
      };
    case 'FinishTodoUndo':
      return {
        ...state,
        todos: [
          {
            ...action.todo,
          },
          ...state.todos,
        ].sort((a, b) => a.id - b.id),
        addNew: false,
        isFreeze: false,
      };
    case 'NewTodoSubmit':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            ...action.todo,
          },
        ],
        addNew: true,
        isFreeze: false,
      };
    case 'ToggleFinishedTodos':
      return {
        ...state,
        showFinishedTodos: !state.showFinishedTodos,
      };
    case 'SetFinishedTodos':
      return {
        ...state,
        finishedTodos: action.todos,
      };
    case 'Cancel':
      return {
        ...state,
        todos: state.todos.map(t => todoReducer(t, action)),
        addNew: false,
        isFreeze: false,
      };
    default:
      return state;
  }
};
