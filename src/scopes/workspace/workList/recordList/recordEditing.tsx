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

import { IRecord } from '@/src/model/schemas';
import { useUserContext } from '@/src/scopes/global/userContext';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';

import { RecordsContext } from './recordListReduceContext';

export const RecordEditing: React.FC<{ record: IRecord }> = ({ record }) => {
  const { dispatch: dispatchWorkProfile } = useWorkProfileContext();
  const { dispatch: dispatchUser } = useUserContext();

  const { dispatch } = React.useContext(RecordsContext);
  const handleCancel = () => {
    dispatch({ type: 'EditRecordCancel' });
  };

  const [loading, setLoading] = React.useState(false);
  const [minutes, setMinutes] = React.useState(record.minutes);
  const defaultTimeValue = new Date();
  defaultTimeValue.setHours(Math.floor(minutes / 60), minutes % 60);
  const [mood, setMood] = React.useState(record.mood);
  const [minutesError, setMinutesError] = React.useState('');

  interface IFromValue {
    content: string;
    review: string;
    mood: string;
  }
  const { register, handleSubmit, errors, watch } = useForm<IFromValue>({
    defaultValues: {
      content: record.content,
      review: record.review,
      mood: record.mood,
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
        const { data: res } = await f.patch<IRecord>(`/record/${record.id}`, {
          content,
          review,
          minutes,
          mood,
        });
        setLoading(false);
        dispatch({ type: 'EditRecordDone', record: res });
        dispatchUser({
          type: 'UpdateMinutes',
          minutes: res.minutes - record.minutes,
        });
        dispatchWorkProfile({
          type: 'UpdateCurrentDetailMinutes',
          minutes: res.minutes - record.minutes,
        });
      } catch (error) {
        TaiToast.show({
          message: error.message,
          intent: 'primary',
        });
        setLoading(false);
      }
    }),
    [minutes, mood]
  );

  return (
    <div onKeyDown={handleKeyDown}>
      <Card>
        <form onSubmit={onSubmit}>
          <H6>编辑记录</H6>
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
              inputRef={register({
                required: '必填',
                maxLength: { value: 255, message: '不能大于255个字符' },
              })}
              name="content"
            />
          </FormGroup>
          <FormGroup
            label="当时的想法"
            labelInfo="（可选）"
            disabled={loading}
            intent={errors.review || reviewLength > 255 ? 'primary' : 'none'}
            helperText={
              errors.review ? errors.review.message : `${reviewLength} / 255`
            }
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
          <FormGroup label="当时的心情">
            <RadioGroup
              inline
              name="group"
              disabled={loading}
              selectedValue={mood}
              onChange={e => setMood(e.currentTarget.value)}
            >
              <Radio label="无" value="" />
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
              defaultValue={defaultTimeValue}
              disabled={loading}
              onChange={handleTimePickerChange}
              invokeOnInputChange
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
    </div>
  );
};
