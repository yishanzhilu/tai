/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import { eventHandlerWarning } from '@/src/utils/funcs';
import { ITodo, IRecord } from '@/src/types/schemas';
import { EditingTodo } from './editingTodo';
import { FinishingTodo } from './finishingTodo';
import { DefaultTodo } from './defaultTodo';

export interface IUITodo extends ITodo {
  uiState?: undefined | 'default' | 'editing' | 'finishing';
}

export interface ITodoProps {
  todo: IUITodo;
  onClickContent?: () => void;
  onEditClickSave?: (todo: ITodo) => void;
  onFinishClickSave?: (record: IRecord) => void;
  onClickCancel?: () => void;
  onClickFinish?: () => void;
}
export const Todo = ({
  todo,
  onClickContent = eventHandlerWarning('Todo-onClickContent'),
  onEditClickSave = eventHandlerWarning('Todo-onEditClickSave'),
  onFinishClickSave = eventHandlerWarning('Todo-onFinishClickSave'),
  onClickCancel = eventHandlerWarning('Todo-onClickCancel'),
  onClickFinish = eventHandlerWarning('Todo-onClickFinish'),
}: ITodoProps) => {
  if (todo.uiState === 'editing') {
    return (
      <EditingTodo
        todo={todo}
        onClickSave={onEditClickSave}
        onClickCancel={onClickCancel}
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
