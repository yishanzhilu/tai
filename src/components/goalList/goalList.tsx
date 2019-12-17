/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { Goal, IndependentMissions } from './goal';
import { NewGoal } from './newGoal';
import { TaiList } from '@/src/layout/taiList';
import { useGlobalContext } from '@/src/contexts/global';

export function GoalList() {
  const [store] = useGlobalContext();
  return (
    <TaiList title="目标">
      {store.work.goals.map(g => (
        <li key={g.id}>
          <Goal goal={g} />
        </li>
      ))}
      {store.work.missions.length > 0 && (
        <li>
          <IndependentMissions missions={store.work.missions} />
        </li>
      )}

      <li>
        <NewGoal />
      </li>
    </TaiList>
  );
}
