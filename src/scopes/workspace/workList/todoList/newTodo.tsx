/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useEffect } from 'react';

import { Button, Keys, FormGroup, TextArea, H6 } from '@yishanzhilubp/core';

// import { useInputRef } from '@/src/utils/hooks';
import { f } from '@/src/api';
import { IGoalMission } from '@/src/model/schemas';
import { TaiToast } from '@/src/utils/toaster';

import { Flex } from '@/src/components/flex';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import { GoalMissionMenu } from '@/src/scopes/workspace/components/goalMissionMenu';
import { useInputRef } from '@/src/utils/hooks';

import { ITodosActions } from './todoReducer';

const NewTodoEditing: React.FC<{
  dispatchTodosAction: React.Dispatch<ITodosActions>;
}> = ({ dispatchTodosAction }) => {
  const [loading, setLoading] = React.useState(false);
  const [input, ref] = useInputRef<HTMLTextAreaElement>();
  const [todo, setTodo] = React.useState('');
  const {
    state: { currentDetail: initialGoalMission },
  } = useWorkProfileContext();

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
    if (todo.length === 0) {
      setErrorMsg('必填');
      return;
    }
    if (todo.length > 255) {
      setErrorMsg('不能大于255个字符');
      return;
    }
    setLoading(true);
    dispatchTodosAction({
      type: 'Freeze',
    });
    const data = {
      content: todo.trim(),
      status: 'todo',
      ...goalMission,
    };
    try {
      const res = await f.post('/todos', data);
      dispatchTodosAction({
        type: 'NewTodoSubmit',
        todo: res.data,
      });
      setTodo('');
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
    handleSubmit();
  };
  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <H6>添加事项</H6>
        <FormGroup
          helperText={
            errorMsg || (
              <div>
                <span style={{ marginRight: 10 }}>{todo.length} /255</span>
                Ctrl + Enter 提交
              </div>
            )
          }
          intent={errorMsg || todo.length > 255 ? 'primary' : 'none'}
        >
          <TextArea
            fill
            growVertically
            inputRef={ref}
            autoFocus
            disabled={loading}
            value={todo}
            intent={errorMsg ? 'primary' : 'none'}
            placeholder="有什么需要做的吗"
            onChange={e => {
              setTodo(e.target.value);
              setErrorMsg('');
            }}
            onKeyDown={e => {
              if (e.which === Keys.ENTER) {
                if (e.ctrlKey) handleEnter();
              } else if (e.which === Keys.ESCAPE) {
                onCancel();
              }
            }}
          />
        </FormGroup>
        <FormGroup label="目标 / 任务">
          <GoalMissionMenu
            emptyText="无"
            goalMission={goalMission}
            onSelectGoalMission={onSelectGoalMission}
            disabled={loading}
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
          提交
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
    <div>
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
