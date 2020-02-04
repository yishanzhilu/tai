/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useState } from 'react';
import useForm from 'react-hook-form';

import {
  FormGroup,
  InputGroup,
  TextArea,
  Button,
  H4,
  Popover,
  Menu,
  MenuItem,
  Tag,
  Classes,
  Divider,
} from '@yishanzhilubp/core';
import Head from 'next/head';

import { f, HandleError } from '@/src/api';
import { TaiCard } from '@/src/components/layouts';
import { InfoBlock } from '@/src/components/infoBlock';
import { Flex } from '@/src/components/flex';
import { STATUS_CONFIG_MAP } from '@/src/utils/constants';
import { formatMinutes, formatDate } from '@/src/utils/funcs';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import { useWorkSpaceContext } from '@/src/scopes/workspace';

export interface IDetail {
  id: number;
  type: 'mission' | 'goal';
  title: string;
  status: 'doing' | 'done' | 'drop' | 'plan';
  goalID?: number;
  description: string;
  minutes: number;
  createdAt: string;
  updatedAt: string;
}

const detailTypeConfigs = {
  goal: {
    labelName: '目标',
    descPlaceholder: '目标的具体内容，例如关键指标，时间节点',
  },
  mission: {
    labelName: '任务',
    descPlaceholder: '任务的具体内容，和执行的步骤',
  },
};

const DetailCardEditing: React.FC<{
  detail: IDetail;
  onStopEditing: () => void;
  setDetail: React.Dispatch<React.SetStateAction<IDetail>>;
}> = ({ detail, onStopEditing, setDetail }) => {
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
  const { labelName, descPlaceholder } = detailTypeConfigs[detail.type];
  const [loading, setLoading] = useState(false);
  const onSubmit = handleSubmit(async data => {
    setLoading(true);
    try {
      const { data: updated } = await f.patch<IDetail>(
        `/${detail.type}/${detail.id}`,
        {
          ...data,
        }
      );

      onStopEditing();
      setDetail({ ...updated, type: detail.type });
      dispatch({
        type: 'UpdateTitle',
        title: updated.title,
        id: detail.id,
        goalID: updated.goalID,
        schema: detail.type,
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

export const DetailCard: React.FC<{ detail: IDetail }> = ({
  detail: initDetail,
}) => {
  const {
    state: { minutes },
  } = useWorkSpaceContext();
  const [isEditing, setIsEditing] = useState(false);
  const [detail, setDetail] = useState(initDetail);
  const statusConfig = STATUS_CONFIG_MAP[detail.status];
  const { labelName } = detailTypeConfigs[detail.type];

  if (isEditing) {
    return (
      <DetailCardEditing
        detail={detail}
        setDetail={setDetail}
        onStopEditing={() => setIsEditing(false)}
      />
    );
  }
  return (
    <TaiCard title={`${labelName}详情`}>
      <Head>
        <title>{detail.title} · 移山</title>
      </Head>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <H4>{detail.title}</H4>
        <Popover
          position="bottom-right"
          content={
            <Menu>
              <MenuItem
                icon={<span>📝</span>}
                text={`更新${labelName}`}
                onClick={() => setIsEditing(true)}
              />
              <MenuItem icon={<span>⏸️</span>} text={`暂停${labelName}`} />
              <MenuItem icon={<span>🏆</span>} text={`完成${labelName}`} />
              <MenuItem icon={<span>⛔</span>} text={`放弃${labelName}`} />
            </Menu>
          }
        >
          <Button minimal small icon="more" />
        </Popover>
      </div>
      <Tag style={{ backgroundColor: statusConfig.color }}>
        {statusConfig.text}
      </Tag>
      {detail.description && (
        <>
          <p style={{ marginTop: 20 }} className={Classes.TEXT_MUTED}>
            {labelName}描述
          </p>
          <p>{detail.description}</p>
        </>
      )}

      <Divider style={{ margin: '15px 0' }} />
      <Flex justifyContent="space-between">
        <InfoBlock label="累计时长" value={formatMinutes(minutes)} />
        <InfoBlock label="创建于" value={formatDate(detail.createdAt)} />
        <InfoBlock label="更新于" value={formatDate(detail.updatedAt)} />
      </Flex>
    </TaiCard>
  );
};
