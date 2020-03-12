/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useState, useCallback } from 'react';
import {
  Classes,
  FormGroup,
  InputGroup,
  TextArea,
  Button,
  // HTMLSelect,
  // Switch,
} from '@yishanzhilubp/core';
import useForm from 'react-hook-form';
import Router from 'next/router';
import { f, HandleError } from '@/src/api';
import { IGoal, IMission } from '@/src/model/schemas';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';

import { useTopBarContext } from '../topBarContext';

export const NewGoalForm: React.FC = () => {
  interface INewGoalFormValue {
    title: string;
    description: string;
  }
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors, watch } = useForm<INewGoalFormValue>({
    defaultValues: {
      title: '',
      description: '',
    },
  });
  const titleLength = watch('title').length;
  const descriptionLength = watch('description').length;
  const { dispatch: dispatchTopBar } = useTopBarContext();
  const { dispatch: dispatchWorkProfile } = useWorkProfileContext();
  const onSubmit = useCallback(
    handleSubmit(async data => {
      setLoading(true);
      try {
        const { data: createdGoal } = await f.post<IGoal>('/goals', {
          ...data,
          status: 'doing',
        });

        Router.push(
          `/workspace/goal/[id]`,
          `/workspace/goal/${createdGoal.id}`
        );
        dispatchTopBar({
          type: 'SetNewGoalDialog',
          isOpen: false,
          startNow: true,
        });
        dispatchWorkProfile({ type: 'AddGoal', goal: createdGoal });
      } catch (error) {
        HandleError(error, true);
      } finally {
        setLoading(false);
      }
    }),
    []
  );
  return (
    <form onSubmit={onSubmit}>
      <div className={Classes.DIALOG_BODY}>
        <FormGroup
          disabled={loading}
          label="目标名"
          intent={errors.title || titleLength > 80 ? 'primary' : 'none'}
          helperText={
            errors.title ? errors.title.message : `${titleLength} / 80`
          }
        >
          <InputGroup
            fill
            autoComplete="off"
            disabled={loading}
            placeholder="目标的简洁代号"
            autoFocus
            inputRef={register({
              required: '必填',
              maxLength: { value: 255, message: '不能大于255个字符' },
            })}
            name="title"
          />
        </FormGroup>
        <FormGroup
          disabled={loading}
          intent={
            errors.description || descriptionLength > 255 ? 'primary' : 'none'
          }
          label="目标描述"
          labelInfo="（可选）"
          helperText={
            errors.description
              ? errors.description.message
              : `${descriptionLength} / 255`
          }
        >
          <TextArea
            fill
            autoComplete="off"
            disabled={loading}
            placeholder="目标的具体内容，例如关键指标，时间节点"
            rows={2}
            growVertically
            inputRef={register({
              maxLength: { value: 255, message: '不能大于255个字符' },
            })}
            name="description"
          />
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button intent="primary" type="submit" loading={loading}>
            确定
          </Button>
          <Button
            onClick={() =>
              dispatchTopBar({ type: 'SetNewGoalDialog', isOpen: false })
            }
            loading={loading}
          >
            取消
          </Button>
        </div>
      </div>
    </form>
  );
};

export const NewMissionForm: React.FC = () => {
  const { state, dispatch } = useWorkProfileContext();
  const {
    state: { startNow, goalID },
    dispatch: dispatchTopBar,
  } = useTopBarContext();
  interface INewMissionFormValue {
    title: string;
    description: string;
  }
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, errors, watch } = useForm<
    INewMissionFormValue
  >({
    defaultValues: {
      title: '',
      description: '',
    },
  });
  const titleLength = watch('title').length;
  const descriptionLength = watch('description').length;
  const onSubmit = useCallback(
    handleSubmit(async data => {
      setLoading(true);
      try {
        const { data: mission } = await f.post<IMission>('/missions', {
          ...data,
          goalID,
          status: startNow ? 'doing' : 'todo',
        });
        dispatchTopBar({ type: 'SetNewMissionDialog', isOpen: false });
        dispatch({ type: 'AddDetailMission', mission });
        if (mission.status === 'doing') {
          dispatch({ type: 'AddMission', mission, goalID: mission.goalID });
        }
        if (
          !state.currentDetail.goalID ||
          state.currentDetail.goalID !== mission.goalID
        )
          Router.push(
            `/workspace/mission/[id]`,
            `/workspace/mission/${mission.id}`
          );
      } catch (error) {
        HandleError(error, true);
      } finally {
        setLoading(false);
      }
    }),
    [goalID]
  );
  return (
    <form onSubmit={onSubmit}>
      <div className={Classes.DIALOG_BODY}>
        <FormGroup
          disabled={loading}
          intent={errors.title || titleLength > 80 ? 'primary' : 'none'}
          label="任务名"
          helperText={
            errors.title ? errors.title.message : `${titleLength} / 80`
          }
        >
          <InputGroup
            fill
            autoComplete="off"
            disabled={loading}
            placeholder="任务的简洁代号"
            autoFocus
            inputRef={register({
              required: '必填',
              maxLength: { value: 80, message: '字数不能大于80个' },
            })}
            name="title"
          />
        </FormGroup>
        <FormGroup
          disabled={loading}
          intent={
            errors.description || descriptionLength > 255 ? 'primary' : 'none'
          }
          label="任务描述"
          labelInfo="（可选）"
          helperText={
            errors.description
              ? errors.description.message
              : `${descriptionLength} / 255`
          }
        >
          <TextArea
            fill
            autoComplete="off"
            disabled={loading}
            placeholder="任务的具体内容，和执行的步骤"
            growVertically
            rows={2}
            inputRef={register({
              maxLength: { value: 255, message: '字数不能大于255个' },
            })}
            name="description"
          />
        </FormGroup>
        {/* <FormGroup label="父级目标">
          <HTMLSelect
            fill
            value={goalID}
            onChange={e => setGoalID(Number(e.currentTarget.value))}
            options={[{ label: '无，设为独立任务', value: 0 }].concat(
              state.goals.map(g => ({ label: g.title, value: g.id }))
            )}
          />
        </FormGroup> */}
        {/* {!!goalID && (
          <FormGroup label="立刻开始" inline>
            <Switch
              disabled={loading}
              large
              checked={startNow}
              onChange={e => {
                setStartNow((e.target as HTMLInputElement).checked);
              }}
            />
          </FormGroup>
        )} */}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button intent="primary" type="submit" loading={loading}>
            确定
          </Button>
          <Button
            onClick={() =>
              dispatchTopBar({
                type: 'SetNewMissionDialog',
                isOpen: false,
                startNow: true,
              })
            }
            loading={loading}
          >
            取消
          </Button>
        </div>
      </div>
    </form>
  );
};
