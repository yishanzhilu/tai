/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { IGoal, IMission, IGoalMission } from '@/src/model/schemas';
import { noop } from '@/src/utils/funcs';

/**
 * WorkProfile Context is used to store user's current goals and missions
 * so in left bar, user can nav between them,
 * and in creation forms, use can assign parent scopes.
 */

export type IMissionBrief = Pick<IMission, 'title' | 'id' | 'goalID'>;

export interface IGoalBrief extends Pick<IGoal, 'title' | 'id'> {
  missions?: IMissionBrief[];
}

export type IWorkProfileDetail = IGoalMission & { missions: IMission[] };

interface IWorkProfileContextState {
  goals: IGoalBrief[];
  missions: IMissionBrief[];
  currentDetail: IWorkProfileDetail;
}

type IWorkProfileContextAction =
  | { type: 'Init'; goals: IGoalBrief[]; missions: IMissionBrief[] }
  | { type: 'AddGoal'; goal: IGoalBrief }
  | { type: 'RemoveGoal'; id: number }
  | { type: 'AddMission'; mission: IMission; goalID?: number }
  | { type: 'RemoveMission'; id: number; goalID?: number }
  | {
      type: 'UpdateTitle';
      id: number;
      schema: 'goal' | 'mission';
      goalID?: number;
      title: string;
    }
  | {
      type: 'SetCurrentDetail';
      newDetail: IWorkProfileDetail;
    }
  | {
      type: 'UpdateCurrentDetailMinutes';
      minutes: number;
    };

const defaultState: IWorkProfileContextState = {
  goals: [],
  missions: [],
  currentDetail: {
    missions: [],
  },
};

const WorkProfileGoalReducer = (
  goal: IGoalBrief,
  action: IWorkProfileContextAction
): IGoalBrief => {
  switch (action.type) {
    case 'RemoveMission':
      if (goal.id === action.goalID) {
        return {
          ...goal,
          missions: goal.missions.filter(m => m.id !== action.id),
        };
      }
      return goal;
    case 'UpdateTitle':
      if (action.schema === 'goal') {
        if (goal.id === action.id) {
          return {
            ...goal,
            title: action.title,
          };
        }
        return goal;
      }
      // action.schema === 'mission'
      if (goal.id === action.goalID) {
        return {
          ...goal,
          missions: goal.missions.map(m => {
            if (m.id === action.id) {
              return {
                ...m,
                title: action.title,
              };
            }
            return m;
          }),
        };
      }
      return goal;
    default:
      return goal;
  }
};

const WorkProfileContextReducer = (
  state: IWorkProfileContextState,
  action: IWorkProfileContextAction
): IWorkProfileContextState => {
  switch (action.type) {
    case 'Init':
      return {
        ...state,
        goals: action.goals,
        missions: action.missions,
      };
    case 'AddGoal':
      return {
        ...state,
        goals: [...state.goals, action.goal].sort((a, b) => a.id - b.id),
        missions: state.missions,
      };
    case 'RemoveGoal':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.id),
        missions: state.missions,
      };
    case 'AddMission':
      if (action.goalID) {
        if (action.goalID === state.currentDetail.goalID) {
          return {
            ...state,
            currentDetail: {
              ...state.currentDetail,
              missions: [...state.currentDetail.missions, action.mission],
            },
          };
        }
      }
      return {
        ...state,
        goals: state.goals,
        missions: [...state.missions, action.mission],
      };
    case 'RemoveMission':
      if (action.goalID) {
        return {
          ...state,
          goals: state.goals.map(g => WorkProfileGoalReducer(g, action)),
          missions: state.missions,
        };
      }
      return {
        ...state,
        goals: state.goals,
        missions: state.missions.filter(m => m.id !== action.id),
      };
    case 'UpdateTitle':
      if (action.schema === 'goal') {
        return {
          ...state,
          goals: state.goals.map(g => WorkProfileGoalReducer(g, action)),
          missions: state.missions,
        };
      }
      // action.schema === 'mission'
      if (action.goalID) {
        // goal sub-mission
        return {
          ...state,
          goals: state.goals.map(g => WorkProfileGoalReducer(g, action)),
          missions: state.missions,
        };
      }
      // independent mission
      return {
        ...state,
        goals: state.goals,
        missions: state.missions.map(m => {
          if (m.id === action.id) {
            return {
              ...m,
              title: action.title,
            };
          }
          return m;
        }),
      };
    case 'SetCurrentDetail':
      return {
        ...state,
        currentDetail: action.newDetail,
      };
    case 'UpdateCurrentDetailMinutes':
      return {
        ...state,
        currentDetail: {
          ...state.currentDetail,
          minutes: action.minutes,
        },
      };
    default:
      return defaultState;
  }
};

const WorkProfileContext = React.createContext<{
  state: IWorkProfileContextState;
  dispatch: React.Dispatch<IWorkProfileContextAction>;
}>({ state: defaultState, dispatch: noop });

export const useWorkProfileContext = () => React.useContext(WorkProfileContext);

export const WorkProfileContextPorvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    WorkProfileContextReducer,
    defaultState
  );
  return (
    <WorkProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkProfileContext.Provider>
  );
};
