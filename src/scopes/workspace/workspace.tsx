/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useState, Dispatch, SetStateAction } from 'react';
import { AppLayout } from '@/src/components/layouts/app';
import { WorkSpaceSidebar } from './components/sidebar';
import { IGoalMission } from '@/src/model/schemas';
import { noop } from '@/src/utils/funcs';

interface IWorkSpaceContextState {
  goalMission: IGoalMission;
  minutes: number;
}

const defaultState: IWorkSpaceContextState = {
  goalMission: {},
  minutes: 0,
};
interface IWorkSpaceContext {
  state: IWorkSpaceContextState;
  dispatch: Dispatch<SetStateAction<IWorkSpaceContextState>>;
}

const WorkSpaceContext = React.createContext<IWorkSpaceContext>({
  state: defaultState,
  dispatch: noop,
});

export const useWorkSpaceContext = () => React.useContext(WorkSpaceContext);

export const WorkSpace: React.FC<{ initialState?: IWorkSpaceContextState }> = ({
  children,
  initialState = defaultState,
}) => {
  const [state, dispatch] = useState<IWorkSpaceContextState>(initialState);
  return (
    <WorkSpaceContext.Provider value={{ state, dispatch }}>
      <AppLayout sidebar={<WorkSpaceSidebar />} content={children} />
    </WorkSpaceContext.Provider>
  );
};
