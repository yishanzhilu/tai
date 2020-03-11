/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useEffect } from 'react';
import { AppLayout } from '@/src/components/layouts/app';

import { WorkSpaceSidebar } from './components/sidebar';
import {
  useWorkProfileContext,
  IWorkProfileDetail,
} from '../global/workProfileContext';

export const WorkSpace: React.FC<{
  newDetail?: IWorkProfileDetail;
}> = ({ children, newDetail = { missions: [] } }) => {
  const { dispatch } = useWorkProfileContext();
  useEffect(() => {
    dispatch({ type: 'SetCurrentDetail', newDetail });
  }, [newDetail.goalID, newDetail.missionID]);
  return <AppLayout sidebar={<WorkSpaceSidebar />} content={children} />;
};
