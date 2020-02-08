/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import {
  useWorkProfileContext,
  IGoalBrief,
  IMissionBrief,
} from '@/src/scopes/global/workProfileContext';
import { useWorkSpaceContext } from '@/src/scopes/workspace';

export function useWorkProfileGoalsMissions(): [IGoalBrief[], IMissionBrief[]] {
  const {
    state: { goals, missions },
  } = useWorkProfileContext();
  const {
    state: {
      goalMission: { goalID, missionID },
    },
  } = useWorkSpaceContext();

  // fitler goals and missions based on current goal/mission
  if (goalID && missionID) {
    // is goal/mission detail page
    const filterdGoals = goals
      .filter(g => g.id === goalID)
      .map(g => {
        return {
          ...g,
          missions: g.missions.filter(m => m.id === missionID),
        };
      });
    return [filterdGoals, []];
  }
  if (goalID) {
    // in goal detail page
    return [goals.filter(g => g.id === goalID), []];
  }
  if (missionID) {
    // in independent mission page
    return [[], missions.filter(m => m.id === missionID)];
  }
  // not in detail page
  return [goals, missions];
}
