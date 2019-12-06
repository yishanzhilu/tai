/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import { ITodo } from '@/src/types/schemas';
import { EditingTodo } from './editingTodo';
import { FinishingTodo } from './finishingTodo';
import { DefaultTodo } from './defaultTodo';
import { ITodosActions } from './todoList';

export interface IUITodo extends ITodo {
  uiState?: undefined | 'default' | 'editing' | 'finishing';
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
  const onClickFinish = () => {
    dispatchTodosAction({
      type: 'FinishTodo',
      id: todo.id,
    });
  };
  const onFinishClickSave = record => {
    dispatchTodosAction({
      type: 'FinishTodoSave',
      id: todo.id,
      record,
    });
  };
  const onClickContent = () =>
    dispatchTodosAction({
      type: 'EditTodo',
      id: todo.id,
    });

  if (todo.uiState === 'editing') {
    return (
      <EditingTodo
        todo={todo}
        onClickCancel={onClickCancel}
        dispatchTodosAction={dispatchTodosAction}
      />
    );
  }
  if (todo.uiState === 'finishing') {
    return (
      <FinishingTodo
        todo={todo}
        onClickSave={onFinishClickSave}
        onClickCancel={onClickCancel}
      />
    );
  }
  return (
    <DefaultTodo
      onClickFinish={onClickFinish}
      onClickContent={onClickContent}
      todo={todo}
    />
  );
};
