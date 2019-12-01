/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import {
  InputGroup,
  Popover,
  Menu,
  MenuItem,
  Position,
  Button,
  Keys,
} from '@yishanzhilu/blueprint-core';
import Flex from '../flex';
import { useInputRef } from '@/src/utils/hooks';

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

export const NewTodo = ({ isEditing, onCancel, onSubmit, onAddNew }) => {
  const [input, ref] = useInputRef<HTMLInputElement>();
  const handleSubmit = () => {
    onSubmit(input.value);
    input.value = '';
    input.scrollIntoView({block: "start"});
    input.focus();
  };
  return (
    <div className="new-todo">
      {isEditing ? (
        <>
          <div className="input">
            <InputGroup
              fill
              inputRef={ref}
              autoFocus
              placeholder="Add people or groups..."
              rightElement={permissionsMenu}
              onKeyDown={e => {
                if (e.which === Keys.ENTER) {
                  handleSubmit();
                } else if (e.which === Keys.ESCAPE) {
                  onCancel();
                }
              }}
            />
          </div>
          <Flex>
            <Button
              intent="primary"
              onClick={() => {
                handleSubmit();
              }}
            >
              保存
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Flex>
        </>
      ) : (
        <Button intent="primary" minimal onClick={onAddNew}>
          添加事项
        </Button>
      )}
      <style jsx>{`
        .new-todo {
          padding: 5px 0;
        }
        .input {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};
