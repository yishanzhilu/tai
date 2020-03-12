/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useState, useCallback } from 'react';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import Link from 'next/link';
import { IMission } from '@/src/model/schemas';
import {
  Classes,
  Popover,
  Button,
  Menu,
  MenuItem,
  Dialog,
} from '@yishanzhilubp/core';
import { f } from '@/src/api';
import { TaiToastError, TaiToastSuccess } from '@/src/utils/toaster';
import { P } from '@/src/components/layouts/p';

const MissionCard: React.FC<{ mission: IMission }> = ({ mission }) => {
  const {
    computed: { freezed },
    dispatch,
  } = useWorkProfileContext();
  const [dialogConfig, setDialogConfig] = useState<{
    newStatus?: 'delete' | 'restart';
    isOpen: boolean;
    title: string;
    desc: string;
  }>({
    newStatus: null,
    isOpen: false,
    title: '',
    desc: '',
  });
  const onSetStatus = useCallback((newStatus: 'delete' | 'restart') => {
    setDialogConfig({
      newStatus,
      isOpen: true,
      title: newStatus === 'delete' ? '永久删除' : '继续任务',
      desc:
        newStatus === 'delete'
          ? '❌ 永久删除任务后不可恢复'
          : '✨ 继续的任务会重新变为进行状态',
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
    if (dialogConfig.newStatus === 'restart') {
      try {
        const { data: updated } = await f.patch<IMission>(
          `/mission/${mission.id}`,
          {
            status: 'doing',
          }
        );
        onCloseDialog();
        dispatch({
          type: 'UpdateDetailMission',
          mission: updated,
        });
        dispatch({
          type: 'AddMission',
          mission: updated,
          goalID: updated.goalID,
        });
        TaiToastSuccess('继续任务成功');
      } catch (error) {
        TaiToastError('继续任务失败', error);
      }
    } else {
      try {
        await f.delete(`/mission/${mission.id}`);
        onCloseDialog();
        dispatch({
          type: 'RemoveDetailMission',
          id: mission.id,
          goalID: mission.goalID,
        });
        TaiToastSuccess('删除成功');
      } catch (error) {
        TaiToastError('永久删除任务失败', error);
      }
    }
  }, [dialogConfig]);
  return (
    <div className="card">
      <div className="row">
        <div style={{ marginRight: 10,  width: 150 }}>
          <Link
            href="/workspace/mission/[id]"
            as={`/workspace/mission/${mission.id}`}
          >
            <a>
              <P ellipsize>{mission.title}</P>
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
                  icon={<span>✨</span>}
                  text="继续任务"
                  onClick={() => onSetStatus('restart')}
                />
                <MenuItem
                  icon={<span>❌</span>}
                  text="永久删除"
                  onClick={() => onSetStatus('delete')}
                />
              </Menu>
            }
          >
            <Button minimal small icon="more" />
          </Popover>
        )}
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
      </div>

      <style jsx>{`
        .card {
          box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px,
            rgba(15, 15, 15, 0.1) 0px 2px 4px;
          border-radius: 3px;
          margin-right: 50px;
          margin-bottom: 8px;
          width: 220px;
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
  );
};

export const Recycle: React.FC = () => {
  const {
    state: {
      currentDetail: { missions = [] },
    },
  } = useWorkProfileContext();
  const delted = missions.filter(m => m.status === 'drop');
  return (
    <div className="recycle">
      {delted.length > 0 ? (
        delted.map(m => <MissionCard key={m.id} mission={m} />)
      ) : (
        <span className={Classes.TEXT_MUTED}>没有放弃的任务</span>
      )}
      <style jsx>{`
        .recycle {
          height: 277px;
          overflow-y: auto;
          padding: 5px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-content: flex-start;
        }
      `}</style>
    </div>
  );
};
