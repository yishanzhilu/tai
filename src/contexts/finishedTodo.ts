/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';

import { ITodo } from '../model/schemas';
import { eventHandlerWarning } from '../utils/funcs';

const finishedTodo: Partial<ITodo> = {};

const setFinishedTodo: (todo: Partial<ITodo>) => void = eventHandlerWarning('setFinishedTodo');

export const FinishedTodoContext = React.createContext({
  finishedTodo,
  setFinishedTodo,
});
