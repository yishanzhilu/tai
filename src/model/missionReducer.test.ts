/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { missionReducer } from './missionReducer';
import { IMission } from './schemas';

describe('Mission Reducer', () => {
  const mission: IMission = {
    id: 1,
    title: 'new Mission',
    status: 'doing',
    description: 'a mission for test',
    minutes: 1,
  };

  describe('UpdateMinutes action', () => {
    it('should work if missionID is right', () => {
      expect(
        missionReducer(mission, {
          type: 'UpdateMinutes',
          missionID: 1,
          minutes: 1,
        }).minutes
      ).toBe(2);
    });
    it('should fail if missionID is wrong', () => {
      expect(
        missionReducer(mission, {
          type: 'UpdateMinutes',
          missionID: 2,
          minutes: 1,
        }).minutes
      ).toBe(1);
    });
  });
});
