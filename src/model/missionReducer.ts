/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { IMission } from './schemas';

type IMissionAction = {
  type: 'UpdateMinutes';
  minutes: number;
  goalID?: number;
  missionID?: number;
};

export const missionReducer = (
  mission: IMission,
  missionAction: IMissionAction
): IMission => {
  switch (missionAction.type) {
    case 'UpdateMinutes':
      if (missionAction.missionID === mission.id) {
        return {
          ...mission,
          minutes: mission.minutes + mission.minutes,
        };
      }
      return mission;
    default:
      return mission;
  }
};
