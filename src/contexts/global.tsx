/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import {
  IUserProfile,
  IWorkProfile,
  IGoal,
  IMission,
} from '@/src/model/schemas';
import { TaiErrorBoundary } from '@/src/components/errors/errorBoundary';
import TaiError from '@/pages/_error';

import { goalReducer } from '../model/goalReducer';
import { missionReducer } from '../model/missionReducer';
import { IS_BROWSER } from '../utils/env';

export type ITheme = 'light' | 'dark';

type IGlobalWorkAction =
  | { type: 'AddGoal'; goal: IGoal }
  | { type: 'RemoveGoal'; goalID: number }
  | { type: 'AddMission'; mission: IMission }
  | { type: 'RemoveMission'; missionID: number; goalID?: number }
  | {
      type: 'UpdateMinutes';
      minutes: number;
      goalID?: number;
      missionID?: number;
    };

const globalWorkReducer = (
  work: IWorkProfile,
  workAction: IGlobalWorkAction
): IWorkProfile => {
  switch (workAction.type) {
    case 'AddGoal':
      return {
        ...work,
        goals: [...work.goals, workAction.goal],
      };
    case 'RemoveGoal':
      return {
        ...work,
        goals: work.goals.filter(g => g.id !== workAction.goalID),
      };
    case 'AddMission':
      if (workAction.mission.goalID) {
        return {
          ...work,
          goals: work.goals.map(g => goalReducer(g, workAction)),
        };
      }
      return {
        ...work,
        missions: [...work.missions, workAction.mission],
      };
    case 'RemoveMission':
      if (workAction.goalID) {
        return {
          ...work,
          goals: work.goals.map(g => goalReducer(g, workAction)),
        };
      }
      return {
        ...work,
        missions: work.missions.filter(m => m.id !== workAction.missionID),
      };
    case 'UpdateMinutes': {
      return {
        goals: workAction.goalID
          ? work.goals.map(g => goalReducer(g, workAction))
          : work.goals,
        missions: workAction.missionID
          ? work.missions.map(m => missionReducer(m, workAction))
          : work.missions,
        minutes: work.minutes + workAction.minutes,
      };
    }
    default:
      return work;
  }
};

export type IGlobalAction =
  | { type: 'SetTheme'; newTheme: ITheme }
  | { type: 'LogOut' }
  | { type: 'Login'; user: IUserProfile }
  | IGlobalWorkAction;

export interface IGlobalState {
  user: IUserProfile;
  theme: ITheme;
  isLogin: boolean;
  work: IWorkProfile;
}

export const defaultGlobalState: IGlobalState = {
  user: { name: '', avatarUrl: '', id: 0, createdAt: '', updatedAt: '' },
  theme: 'light',
  isLogin: false,
  work: {
    goals: [],
    missions: [],
    minutes: 0,
  },
};

export const globalReducer = (
  globalState: IGlobalState,
  globalAction: IGlobalAction
): IGlobalState => {
  console.debug('globalReducer', globalAction, globalState);

  switch (globalAction.type) {
    case 'LogOut':
      return {
        ...defaultGlobalState,
        theme: globalState.theme,
      };
    case 'Login':
      return {
        ...globalState,
        user: globalAction.user,
        isLogin: true,
      };
    case 'SetTheme':
      if (IS_BROWSER) localStorage.setItem('tai-theme', globalAction.newTheme);
      return {
        ...globalState,
        theme: globalAction.newTheme,
      };
    case 'AddGoal':
      return {
        user: globalState.user,
        theme: globalState.theme,
        work: globalWorkReducer(globalState.work, globalAction),
        isLogin: true,
      };
    default:
      return globalState;
  }
};


// context and its provider for global store
export const GlobalContext = React.createContext<
  [IGlobalState, React.Dispatch<IGlobalAction>]
>(null);

export const useGlobalContext = () => {
  const context = React.useContext(GlobalContext);
  if (!context) {
    // this is especially useful in TypeScript
    // so you don't need to be checking for null all the time
    throw new Error('useGlobalContext must be used within a context.');
  }
  return context;
};

export const GlobalContextProvider = ({ children }) => {
  console.debug('GlobalContextProvider');
  const [state, dispatch] = React.useReducer(globalReducer, defaultGlobalState);
  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      <TaiErrorBoundary fallback={<TaiError statusCode={500} />}>
        {children}
      </TaiErrorBoundary>
    </GlobalContext.Provider>
  );
};
