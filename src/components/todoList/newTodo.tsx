/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import {
  Button,
  Keys,
  FormGroup,
  TextArea,
  H6,
} from '@yishanzhilu/blueprint-core';
import { Flex } from '../flex';
import { useInputRef } from '@/src/utils/hooks';
import { axios } from '@/src/api';
import { GoalMissionNewMenu } from './goalMissionMenu';
import { ITodosActions } from './todoList';
import { IGoalMission } from '@/src/types/schemas';

export const NewTodo = ({
  isEditing,
  dispatchTodosAction,
}: {
  isEditing: boolean;
  dispatchTodosAction: React.Dispatch<ITodosActions>;
}) => {
  const [input, ref] = useInputRef<HTMLTextAreaElement>();
  const [loading, setLoading] = React.useState(false);
  const [goalMission, onSelectGoalMission] = React.useState<IGoalMission>({});
  const [errorMsg, setErrorMsg] = React.useState('');

  const onCancel = () => {
    onSelectGoalMission({});
    dispatchTodosAction({
      type: 'Cancel',
    });
  };

  const handleSubmit = async () => {
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
      content: input.value,
      status: 'doing',
      ...goalMission,
    };
    const res = await axios.post('/workspace/todo', data);
    setLoading(false);
    dispatchTodosAction({
      type: 'Unfreeze',
    });
    dispatchTodosAction({
      type: 'NewTodoSubmit',
      todo: res.data,
    });
    input.value = '';
    input.scrollIntoView({ block: 'start' });
    input.focus();
  };
  return (
    <div className="new-todo">
      {isEditing ? (
        <>
          <div className="input">
            <H6>添加事项</H6>
            <FormGroup helperText={errorMsg} intent="primary">
              <TextArea
                fill
                growVertically
                inputRef={ref}
                autoFocus
                disabled={loading}
                intent={errorMsg ? 'primary' : 'none'}
                placeholder="有什么需要做的吗"
                rightElement={
                  <GoalMissionNewMenu
                    goalMission={goalMission}
                    onSelectGoalMission={onSelectGoalMission}
                  />
                }
                onKeyDown={e => {
                  if (e.which === Keys.ENTER) {
                    handleSubmit();
                  } else if (e.which === Keys.ESCAPE) {
                    onCancel();
                  }
                }}
              />
            </FormGroup>
          </div>
          <Flex>
            <Button
              loading={loading}
              intent="primary"
              onClick={() => {
                handleSubmit();
              }}
            >
              保存
            </Button>
            <Button disabled={loading} onClick={onCancel}>
              取消
            </Button>
          </Flex>
        </>
      ) : (
          <Button
            intent="primary"
            minimal
            onClick={() => {
              dispatchTodosAction({
                type: 'NewTodo',
              });
            }}
          >
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
