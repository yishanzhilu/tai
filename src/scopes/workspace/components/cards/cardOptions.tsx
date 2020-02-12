/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useState, useCallback } from 'react';
import Router from 'next/router';
import {
  Popover,
  Menu,
  MenuItem,
  Button,
  Dialog,
  Classes,
} from '@yishanzhilubp/core';

import { BasicStatus } from '@/src/model/schemas';
import { f } from '@/src/api';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';

import { detailTypeConfigs } from './configs';

const status2Action = (status: BasicStatus | 'delete') => {
  switch (status) {
    case 'delete':
      return `删除`;
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

const status2ActionDesc = (
  newStatus: BasicStatus | 'delete',
  itemTypeLabel: string,
  oldStatus: BasicStatus = 'todo'
) => {
  switch (newStatus) {
    case 'delete':
      return `❌ 删除${itemTypeLabel}后不可恢复`;
    case 'todo':
      return `⏸️ 暂停后${itemTypeLabel}将进入规划`;
    case 'done':
      return `🏆 完成后${itemTypeLabel}将进入成就`;
    case 'drop':
      return `⛔ 放弃后可以在回收站找回${itemTypeLabel}`;
    case 'doing':
      if (oldStatus === 'todo') return `✨ Let's do this!`;
      if (oldStatus === 'doing') return `✨ Let's do this!`;
      return `✨ Let's do this!`;
    default:
      return 'never';
  }
};

export const CardOptions: React.FC<{
  type: 'goal' | 'mission';
  id: number;
  status: BasicStatus;
  mini?: boolean;
  onEditClick?: () => void;
}> = ({ onEditClick, type, id, status: oldStatus, mini = false }) => {
  const { labelName } = detailTypeConfigs[type];
  const [dialogConfig, setDialogCOnfig] = useState<{
    newStatus?: BasicStatus | 'delete';
    isOpen: boolean;
  }>({
    newStatus: null,
    isOpen: false,
  });
  const onSetStatus = useCallback((newStatus: BasicStatus | 'delete') => {
    setDialogCOnfig({
      newStatus,
      isOpen: true,
    });
  }, []);
  const onCloseDialog = useCallback(() => {
    setDialogCOnfig({
      newStatus: null,
      isOpen: false,
    });
  }, []);
  const { dispatch: dispatchWorkProfile } = useWorkProfileContext();

  const onDialogConfirm = useCallback(async () => {
    if (dialogConfig.newStatus === 'delete') {
      await f.delete(`/${type}/${id}`);
      setDialogCOnfig({
        newStatus: null,
        isOpen: false,
      });
      return;
    }
    const { data } = await f.patch(`/${type}/${id}`, {
      status: dialogConfig.newStatus,
    });
    setDialogCOnfig({
      newStatus: null,
      isOpen: false,
    });
    if (dialogConfig.newStatus === 'doing') {
      Router.push(`/workspace/${type}/[id]`, `/workspace/${type}/${id}`);
      if (type === 'goal') {
        dispatchWorkProfile({ type: 'AddGoal', goal: data });
      } else {
        dispatchWorkProfile({
          type: 'AddMission',
          mission: data,
          goalID: data.goalID,
        });
      }
    } else {
      if (type === 'goal') {
        dispatchWorkProfile({ type: 'RemoveGoal', id });
      } else {
        dispatchWorkProfile({
          type: 'RemoveMission',
          id: data.id,
          goalID: data.goalID,
        });
      }
      const routerMap = {
        done: '/workspace/trophy',
        drop: '/workspace/recycle',
      };
      Router.push(routerMap[dialogConfig.newStatus]);
    }
  }, [dialogConfig]);
  return (
    <div>
      <Popover
        position="bottom-right"
        content={
          <Menu>
            {!mini && (
              <>
                <MenuItem
                  icon={<span>📝</span>}
                  text={`更新${labelName}`}
                  onClick={onEditClick}
                />
                <MenuItem
                  icon={<span>🏆</span>}
                  text={`完成${labelName}`}
                  onClick={() => onSetStatus('done')}
                />
                <MenuItem
                  icon={<span>⛔</span>}
                  text={`放弃${labelName}`}
                  onClick={() => onSetStatus('drop')}
                />
              </>
            )}
            {mini && (
              <MenuItem
                icon={<span>✨</span>}
                text={`继续${labelName}`}
                onClick={() => onSetStatus('doing')}
              />
            )}
            {oldStatus === 'drop' && (
              <MenuItem
                icon={<span>❌</span>}
                text={`删除${labelName}`}
                onClick={() => onSetStatus('delete')}
              />
            )}
          </Menu>
        }
      >
        <Button minimal small icon="more" />
      </Popover>
      <Dialog
        title={`${status2Action(dialogConfig.newStatus)}${labelName}`}
        isOpen={dialogConfig.isOpen}
        onClose={onCloseDialog}
      >
        <div className={Classes.DIALOG_BODY} style={{ fontSize: 16 }}>
          {status2ActionDesc(dialogConfig.newStatus, labelName, oldStatus)}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent="primary" onClick={onDialogConfirm}>
              确定
            </Button>
            <Button onClick={onCloseDialog}>取消</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
