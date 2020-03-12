/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';
import { MenuDivider, MenuItem, Classes } from '@yishanzhilubp/core';

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
      <MenuDivider title="目标" />
      {memoGoals.length ? (
        memoGoals.map(g => {
          return (
            <MenuItem
              icon={<span>🎯</span>}
              text={g.title}
              onClick={() =>
                onSelectGoalMission({ goalID: g.id, goalTitle: g.title })
              }
              className={Classes.POPOVER_DISMISS}
              key={`goal-${g.id}`}
            >
              {g.missions && (
                <>
                  <MenuDivider title="子任务" />
                  {g.missions.map(m => (
                    <MenuItem
                      icon={<span>📌</span>}
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
                </>
              )}
            </MenuItem>
          );
        })
      ) : (
        <MenuItem text="未设立" />
      )}
    </>
  );
}
