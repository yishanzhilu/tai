/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import {
  Button,
  Keys,
  TextArea,
  FormGroup,
  Popover,
  H6,
  Classes,
  Position,
} from '@yishanzhilubp/core';

import { useInputRef } from '@/src/utils/hooks';
import { ITodo, IGoalMission } from '@/src/model/schemas';

import { ITodosActions } from './todoList';
import { f } from '@/src/api';
import { Flex, FlexPlaceHolder } from '@/src/components/flex';
import { GoalMissionMenu } from '../../components/goalMissionMenu';

interface IProps {
  todo: ITodo;
  dispatchTodosAction: React.Dispatch<ITodosActions>;
  onClickCancel: () => void;
}

export const EditingTodo = ({
  todo: originTodo,
  dispatchTodosAction,
  onClickCancel,
}: IProps) => {
  const [input, ref] = useInputRef<HTMLTextAreaElement>();
  const [goalMission, onSelectGoalMission] = React.useState(
    originTodo as IGoalMission
  );
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  React.useEffect(() => {
    if (input) {
      input.value = originTodo.content;
    }
  }, [input]);

  const onEditClickSave = async () => {
    if (input.value.length === 0) {
      setErrorMsg('必填');
      return;
    }
    if (input.value.length > 255) {
      setErrorMsg('不能大于255个字符');
      return;
    }
    setLoading(true);
    dispatchTodosAction({
      type: 'Freeze',
    });
    const data = {
      goalID: goalMission.goalID,
      missionID: goalMission.missionID,
      content: input.value,
    };
    try {
      const res = await f.patch<ITodo>(`/todo/${originTodo.id}`, data);
      setLoading(false);
      dispatchTodosAction({
        type: 'EditTodoSave',
        id: originTodo.id,
        todo: res.data,
      });
    } catch (error) {
      setLoading(false);
      dispatchTodosAction({
        type: 'Unfreeze',
      });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.which) {
      case Keys.ENTER:
        onEditClickSave();
        break;
      case Keys.ESCAPE:
        onClickCancel();
        break;
      default:
        break;
    }
  };

  const onDelete = async () => {
    setLoading(true);
    dispatchTodosAction({
      type: 'Freeze',
    });
    try {
      await f.delete(`/todo/${originTodo.id}`);
      dispatchTodosAction({
        type: 'DeleteTodo',
        id: originTodo.id,
      });
    } catch (error) {
      setLoading(false);
      dispatchTodosAction({
        type: 'Unfreeze',
      });
    }
  };

  return (
    <div>
      <div className="input">
        <H6>更新事项</H6>
        <FormGroup helperText={errorMsg} intent="primary">
          <TextArea
            fill
            rows={1}
            disabled={loading}
            inputRef={ref}
            growVertically
            autoFocus
            onKeyDown={onKeyDown}
            rightElement={
              <GoalMissionMenu
                emptyText="独立事项"
                disabled={loading}
                onSelectGoalMission={onSelectGoalMission}
                goalMission={goalMission}
              />
            }
          />
        </FormGroup>
      </div>
      <Flex>
        <Button onClick={onEditClickSave} intent="primary" loading={loading}>
          保存
        </Button>
        <Button onClick={onClickCancel} disabled={loading}>
          取消
        </Button>
        <FlexPlaceHolder />
        <Popover
          minimal
          autoFocus={false}
          content={
            <div style={{ padding: '10px 10px 5px' }}>
              <p>确认删除吗？</p>
              <Flex>
                <Button
                  small
                  intent="primary"
                  className={Classes.POPOVER_DISMISS}
                  loading={loading}
                  onClick={onDelete}
                >
                  确认
                </Button>
                <Button
                  disabled={loading}
                  small
                  className={Classes.POPOVER_DISMISS}
                >
                  取消
                </Button>
              </Flex>
            </div>
          }
          position={Position.BOTTOM_RIGHT}
        >
          <Button disabled={loading} minimal icon="trash" />
        </Popover>
      </Flex>
    </div>
  );
};
