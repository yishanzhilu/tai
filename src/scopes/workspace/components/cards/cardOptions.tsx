/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useState, useCallback } from 'react';
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
import { detailTypeConfigs } from '../detailCardConfigs';

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

export const CardOptions: React.FC<{
  type: 'goal' | 'mission';
  id: number;
  onEditClick: () => void;
}> = ({ onEditClick, type, id }) => {
  const { labelName } = detailTypeConfigs[type];
  const [dialogConfig, setDialogCOnfig] = useState<{
    newStatus?: BasicStatus;
    isOpen: boolean;
  }>({
    newStatus: null,
    isOpen: false,
  });
  const onSetStatus = useCallback((newStatus: BasicStatus) => {
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
  const onDialogConfirm = useCallback(async () => {
    console.log(dialogConfig);
    await f.patch(`/${type}/${id}`, {
      status: dialogConfig.newStatus,
    });
  }, [dialogConfig]);
  return (
    <div>
      <Popover
        position="bottom-right"
        content={
          <Menu>
            <MenuItem
              icon={<span>📝</span>}
              text={`更新${labelName}`}
              onClick={onEditClick}
            />
            <MenuItem
              icon={<span>⏸️</span>}
              text={`暂停${labelName}`}
              onClick={() => onSetStatus('todo')}
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
        onClose={onCloseDialog}
      >
        <div className={Classes.DIALOG_BODY}>
          {status2ActionDesc(dialogConfig.newStatus)}
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
