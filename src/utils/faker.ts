/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import faker from 'faker';
import { IGoal, IMission } from '../types/schemas';

export function fakeMission({ status = null, id = null }): IMission {
  return {
    id: id || faker.random.number(),
    title: faker.hacker.phrase(),
    description: faker.hacker.phrase(),
    hours: faker.random.number(24),
    status:
      status || faker.random.arrayElement(['doing', 'done', 'drop', 'plan']),
  };
}

export function fakeMissions(num: number): IMission[] {
  const missions = new Array(num);
  for (let index = 0; index < missions.length; index += 1) {
    missions[index] = fakeMission({ status: 'doing', id: faker.random.number() });
  }
  return missions;
}

export function fakeGoal({ status = null, id = null }): IGoal {
  return {
    id: id || faker.random.number(),
    title: faker.hacker.noun(),
    description: faker.hacker.phrase(),
    hours: faker.random.number(24),
    status:
      status || faker.random.arrayElement(['doing', 'done', 'drop', 'plan']),
    missions: fakeMissions(2),
  };
}

export function fakeGoals(num: number): IGoal[] {
  const goals = new Array(num);
  for (let index = 0; index < goals.length; index += 1) {
    goals[index] = fakeGoal({ status: 'doing', id: index + 1 });
  }
  return goals;
}
