/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useState } from 'react';
import useForm from 'react-hook-form';

import { FormGroup, InputGroup, TextArea, Button } from '@yishanzhilubp/core';

import { f, HandleError } from '@/src/api';
import { TaiCard } from '@/src/components/layouts';
import { Flex } from '@/src/components/flex';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import { IGoal, IMission } from '@/src/model/schemas';
import { IDetail } from './detailCards';
import { detailTypeConfigs } from './configs';

export const DetailCardEditing: React.FC<{
  detail: IDetail;
  onStopEditing: () => void;
  setDetail: React.Dispatch<React.SetStateAction<IGoal | IMission>>;
  type: 'goal' | 'mission';
}> = ({ detail, onStopEditing, setDetail, type }) => {
  interface IPatchMissionFormValue {
    title: string;
    description: string;
  }
  const { dispatch } = useWorkProfileContext();
  const { register, handleSubmit, errors } = useForm<IPatchMissionFormValue>({
    defaultValues: {
      title: detail.title,
      description: detail.description,
    },
  });
  const { labelName, descPlaceholder } = detailTypeConfigs[type];
  const [loading, setLoading] = useState(false);
  const onSubmit = handleSubmit(async data => {
    setLoading(true);
    try {
      const { data: updated } = await f.patch<IDetail>(
        `/${type}/${detail.id}`,
        {
          ...data,
        }
      );
      onStopEditing();
      setDetail({ ...updated });
      dispatch({
        type: 'UpdateTitle',
        title: updated.title,
        id: detail.id,
        goalID: updated.goalID,
        schema: type,
      });
    } catch (error) {
      HandleError(error, true);
    } finally {
      setLoading(false);
    }
  });
  return (
    <TaiCard title={`${labelName}详情`}>
      <form onSubmit={onSubmit}>
        <FormGroup
          disabled={loading}
          intent="primary"
          label={`${labelName}名`}
          helperText={errors.title && errors.title.message}
        >
          <InputGroup
            fill
            autoComplete="off"
            disabled={loading}
            placeholder={`${labelName}的简洁代号`}
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
          intent="primary"
          label={`${labelName}描述`}
          labelInfo="（可选）"
          helperText={errors.description && errors.description.message}
        >
          <TextArea
            fill
            autoComplete="off"
            disabled={loading}
            placeholder={descPlaceholder}
            growVertically
            rows={2}
            inputRef={register({
              maxLength: { value: 255, message: '不能大于255个字符' },
            })}
            name="description"
          />
        </FormGroup>
        <Flex>
          <Button intent="primary" type="submit">
            更新
          </Button>
          <Button onClick={onStopEditing}>取消</Button>
        </Flex>
      </form>
    </TaiCard>
  );
};
