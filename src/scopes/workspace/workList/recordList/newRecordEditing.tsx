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
  RadioGroup,
  Radio,
} from '@yishanzhilubp/core';

import { f } from '@/src/api';

import { Flex } from '@/src/components/flex';
import { TaiToast } from '@/src/utils/toaster';

import { useWorkListContext } from '@/src/scopes/workspace/workList';

import { IGoalMission, IRecord } from '@/src/model/schemas';
import { useUserContext } from '@/src/scopes/global/userContext';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';

import { RecordsContext } from './recordListReduceContext';
import { GoalMissionMenu } from '../../components/goalMissionMenu';

export const NewRecordEditing = () => {
  const [{ finishedTodo }, setWorkList] = useWorkListContext();
  const {
    state: { currentDetail: initialGoalMission },
    dispatch: dispatchWorkProfile,
  } = useWorkProfileContext();
  const { dispatch: dispatchUser } = useUserContext();
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
  const [mood, setMood] = React.useState('');
  const [simpleForm, setsimpleForm] = React.useState(true);
  const [minutesError, setMinutesError] = React.useState('');

  interface IFromValue {
    content: string;
    review: string;
  }
  const { register, handleSubmit, errors, watch } = useForm<IFromValue>({
    defaultValues: {
      content: finishedTodo ? `完成了${finishedTodo.content}` : '',
      review: '',
    },
  });
  const contentLength = watch('content').length;
  const reviewLength = watch('review').length;

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
        let body: Partial<IRecord>;
        if (simpleForm) {
          body = {
            content,
            ...goalMission,
          };
        } else {
          body = {
            content,
            review,
            minutes,
            mood,
            ...goalMission,
          };
        }
        const res = await f.post<IRecord>(`/records`, body);

        setWorkList({});
        setLoading(false);
        dispatch({ type: 'AddRecordDone', record: res.data });
        dispatchUser({ type: 'UpdateMinutes', minutes });
        dispatchWorkProfile({ type: 'UpdateCurrentDetailMinutes', minutes });
      } catch (error) {
        TaiToast.show({
          message: error.message,
          intent: 'primary',
        });
        setLoading(false);
      }
    }),
    [goalMission, minutes, mood, simpleForm]
  );

  return (
    <div className="new-record-form" onKeyDown={handleKeyDown}>
      <Card>
        <form className="input" onSubmit={onSubmit}>
          <H6>添加记录</H6>
          <FormGroup
            disabled={loading}
            intent={errors.content || contentLength > 255 ? 'primary' : 'none'}
            helperText={
              errors.content
                ? errors.content.message
                : `${contentLength} / 255 `
            }
          >
            <TextArea
              fill
              disabled={loading}
              growVertically
              rows={2}
              placeholder="需要记录点什么有事情吗？"
              autoFocus
              inputRef={register({
                required: '必填',
                maxLength: { value: 255, message: '不能大于255个字符' },
              })}
              name="content"
            />
          </FormGroup>
          {simpleForm ? (
            <Button
              onClick={() => {
                setsimpleForm(false);
              }}
              style={{ marginBottom: 20 }}
            >
              添加想法、心情、时长
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  setMinutes(0);
                  setMood('');
                  setsimpleForm(true);
                }}
                style={{ marginBottom: 20 }}
              >
                隐藏想法、心情、时长
              </Button>
              <FormGroup
                label="此刻的想法"
                labelInfo="（非必填）"
                disabled={loading}
                intent={
                  errors.review || reviewLength > 255 ? 'primary' : 'none'
                }
                helperText={
                  errors.review
                    ? errors.review.message
                    : `${reviewLength} / 255`
                }
              >
                <TextArea
                  fill
                  autoFocus
                  disabled={loading}
                  name="review"
                  inputRef={register({
                    maxLength: { value: 255, message: '不能大于255个字符' },
                  })}
                  growVertically
                  placeholder="有何总结、反思、感悟？"
                />
              </FormGroup>
              <FormGroup label="此刻的心情">
                <RadioGroup
                  inline
                  name="group"
                  disabled={loading}
                  selectedValue={mood}
                  onChange={e => setMood(e.currentTarget.value)}
                >
                  <Radio label="😀 开心" value="happy" />
                  <Radio label="🤩 激动" value="excited" />
                  <Radio label="😐 平静" value="peace" />
                  <Radio label="😉 得意" value="pride" />
                  <Radio label="☹️ 伤心" value="sad" />
                  <Radio label="😠 生气" value="angry" />
                </RadioGroup>
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
            </>
          )}

          <FormGroup label="选择父级目标、任务" disabled={loading}>
            <GoalMissionMenu
              disabled={loading}
              goalMission={goalMission}
              onSelectGoalMission={handleSelectGoalMission}
            />
          </FormGroup>
          <Flex>
            <Button intent="primary" type="submit" loading={loading}>
              提交
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
