/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useState, useEffect, useCallback } from 'react';

import {
  Button,
  H4,
  Popover,
  Menu,
  MenuItem,
  Tag,
  Classes,
  Divider,
  Dialog,
} from '@yishanzhilubp/core';
import Head from 'next/head';

import { f } from '@/src/api';
import { TaiCard } from '@/src/components/layouts';
import { InfoBlock } from '@/src/components/infoBlock';
import { Flex } from '@/src/components/flex';
import { STATUS_CONFIG_MAP } from '@/src/utils/constants';
import { formatMinutes, formatDate } from '@/src/utils/funcs';
import { useWorkSpaceContext } from '@/src/scopes/workspace';
import { BasicStatus } from '@/src/model/schemas';
import { DetailCardEditing } from './detailCardEditing';
import { detailTypeConfigs } from './detailCardConfigs';

export interface IDetail {
  id: number;
  type: 'mission' | 'goal';
  title: string;
  status: 'doing' | 'done' | 'drop' | 'todo';
  goalID?: number;
  description: string;
  minutes: number;
  createdAt: string;
  updatedAt: string;
}

const status2Action = (status: BasicStatus) => {
  switch (status) {
    case 'todo':
      return '暂停';
    case 'done':
      return '完成';
    case 'drop':
      return '放弃';
    case 'doing':
      return '开始';
    default:
      return '完成';
  }
};

const status2ActionDesc = (status: BasicStatus) => {
  switch (status) {
    case 'todo':
      return '暂停后将进入规划';
    case 'done':
      return '完成后将进入成就';
    case 'drop':
      return '放弃后将进入回收站';
    case 'doing':
      return "Let's do this!";
    default:
      return '完成';
  }
};

export const StatusTag: React.FC<{ status: BasicStatus }> = ({ status }) => {
  const statusConfig = STATUS_CONFIG_MAP[status];
  return (
    <Tag
      minimal
      style={{
        backgroundColor: statusConfig.color,
        color: 'white',
        fontSize: 10,
      }}
    >
      {statusConfig.text}
    </Tag>
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
  const [dialogConfig, setDialogCOnfig] = useState<{
    newStatus?: BasicStatus;
    isOpen: boolean;
  }>({
    newStatus: null,
    isOpen: false,
  });
  const closeDialog = () => {
    setDialogCOnfig({
      newStatus: null,
      isOpen: false,
    });
  };
  const { labelName } = detailTypeConfigs[detail.type];
  useEffect(() => {
    setDetail(initDetail);
  }, [initDetail.id]);

  const setStatus = (newStatus: BasicStatus) => {
    setDialogCOnfig({
      newStatus,
      isOpen: true,
    });
  };
  const onDialogConfirm = useCallback(async () => {
    console.log(dialogConfig);
    await f.patch(`/${detail.type}/${detail.id}`, {
      status: dialogConfig.newStatus,
    });
  }, [dialogConfig]);

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
              <MenuItem
                icon={<span>⏸️</span>}
                text={`暂停${labelName}`}
                onClick={() => setStatus('todo')}
              />
              <MenuItem icon={<span>🏆</span>} text={`完成${labelName}`} />
              <MenuItem icon={<span>⛔</span>} text={`放弃${labelName}`} />
            </Menu>
          }
        >
          <Button minimal small icon="more" />
        </Popover>
        <Dialog
          title={`${status2Action(dialogConfig.newStatus)}${labelName}`}
          isOpen={dialogConfig.isOpen}
          onClose={closeDialog}
        >
          <div className={Classes.DIALOG_BODY}>
            {status2ActionDesc(dialogConfig.newStatus)}
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button intent="primary" onClick={onDialogConfirm}>
                确定
              </Button>
              <Button onClick={closeDialog}>取消</Button>
            </div>
          </div>
        </Dialog>
      </div>
      <StatusTag status={detail.status} />
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
