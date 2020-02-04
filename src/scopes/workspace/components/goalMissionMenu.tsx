/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import {
  Popover,
  Menu,
  MenuItem,
  Position,
  Button,
  MenuDivider,
  ButtonGroup,
  Classes,
  // Classes,
} from '@yishanzhilubp/core';

import { IGoalMission } from '@/src/model/schemas';

import { GoalMission } from '@/src/components/goalMission/goalMission';
import { eventHandlerWarning } from '@/src/utils/funcs';
import {
  useWorkProfileContext,
  IGoalBrief,
  IMissionBrief,
} from '@/src/scopes/global/workProfileContext';
import { useWorkSpaceContext } from '@/src/scopes/workspace';

function GoalMenuItems({
  memoGoals,
  onSelectGoalMission,
}: {
  memoGoals: IGoalBrief[];
  onSelectGoalMission: (goalMission: IGoalMission) => void;
}) {
  return (
    <>
      <MenuDivider title="目标" />
      {memoGoals.map(g => {
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
                    icon={<span>📜</span>}
                    text={m.title}
                    key={m.id}
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
      })}
    </>
  );
}

function MissionMenuItems({
  memoMissions,
  onSelectGoalMission,
}: {
  memoMissions: IMissionBrief[];
  onSelectGoalMission: (goalMission: IGoalMission) => void;
}) {
  return (
    <>
      <MenuDivider title="独立任务" />
      {memoMissions.map(m => (
        <MenuItem
          icon={<span>📜</span>}
          text={m.title}
          onClick={() =>
            onSelectGoalMission({ missionID: m.id, missionTitle: m.title })
          }
          key={`mission-${m.id}`}
        />
      ))}
    </>
  );
}

function useGoalsMissions(): [IGoalBrief[], IMissionBrief[]] {
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

export const GoalMissionMenu = ({
  goalMission,
  emptyText,
  onSelectGoalMission = eventHandlerWarning('onSelectGoalMission'),
  disabled,
}: {
  goalMission: IGoalMission;
  emptyText?: string;
  disabled?: boolean;
  onSelectGoalMission?: (goalMission: IGoalMission) => void;
}) => {
  const {
    state: { goalMission: initailGoalMission },
  } = useWorkSpaceContext();
  const isSpecificMission = !!initailGoalMission.missionID;
  const onCross = React.useCallback(() => {
    if (initailGoalMission.goalID || initailGoalMission.missionID) {
      onSelectGoalMission(initailGoalMission);
    } else {
      onSelectGoalMission({ goalID: 0 });
    }
  }, [initailGoalMission]);

  const [goals, missions] = useGoalsMissions();
  return (
    <ButtonGroup>
      <Popover
        minimal
        disabled={isSpecificMission}
        autoFocus={false}
        content={
          <Menu>
            {goals.length ? (
              <GoalMenuItems
                memoGoals={goals}
                onSelectGoalMission={onSelectGoalMission}
              />
            ) : null}
            {missions.length ? (
              <MissionMenuItems
                memoMissions={missions}
                onSelectGoalMission={onSelectGoalMission}
              />
            ) : null}
          </Menu>
        }
        position={Position.BOTTOM_LEFT}
      >
        <Button small icon="swap-vertical" disabled={disabled}>
          <GoalMission
            isTag={false}
            goalMission={goalMission}
            emptyText={emptyText}
          />
        </Button>
      </Popover>
      {(goalMission.goalID || goalMission.missionID) && !isSpecificMission ? (
        <Button small disabled={disabled} onClick={onCross} icon="cross" />
      ) : null}
    </ButtonGroup>
  );
};
