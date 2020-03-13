/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';
import { MenuItem, Classes } from '@yishanzhilubp/core';

import { IGoalBrief } from '@/src/scopes/global/workProfileContext';
import { IGoalMission } from '@/src/model/schemas';

export function GoalMenuItems({
  memoGoals,
  onSelectGoalMission,
}: {
  memoGoals: IGoalBrief[];
  onSelectGoalMission: (goalMission: IGoalMission) => void;
}) {
  return (
    <>
      {memoGoals.map(g => {
        return (
          <React.Fragment key={g.id}>
            <MenuItem
              icon={<span>🎯</span>}
              text={g.title}
              onClick={() =>
                onSelectGoalMission({ goalID: g.id, goalTitle: g.title })
              }
              className={Classes.POPOVER_DISMISS}
            />
            {g.missions &&
              g.missions.map(m => (
                <MenuItem
                  icon={<span style={{ marginLeft: 20 }}>📌</span>}
                  text={m.title}
                  key={m.id}
                  style={{ maxWidth: 250 }}
                  onClick={() =>
                    onSelectGoalMission({
                      missionID: m.id,
                      missionTitle: m.title,
                      goalID: g.id,
                      goalTitle: g.title,
                    })
                  }
                />
              ))}
          </React.Fragment>
        );
      })}
    </>
  );
}
