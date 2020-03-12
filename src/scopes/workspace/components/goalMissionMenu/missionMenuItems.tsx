/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';
import { MenuDivider, MenuItem } from '@yishanzhilubp/core';

import { IMissionBrief } from '@/src/scopes/global/workProfileContext';
import { IGoalMission } from '@/src/model/schemas';

export function MissionMenuItems({
  memoMissions,
  onSelectGoalMission,
}: {
  memoMissions: IMissionBrief[];
  onSelectGoalMission: (goalMission: IGoalMission) => void;
}) {
  return (
    <>
      <MenuDivider title="独立任务" />
      {memoMissions.length ? (
        memoMissions.map(m => (
          <MenuItem
            icon={<span>📌</span>}
            text={m.title}
            onClick={() =>
              onSelectGoalMission({ missionID: m.id, missionTitle: m.title })
            }
            key={`mission-${m.id}`}
          />
        ))
      ) : (
        <MenuItem text="未设立" />
      )}
    </>
  );
}
