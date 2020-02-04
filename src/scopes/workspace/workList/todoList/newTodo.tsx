/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useEffect } from 'react';

import { Button, Keys, FormGroup, TextArea, H6 } from '@yishanzhilubp/core';

import { useInputRef } from '@/src/utils/hooks';
import { f } from '@/src/api';
import { IGoalMission } from '@/src/model/schemas';
import { TaiToast } from '@/src/utils/toaster';

import { Flex } from '@/src/components/flex';
import { useWorkSpaceContext } from '@/src/scopes/workspace';
import { GoalMissionMenu } from '@/src/scopes/workspace/components/goalMissionMenu';

import { ITodosActions } from './todoList';

const NewTodoEditing: React.FC<{
  dispatchTodosAction: React.Dispatch<ITodosActions>;
}> = ({ dispatchTodosAction }) => {
  const [input, ref] = useInputRef<HTMLTextAreaElement>();
  const [loading, setLoading] = React.useState(false);
  const {
    state: { goalMission: initialGoalMission },
  } = useWorkSpaceContext();

  const [goalMission, onSelectGoalMission] = React.useState<IGoalMission>(
    initialGoalMission
  );
  useEffect(() => {
    onSelectGoalMission(initialGoalMission);
  }, [initialGoalMission]);
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
      status: 'todo',
      ...goalMission,
    };
    try {
      const res = await f.post('/todos', data);
      dispatchTodosAction({
        type: 'NewTodoSubmit',
        todo: res.data,
      });
      input.value = '';
    } catch (error) {
      TaiToast.show({ message: error.message, intent: 'primary' });
    } finally {
      setLoading(false);
      dispatchTodosAction({
        type: 'Unfreeze',
      });
      input.focus();
    }
  };

  const handleEnter = () => {
    if (input.value.length === 0) {
      onCancel();
      return;
    }
    handleSubmit();
  };
  return (
    <>
      <div style={{ marginBottom: 10 }}>
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
              <GoalMissionMenu
                emptyText="独立事项"
                goalMission={goalMission}
                onSelectGoalMission={onSelectGoalMission}
                disabled={loading}
              />
            }
            onKeyDown={e => {
              if (e.which === Keys.ENTER) {
                handleEnter();
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
  );
};

export const NewTodo = ({
  isEditing,
  dispatchTodosAction,
}: {
  isEditing: boolean;
  dispatchTodosAction: React.Dispatch<ITodosActions>;
}) => {
  return (
    <div style={{ padding: '5px 0' }}>
      {isEditing ? (
        <NewTodoEditing dispatchTodosAction={dispatchTodosAction} />
      ) : (
        <Flex justifyContent="space-between">
          <Button
            onClick={() => {
              dispatchTodosAction({
                type: 'NewTodo',
              });
            }}
            icon={<span>✔️</span>}
          >
            添加事项
          </Button>
          <div>需要做什么？</div>
        </Flex>
      )}
    </div>
  );
};
