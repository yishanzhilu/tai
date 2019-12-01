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
import { axios } from '@/src/api';

type ITodosActions =
  | { type: 'PropsUpdate'; todos: ITodo[] }
  | { type: 'EditTodo'; id: number }
  | { type: 'EditTodoSave'; todo: ITodo; id: number }
  | { type: 'FinishTodo'; id: number }
  | { type: 'FinishTodoSave'; record: IRecord; id: number }
  | { type: 'Cancel' }
  | { type: 'NewTodo' }
  | { type: 'NewTodoSubmit'; value: string };

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
      return todoState.id === todosAction.id
        ? {
            ...todosAction.todo,
            uiState: 'default',
          }
        : {
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
}
// todo 本质上状态为 doing 的 work
const todosReducer = (
  todosState: ITodosState,
  todosAction: ITodosActions
): ITodosState => {
  switch (todosAction.type) {
    case 'PropsUpdate':
      return {
        todos: todosAction.todos,
        addNew: todosState.addNew,
        localNewTodoID: todosState.localNewTodoID,
      };
    case 'NewTodo':
      return {
        todos: todosState.todos.map(t => todoReducer(t, todosAction)),
        addNew: true,
        localNewTodoID: todosState.localNewTodoID,
      };
    case 'FinishTodoSave':
      return {
        todos: todosState.todos.filter(t => t.id !== todosAction.id),
        addNew: false,
        localNewTodoID: todosState.localNewTodoID,
      };
    case 'NewTodoSubmit':
      return {
        todos: [
          ...todosState.todos,
          {
            id: todosState.localNewTodoID,
            content: todosAction.value,
            status: 'doing',
            uiState: 'default',
          },
        ],
        addNew: true,
        localNewTodoID: todosState.localNewTodoID - 1,
      };
    default:
      return {
        todos: todosState.todos.map(t => todoReducer(t, todosAction)),
        addNew: false,
        localNewTodoID: todosState.localNewTodoID,
      };
  }
};

interface IProps {
  todos: IUITodo[];
  onUpdateDataTodos: (todos: ITodo[]) => void;
}

export const TodoList = ({
  todos,
  onUpdateDataTodos,
}: IProps): React.ReactElement => {
  console.debug('TodoList', todos);
  const [todosState, dispatchTodosAction] = React.useReducer(todosReducer, {
    todos: [...todos],
    addNew: false,
    localNewTodoID: -1,
  });

  React.useEffect(() => {
    console.log('useEffect todos');

    dispatchTodosAction({ type: 'PropsUpdate', todos });
  }, [todos]);
  console.debug('TodoList | after useReducer', todosState);

  return (
    <div>
      <h2>事项</h2>
      <Card>
        <ul className="bp3-list-unstyled">
          {todosState.todos &&
            todosState.todos.map(t => (
              <li key={t.id}>
                <Todo
                  todo={t}
                  onClickCancel={() => {
                    dispatchTodosAction({
                      type: 'Cancel',
                    });
                  }}
                  onClickFinish={() => {
                    dispatchTodosAction({
                      type: 'FinishTodo',
                      id: t.id,
                    });
                  }}
                  onEditClickSave={todo => {
                    console.debug('onEditClickSave', todo);
                    dispatchTodosAction({
                      type: 'EditTodoSave',
                      id: t.id,
                      todo,
                    });
                  }}
                  onFinishClickSave={record => {
                    dispatchTodosAction({
                      type: 'FinishTodoSave',
                      id: t.id,
                      record,
                    });
                  }}
                  onClickContent={() =>
                    dispatchTodosAction({
                      type: 'EditTodo',
                      id: t.id,
                    })
                  }
                />
              </li>
            ))}

          <li>
            <NewTodo
              isEditing={todosState.addNew}
              onAddNew={() => {
                dispatchTodosAction({
                  type: 'NewTodo',
                });
              }}
              onCancel={() => {
                dispatchTodosAction({
                  type: 'Cancel',
                });
              }}
              onSubmit={async (value: string) => {
                dispatchTodosAction({
                  type: 'NewTodoSubmit',
                  value,
                });
                await axios.post('/workspace/todo', {
                  content: value,
                  status: 'doing',
                });
                onUpdateDataTodos(todosState.todos);
                console.debug('dispatchTodosAction NewTodoSubmit done');
              }}
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
      `}</style>
    </div>
  );
};
