/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import {
  Card,
  Popover,
  Menu,
  MenuItem,
  Position,
  Button,
  InputGroup,
  Icon,
} from '@yishanzhilu/blueprint-core';
import { useLocalStore, useObserver } from 'mobx-react-lite';

import { withGlobalState } from '@/src/store/global';

const permissionsMenu = (
  <Popover
    content={
      <Menu>
        <MenuItem text="can edit" />
        <MenuItem text="can view" />
      </Menu>
    }
    position={Position.BOTTOM_RIGHT}
  >
    <Button rightIcon="caret-down">can edit</Button>
  </Popover>
);

const Todo = ({ editID, id, setEditID, content }) => {
  if (editID === id) {
    return (
      <InputGroup
        fill
        autoFocus
        placeholder="Add people or groups..."
        rightElement={permissionsMenu}
      />
    );
  }
  const [showTick, setShowTick] = React.useState(false);
  return (
    <div
      onClick={() => {
        console.log(222);
      }}
      className="todo-text"
    >
      <span
        className="circle"
        onMouseOver={() => setShowTick(true)}
        onMouseLeave={() => setShowTick(false)}
      >
        {showTick ? <Icon icon="tick-circle" /> : <Icon icon="circle" />}
      </span>
      <span
        className="content"
        onClick={() => {
          setEditID(id);
        }}
      >
        {content}
      </span>
      <style jsx>
        {`
          .todo-text {
            padding: 6px 0;
            display: flex;
          }
          .content {
            flex: 1 1;
            cursor: text;
          }
          .circle {
            margin-right: 5px;
            color: grey;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

const WorkSpace = (): React.ReactElement => {
  const initTodo = [
    { id: '1', content: '事项1' },
    { id: '2', content: '事项2' },
  ];
  const store = useLocalStore(todo => {
    return {
      todo,
      editID: '',
      showNewTodoInput: false,
      setEditID(id: string) {
        store.editID = id;
      },
      addTodo() {
        store.showNewTodoInput = true;
      },
    };
  }, initTodo);
  const node = React.useRef<HTMLUListElement>();
  React.useEffect(() => {
    const handleClick = e => {
      if (node.current.contains(e.target)) {
        return;
      }
      store.setEditID('');
      store.showNewTodoInput = false;
    };
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  return useObserver(() => (
    <div>
      <h2>事项</h2>
      <Card>
        <ul className="bp3-list-unstyled" ref={node}>
          {store.todo.map(t => (
            <li key={t.id}>
              <Todo
                editID={store.editID}
                id={t.id}
                content={t.content}
                setEditID={store.setEditID}
              />
            </li>
          ))}
          <li>
            {store.showNewTodoInput ? (
              <div>
                <InputGroup
                  fill
                  autoFocus
                  placeholder="Add people or groups..."
                  rightElement={permissionsMenu}
                />
                <Button intent="primary" minimal onClick={store.addTodo}>
                  添加事项
                </Button>
              </div>
            ) : (
              <Button intent="primary" onClick={store.addTodo}>
                添加事项
              </Button>
            )}
          </li>
        </ul>
      </Card>
      <style jsx>{`
        li {
          margin: 5px 0;
        }
      `}</style>
    </div>
  ));
};

export default withGlobalState(WorkSpace);
