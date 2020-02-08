/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useCallback } from 'react';
import useForm from 'react-hook-form';
import { TimePicker } from '@yishanzhilubp/datetime';

import {
  Keys,
  Card,
  H6,
  FormGroup,
  TextArea,
  Button,
} from '@yishanzhilubp/core';

import { f } from '@/src/api';

import { Flex } from '@/src/components/flex';
import { TaiToast } from '@/src/utils/toaster';

import { useWorkListContext } from '@/src/scopes/workspace/workList';

import { IGoalMission, IRecord } from '@/src/model/schemas';

import { RecordsContext } from './recordListReduceContext';
import { useWorkSpaceContext } from '../../workspace';
import { GoalMissionMenu } from '../../components/goalMissionMenu';
import { useUserContext } from '@/src/scopes/global/userContext';

export const NewRecordEditing = () => {
  const [{ finishedTodo }, setWorkList] = useWorkListContext();
  const {
    state: { goalMission: initialGoalMission },
  } = useWorkSpaceContext();
  const { dispatch: dispatchUser } = useUserContext();
  const { dispatch: dispatchWorkSpace } = useWorkSpaceContext();
  const defaultGoalMission = finishedTodo || initialGoalMission;
  const [goalMission, setGoalMission] = React.useState<IGoalMission>({
    goalID: defaultGoalMission.goalID,
    goalTitle: defaultGoalMission.goalTitle,
    missionID: defaultGoalMission.missionID,
    missionTitle: defaultGoalMission.missionTitle,
  });

  const { dispatch } = React.useContext(RecordsContext);
  const handleCancel = () => {
    setWorkList({});
    dispatch({ type: 'AddRecordCancel' });
  };

  const [loading, setLoading] = React.useState(false);
  const [minutes, setMinutes] = React.useState(0);
  const [minutesError, setMinutesError] = React.useState();

  interface IFromValue {
    content: string;
    review: string;
  }
  const { register, handleSubmit, errors } = useForm<IFromValue>({
    defaultValues: {
      content: finishedTodo ? `完成了${finishedTodo.content}` : '',
      review: '',
    },
  });

  const handleTimePickerChange = useCallback((newTime: Date) => {
    const m = newTime.getHours() * 60 + newTime.getMinutes();
    if (m <= 60 * 8) {
      setMinutesError(null);
    }
    setMinutes(m);
  }, []);

  const handleSelectGoalMission = useCallback(
    (newGoalMission: IGoalMission) => {
      setGoalMission(newGoalMission);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.which === Keys.ESCAPE) {
        handleCancel();
      }
    },
    []
  );

  const onSubmit = useCallback(
    handleSubmit(async ({ content, review }) => {
      if (minutes > 60 * 8) {
        setMinutesError('不能大于8小时');
        return;
      }
      setLoading(true);
      try {
        const res = await f.post<IRecord>(`/records`, {
          content,
          review,
          minutes,
          ...goalMission,
        });

        setWorkList({});
        setLoading(false);
        dispatch({ type: 'AddRecordDone', record: res.data });
        dispatchUser({ type: 'UpdateMinutes', minutes });
        dispatchWorkSpace(pre => ({ ...pre, minutes: pre.minutes + minutes }));
      } catch (error) {
        TaiToast.show({
          message: error.message,
          intent: 'primary',
        });
        setLoading(false);
      }
    }),
    [goalMission, minutes]
  );

  return (
    <div className="new-record-form" onKeyDown={handleKeyDown}>
      <Card>
        <form className="input" onSubmit={onSubmit}>
          <H6>记录历程</H6>
          <FormGroup
            disabled={loading}
            intent="primary"
            helperText={errors.content && errors.content.message}
          >
            <TextArea
              fill
              disabled={loading}
              growVertically
              placeholder="完成了什么有意义的事情吗？"
              autoFocus
              inputRef={register({
                required: '必填',
                maxLength: { value: 255, message: '不能大于255个字符' },
              })}
              name="content"
            />
          </FormGroup>
          <FormGroup
            label="此刻的想法"
            labelInfo="（可选）"
            disabled={loading}
            intent="primary"
            helperText={errors.review && errors.review.message}
          >
            <TextArea
              fill
              disabled={loading}
              name="review"
              inputRef={register({
                maxLength: { value: 255, message: '不能大于255个字符' },
              })}
              growVertically
              placeholder="有何总结、反思、感悟？"
            />
          </FormGroup>
          <FormGroup
            label="大约做了多久"
            intent="primary"
            disabled={loading}
            helperText={minutesError}
          >
            <TimePicker
              showArrowButtons
              selectAllOnFocus
              disabled={loading}
              onChange={handleTimePickerChange}
              invokeOnInputChange
            />
          </FormGroup>
          <FormGroup label="选择父级目标、任务" disabled={loading}>
            <GoalMissionMenu
              disabled={loading}
              goalMission={goalMission}
              onSelectGoalMission={handleSelectGoalMission}
            />
          </FormGroup>
          <Flex>
            <Button intent="primary" type="submit" loading={loading}>
              感觉不错
            </Button>
            <Button minimal disabled={loading} onClick={handleCancel}>
              取消
            </Button>
          </Flex>
        </form>
      </Card>
      <style jsx>{`
        .new-record-form {
          position: relative;
          top: -75px;
          width: 100%;
          margin-bottom: -75px;
        }

        .new-record-form :global(.bp3-card) {
          z-index: 20;
          position: relative;
        }
      `}</style>
    </div>
  );
};
