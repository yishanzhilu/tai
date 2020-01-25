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
  Callout,
} from '@yishanzhilubp/core';

import { useInputRef } from '@/src/utils/hooks';
import { ITodo, IGoalMission } from '@/src/model/schemas';

import { Flex, FlexPlaceHolder } from '../flex';
import { GoalMissionMenu } from '../goalMission';
import { ITodosActions } from './todoList';
import { f } from '@/src/api';

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
    console.debug('EditingTodo | onEditClickSave', goalMission);
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
      const res = await f.patch<ITodo>(
        `/workspace/todo/${originTodo.id}`,
        data
      );
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
      case Keys.ESCAPE:
        onClickCancel();
        break;
      case Keys.ENTER:
        onEditClickSave();
        break;
      default:
        break;
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
            <Callout>
              <H6>确认删除吗？</H6>
              <Flex>
                <Button
                  small
                  className={Classes.POPOVER_DISMISS}
                  intent="warning"
                  loading={loading}
                >
                  确认
                </Button>
                <Button
                  disabled={loading}
                  small
                  minimal
                  className={Classes.POPOVER_DISMISS}
                >
                  取消
                </Button>
              </Flex>
            </Callout>
          }
          position={Position.BOTTOM_RIGHT}
        >
          <Button disabled={loading} minimal icon="trash" />
        </Popover>
      </Flex>
    </div>
  );
};
