/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';

import {
  FormGroup,
  TextArea,
  Keys,
  Button,
  NumericInput,
  H5,
} from '@yishanzhilu/blueprint-core';
import useForm from 'react-hook-form';

import { TimePicker } from '@yishanzhilu/blueprint-datetime';
import { RHFInput } from 'react-hook-form-input';
import { eventHandlerWarning, HourMinutes2Hour } from '@/src/utils/funcs';

import Flex from '../flex';
import { ITodo, IRecord } from '@/src/types/schemas';

interface IProps {
  todo: ITodo;
  onClickSave: (record: IRecord) => void;
  onClickCancel: () => void;
}

const finishTodoReducer = (state, action) => {
  switch (action.type) {
    case 'Blur':
      return state;
    case 'Change':
      return state;
    case 'Submit':
      return state;
    default:
      return state;
  }
};

export const FinishingTodo = ({
  todo,
  onClickSave = eventHandlerWarning('Todo-onClickSave'),
  onClickCancel = eventHandlerWarning('Todo-onClickCancel'),
}: IProps) => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const onSubmit = handleSubmit(({ content, thoughts, hours }, e) => {
    onClickSave({
      content,
      thoughts,
      hours,
    });
  });

  // custom register hours on controlled TimePicker
  React.useEffect(() => {
    register({ name: 'hours' });
    setValue('hours', 0);
  }, [register]);
  const handleHoursChange = (newTime: Date) => {
    setValue(
      'hours',
      HourMinutes2Hour({
        hour: newTime.getHours(),
        minute: newTime.getMinutes(),
      })
    );
  };

  return (
    <div>
      <H5>完成事项</H5>
      <form className="input" onSubmit={onSubmit}>
        <FormGroup
          label="历程*"
          intent="primary"
          helperText={errors.content && '必填'}
        >
          <TextArea
            fill
            growVertically
            defaultValue={`完成了 ${todo.content}`}
            inputRef={register({ required: true, maxLength: 255 })}
            name="content"
          />
        </FormGroup>
        <FormGroup label="此刻的想法">
          <TextArea
            fill
            name="thoughts"
            inputRef={register({ maxLength: 255 })}
            growVertically
            autoFocus
            placeholder="有何总结、反思、感悟？"
          />
        </FormGroup>
        <FormGroup label="大约做了多久（小时 : 分钟）">
          <TimePicker selectAllOnFocus onChange={handleHoursChange} />
        </FormGroup>
        <Flex>
          <Button intent="primary" type="submit">
            加油
          </Button>
          <Button minimal onClick={onClickCancel}>
            取消
          </Button>
        </Flex>
      </form>
    </div>
  );
};
