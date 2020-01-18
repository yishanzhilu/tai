/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';

import {
  FormGroup,
  TextArea,
  Button,
  Card,
  Keys,
  H6,
} from '@yishanzhilubp/core';
import useForm from 'react-hook-form';

import { TimePicker } from '@yishanzhilubp/datetime';

import { Flex } from '../flex';
import { IRecord, IGoalMission } from '@/src/model/schemas';
import { FinishedTodoContext } from '@/src/contexts/finishedTodo';
import { axios } from '@/src/api';
import { GoalMissionSelect } from '../goalMission';
import { RecordsContext } from './recordListReduceContext';
import { Toast } from '@/src/utils/toaster';

interface IFromValue {
  content: string;
  thoughts: string;
}

export const NewRecordEditing = () => {
  const { finishedTodo, setFinishedTodo } = React.useContext(
    FinishedTodoContext
  );
  const { dispatch } = React.useContext(RecordsContext);

  const handleCancel = () => {
    setFinishedTodo({});
    dispatch({ type: 'AddRecordCancel' });
  };

  const [loading, setLoading] = React.useState(false);
  const [goalMission, setGoalMission] = React.useState<IGoalMission>({
    goalID: finishedTodo.goalID,
    goalTitle: finishedTodo.goalTitle,
    missionID: finishedTodo.missionID,
    missionTitle: finishedTodo.missionTitle,
  });
  const [minutes, setMinutes] = React.useState(0);
  const { register, handleSubmit, errors } = useForm<IFromValue>({
    defaultValues: {
      content: finishedTodo.content ? `完成了${finishedTodo.content}` : '',
      thoughts: '',
    },
  });

  const handleTimePickerChange = (newTime: Date) => {
    setMinutes(newTime.getHours() * 60 + newTime.getMinutes());
  };

  const handleSelectGoalMission = (newGoalMission: IGoalMission) => {
    console.debug('NewRecordEditing | handleSelectGoalMission', newGoalMission);
    setGoalMission(newGoalMission);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.which === Keys.ESCAPE) {
      handleCancel();
    }
  };

  const onSubmit = handleSubmit(async ({ content, thoughts }) => {
    console.debug('NewRecordEditing | handleSubmit', {
      content,
      thoughts,
      goalMission,
      minutes,
    });
    setLoading(true);
    try {
      const res = await axios.post<IRecord>(`/workspace/record`, {
        content,
        thoughts,
        minutes,
        ...goalMission,
      });
      setFinishedTodo({});
      setLoading(false);
      dispatch({ type: 'AddRecordDone', record: res.data });
    } catch (error) {
      Toast.show({
        message: error.message,
        intent: 'primary',
      });
      setLoading(false);
    }
  });

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
          <FormGroup label="此刻的想法" disabled={loading}>
            <TextArea
              fill
              disabled={loading}
              name="thoughts"
              inputRef={register({ maxLength: 255 })}
              growVertically
              placeholder="有何总结、反思、感悟？"
            />
          </FormGroup>
          <FormGroup label="大约做了多久" disabled={loading}>
            <TimePicker
              showArrowButtons
              selectAllOnFocus
              disabled={loading}
              onChange={handleTimePickerChange}
              invokeOnInputChange
            />
          </FormGroup>
          <FormGroup label="选择父级目标、任务" disabled={loading}>
            <GoalMissionSelect
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
          position: absolute;
          top: 0;
          width: 100%;
        }

        .new-record-form :global(.bp3-card) {
          z-index: 20;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export const NewRecord = () => {
  const { state, dispatch } = React.useContext(RecordsContext);
  const { setFinishedTodo } = React.useContext(FinishedTodoContext);
  const handleCancel = () => {
    setFinishedTodo({});
    dispatch({ type: 'AddRecordCancel' });
  };
  const NewRecordEl = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (state.addNew) {
      const headerOffset = 110;
      const elementPosition = NewRecordEl.current.offsetTop;
      console.debug('elementPosition', elementPosition);
      const offsetPosition = elementPosition - headerOffset;
      console.debug('offsetPosition', offsetPosition);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, [state.addNew]);
  return (
    <div className="new-record" ref={NewRecordEl}>
      <Card>
        <Flex justifyContent="space-between">
          <Button
            icon={<span>📝</span>}
            onClick={() => dispatch({ type: 'AddRecord' })}
          >
            记录历程
          </Button>
          <div>完成了什么有意义的事情吗？</div>
        </Flex>
      </Card>
      <div className="back-drop" onClick={handleCancel} />
      {state.addNew && <NewRecordEditing />}
      <style jsx>{`
        .new-record {
          position: relative;
          transition: all 0.3s;
        }
        .back-drop {
          background: #000;
          left: 0;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 20;
        }
      `}</style>
      <style jsx>{`
        .back-drop {
          bottom: ${state.addNew ? '0%' : '100%'};
          opacity: ${state.addNew ? '0.6' : '0'};
          transition: ${state.addNew
            ? 'opacity 0.3s'
            : 'opacity 0.3s, bottom 0s 0.3s'};
        }
      `}</style>
    </div>
  );
};
