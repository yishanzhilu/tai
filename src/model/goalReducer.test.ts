/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { goalReducer } from './goalReducer';
import { IGoal } from './schemas';

describe('Goal Reducer', () => {
  const goal: IGoal = {
    id: 1,
    title: 'new Goal',
    status: 'doing',
    description: 'a goal for test',
    minutes: 1,
    missions: [
      {
        id: 1,
        minutes: 1,
        title: 'new mission',
        status: 'doing',
        description: 'a mission for test',
        goalID: 1,
      },
    ],
  };

  describe('UpdateMinutes action', () => {
    it('should work if goalID is right', () => {
      const newGoal = goalReducer(goal, {
        type: 'UpdateMinutes',
        goalID: 1,
        minutes: 1,
      });
      expect(newGoal.minutes).toBe(2);
    });
    it('if has wrong goalID, should fail', () => {
      expect(
        goalReducer(goal, { type: 'UpdateMinutes', minutes: 1 }).minutes
      ).toBe(1);
      expect(
        goalReducer(goal, { type: 'UpdateMinutes', minutes: 1, goalID: 2 })
          .minutes
      ).toBe(1);
    });
  });

  describe('AddMission Action', () => {
    it('if goalID is right, should work', () => {
      expect(
        goalReducer(goal, {
          type: 'AddMission',
          mission: {
            id: 2,
            minutes: 1,
            title: 'new mission',
            status: 'doing',
            description: 'a mission for test',
            goalID: 1,
          },
        }).missions.length
      ).toBe(2);
    });

    it("if new mission's goalID is wrong, should fail", () => {
      expect(
        goalReducer(goal, {
          type: 'AddMission',
          mission: {
            id: 2,
            minutes: 1,
            title: 'new mission',
            status: 'doing',
            description: 'a mission for test',
            goalID: 2,
          },
        }).missions.length
      ).toBe(1);
    });
  });

  describe('RemoveMission Action', () => {
    it('if goalID and missionID is right, should remove', () => {
      expect(
        goalReducer(goal, {
          type: 'RemoveMission',
          goalID: 1,
          missionID: 1,
        }).missions.length
      ).toBe(0);
    });

    it('if missionID is wrong, should fail', () => {
      expect(
        goalReducer(goal, {
          type: 'RemoveMission',
          goalID: 1,
          missionID: 2,
        }).missions.length
      ).toBe(1);
    });

    it('if goalID is wrong, should fail', () => {
      expect(
        goalReducer(goal, {
          type: 'RemoveMission',
          goalID: 2,
          missionID: 1,
        }).missions.length
      ).toBe(1);
    });
  });
});
