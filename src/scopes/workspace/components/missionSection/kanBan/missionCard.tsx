/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useState, useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { IMission } from '@/src/model/schemas';
import Link from 'next/link';
import {
  Popover,
  Menu,
  MenuItem,
  Button,
  Dialog,
  Classes,
} from '@yishanzhilubp/core';
import { f } from '@/src/api';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import { TaiToastSuccess, TaiToastError } from '@/src/utils/toaster';
import { P } from '@/src/components/layouts/p';

export const MissionCard: React.FC<{
  index: number;
  mission: IMission;
  loading?: boolean;
}> = ({ mission, index }) => {
  const {
    computed: { freezed },
    dispatch,
  } = useWorkProfileContext();
  const [dialogConfig, setDialogConfig] = useState<{
    newStatus?: 'drop';
    isOpen: boolean;
    title: string;
    desc: string;
  }>({
    newStatus: null,
    isOpen: false,
    title: '',
    desc: '',
  });
  const onSetStatus = useCallback((newStatus: 'drop') => {
    setDialogConfig({
      newStatus,
      isOpen: true,
      title: '放弃任务',
      desc: '⛔ 放弃后可以在回收站找回任务',
    });
  }, []);
  const onCloseDialog = useCallback(() => {
    setDialogConfig({
      newStatus: null,
      isOpen: false,
      title: '',
      desc: '',
    });
  }, []);
  const onDialogConfirm = useCallback(async () => {
    if (dialogConfig.newStatus === 'drop') {
      try {
        const { data: updated } = await f.patch(`/mission/${mission.id}`, {
          status: 'drop',
        });
        onCloseDialog();
        dispatch({
          type: 'UpdateDetailMission',
          mission: updated,
        });
        TaiToastSuccess('放弃任务成功');
      } catch (error) {
        TaiToastError('放弃任务失败', error);
      }
    }
  }, [dialogConfig]);
  return (
    <Draggable
      draggableId={mission.id.toString()}
      index={index}
      isDragDisabled={freezed}
    >
      {provided => (
        <div
          ref={provided.innerRef}
          className="card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="row">
            <div style={{ marginRight: 10, maxWidth: 150 }}>
              <Link
                href="/workspace/mission/[id]"
                as={`/workspace/mission/${mission.id}`}
              >
                <a>
                  <P>{mission.title}</P>
                </a>
              </Link>
            </div>
            {!freezed && (
              <Popover
                position="bottom-left"
                boundary="viewport"
                content={
                  <Menu>
                    <MenuItem
                      icon={<span>⛔</span>}
                      text="放弃任务"
                      onClick={() => onSetStatus('drop')}
                    />
                  </Menu>
                }
              >
                <Button minimal small icon="more" />
              </Popover>
            )}
          </div>

          <Dialog
            title={dialogConfig.title}
            isOpen={dialogConfig.isOpen}
            onClose={onCloseDialog}
          >
            <div className={Classes.DIALOG_BODY} style={{ fontSize: 16 }}>
              {dialogConfig.desc}
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
          <style jsx>{`
            .card {
              box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px,
                rgba(15, 15, 15, 0.1) 0px 2px 4px;
              border-radius: 3px;
              margin-bottom: 8px;
              background: white;
              padding: 10px 12px;
              line-height: 1.5;
              // shrink size for windows scroll bar
            }
            .row {
              display: flex;
              justify-content: space-between;
              align-items: start;
            }
          `}</style>
        </div>
      )}
    </Draggable>
  );
};
