/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import {
  Popover,
  Menu,
  MenuItem,
  Position,
  Button,
  Keys,
  TextArea,
  FormGroup,
  H5,
  MenuDivider,
} from '@yishanzhilu/blueprint-core';

import { useInputRef } from '@/src/utils/hooks';
import { ITodo } from '@/src/types/schemas';

import Flex from '../flex';
import { useGlobalStore } from '@/src/store/global';
import { TodoGoalMission } from './todoGoalMission';

const GoalMissionUpdateMenu = ({ todo }: { todo: ITodo }) => {
  const store = useGlobalStore();
  return (
    <Popover
      minimal
      autoFocus={false}
      content={
        <Menu>
          <MenuDivider title="目标&任务" />
          <MenuItem text={<TodoGoalMission todo={todo} />}>
            <MenuDivider title="目标" />
            {store.work &&
              store.work.goals.map(g => {
                return (
                  <MenuItem
                    icon={<span>🎯</span>}
                    text={g.title}
                    key={`goal-${g.id}`}
                  >
                    {g.missions.map(m => (
                      <MenuItem
                        icon={<span>📜</span>}
                        text={m.title}
                        key={m.id}
                      />
                    ))}
                  </MenuItem>
                );
              })}
            <MenuDivider title="独立任务" />
            {store.work &&
              store.work.missions.map(m => (
                <MenuItem
                  icon={<span>📜</span>}
                  text={m.title}
                  key={`mission-${m.id}`}
                />
              ))}
          </MenuItem>
        </Menu>
      }
      position={Position.BOTTOM_RIGHT}
    >
      <Button rightIcon="cog">
        <TodoGoalMission todo={todo} />
      </Button>
    </Popover>
  );
};

interface IProps {
  todo: ITodo;
  onClickSave: (todo: ITodo) => void;
  onClickCancel: () => void;
}

export const EditingTodo = ({ todo, onClickSave, onClickCancel }: IProps) => {
  const [input, ref] = useInputRef<HTMLTextAreaElement>();
  React.useEffect(() => {
    if (input) {
      input.value = todo.content;
    }
    return () => {};
  }, [input]);
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.which) {
      case Keys.ESCAPE:
        onClickCancel();
        break;
      case Keys.ENTER:
        onClickSave({
          ...todo,
          content: input.value,
        });
        break;
      default:
        break;
    }
  };
  const handleClickSave = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onClickSave({
      ...todo,
      content: input.value,
    });
  };
  return (
    <div>
      <div className="input">
        <H5>更新事项</H5>
        <FormGroup>
          <TextArea
            fill
            rows={1}
            inputRef={ref}
            growVertically
            autoFocus
            onKeyDown={onKeyDown}
            rightElement={<GoalMissionUpdateMenu todo={todo} />}
          />
        </FormGroup>
      </div>
      <Flex>
        <Button onClick={handleClickSave} intent="primary">
          保存
        </Button>
        <Button onClick={onClickCancel}>取消</Button>
      </Flex>
    </div>
  );
};
