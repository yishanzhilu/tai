/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import classNames from 'classnames';
import {
  Card,
  Classes,
  H6,
  Button,
  Popover,
  Menu,
  MenuItem,
  Dialog,
  Divider,
} from '@yishanzhilubp/core';

import { IRecord } from '@/src/model/schemas';
import { getDateDiffFromNow, formatMinutes } from '@/src/utils/funcs';
import { f, HandleError } from '@/src/api';
import { Flex } from '@/src/components/flex';
import { GoalMission } from '@/src/components/goalMission';
import { useUserContext } from '@/src/scopes/global/userContext';
import { P } from '@/src/components/layouts/p';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';

import { RecordsContext } from './recordListReduceContext';

interface IProps {
  record: IRecord;
}

export const Record = ({ record }: IProps): React.ReactElement => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { dispatch } = React.useContext(RecordsContext);
  const { dispatch: dispatchUser } = useUserContext();
  const { dispatch: dispatchWork } = useWorkProfileContext();

  const deleteCurrentRecord = React.useCallback(async () => {
    try {
      setLoading(true);
      dispatch({ type: 'Freeze' });
      await f.delete(`/record/${record.id}`);
      setDialogOpen(false);
      dispatch({ type: 'DeleteRecordDone', id: record.id });
      dispatchUser({ type: 'UpdateMinutes', minutes: -record.minutes });
      dispatchWork({
        type: 'UpdateCurrentDetailMinutes',
        minutes: record.minutes,
      });
    } catch (error) {
      HandleError(error, true);
    } finally {
      dispatch({ type: 'Unfreeze' });
      setLoading(false);
    }
  }, []);
  const duration = React.useMemo(() => formatMinutes(record.minutes), []);
  const closeDeleteDialog = React.useCallback(() => {
    if (loading) return;
    setDialogOpen(false);
  }, []);
  return (
    <Card>
      <Flex justifyContent="space-between">
        <span className={classNames(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
          <GoalMission
            goalMission={record}
            isTag
            isLink
            inline
            emptyText="独立历程"
          />{' '}
          @{getDateDiffFromNow(record.createdAt)}
          {record.minutes > 0 && <span> ⏳ 时长 {duration}</span>}
        </span>
        <span>
          <Popover
            autoFocus={false}
            position="bottom-right"
            content={
              <Menu>
                <MenuItem
                  intent="primary"
                  icon="trash"
                  text="删除"
                  onClick={() => setDialogOpen(true)}
                />
              </Menu>
            }
          >
            <Button small icon="caret-down" minimal />
          </Popover>
          <Dialog
            title="删除历程"
            isOpen={dialogOpen}
            onClose={closeDeleteDialog}
          >
            <div className={Classes.DIALOG_BODY}>
              删除后不可恢复。
              {record.minutes > 0 && (
                <>
                  <br />
                  <br />
                  个人累计历程、父级目标和任务的累计历程时长会减少 {duration}。
                </>
              )}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button intent="primary" onClick={deleteCurrentRecord}>
                  删除
                </Button>
                <Button onClick={closeDeleteDialog}>取消</Button>
              </div>
            </div>
          </Dialog>
        </span>
      </Flex>
      <H6 className={Classes.TEXT_MUTED} style={{ marginTop: 10 }}>
        历程
      </H6>
      <P>{record.content}</P>
      {record.review && (
        <>
          <Divider style={{ margin: 20 }} />
          <H6 className={Classes.TEXT_MUTED}>想法</H6>
          <P>{record.review}</P>
        </>
      )}
    </Card>
  );
};
