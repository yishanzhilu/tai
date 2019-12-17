/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';

import { ITodo } from '../model/schemas';

const finishedTodo: Partial<ITodo> = {};

const setFinishedTodo: (todo: Partial<ITodo>) => void = () => {};

export const FinishedTodoContext = React.createContext({
  finishedTodo,
  setFinishedTodo,
});
