/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import { ITodo } from '@/src/model/schemas';
import { EditingTodo } from './editingTodo';
import { DefaultTodo } from './defaultTodo';
import { ITodosActions } from './todoList';

export interface IUITodo extends ITodo {
  uiState?: undefined | 'default' | 'editing' | 'loading';
}

export interface ITodoProps {
  todo: IUITodo;
  dispatchTodosAction: React.Dispatch<ITodosActions>;
}
export const Todo = ({ todo, dispatchTodosAction }: ITodoProps) => {
  const onClickCancel = () => {
    dispatchTodosAction({
      type: 'Cancel',
    });
  };

  if (todo.uiState === 'editing') {
    return (
      <EditingTodo
        todo={todo}
        dispatchTodosAction={dispatchTodosAction}
        onClickCancel={onClickCancel}
      />
    );
  }
  return <DefaultTodo todo={todo} dispatchTodosAction={dispatchTodosAction} />;
};
