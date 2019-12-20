/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { IMission, IGoal } from './schemas';
import { missionReducer } from './missionReducer';

type IGoalAction =
  | { type: 'AddMission'; mission: IMission }
  | { type: 'RemoveMission'; missionID: number; goalID?: number }
  | {
      type: 'UpdateMinutes';
      minutes: number;
      goalID?: number;
      missionID?: number;
    };

export const goalReducer = (goal: IGoal, goalAction: IGoalAction): IGoal => {
  switch (goalAction.type) {
    case 'AddMission':
      if (goalAction.mission.goalID !== goal.id) {
        return goal;
      }
      return {
        ...goal,
        missions: [...goal.missions, goalAction.mission],
      };
    case 'RemoveMission':
      if (goalAction.goalID !== goal.id) return goal;

      return {
        ...goal,
        missions: goal.missions.filter(m => m.id !== goalAction.missionID),
      };
    case 'UpdateMinutes':
      if (goalAction.goalID !== goal.id) return goal;
      return {
        ...goal,
        missions: goal.missions.map(m => missionReducer(m, goalAction)),
        minutes: goal.minutes + goalAction.minutes,
      };
    /* istanbul ignore next */
    default:
      return goal;
  }
};
