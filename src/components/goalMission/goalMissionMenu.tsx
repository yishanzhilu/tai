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
} from '@yishanzhilu/blueprint-core';

import { ITodo, IGoalMission } from '@/src/model/schemas';

import { GoalMission } from './goalMission';
import { eventHandlerWarning } from '@/src/utils/funcs';
import { useGlobalContext } from '@/src/contexts/global';

const GoalMissionSelectMenuItems = ({
  onSelectGoalMission = eventHandlerWarning(
    'GoalMissionSelectMenuItems-onSelectGoalMission'
  ),
}: {
  onSelectGoalMission?: (todo: Partial<ITodo>) => void;
}) => {
  const [store] = useGlobalContext();
  return (
    <>
      <MenuDivider title="目标" />
      {store.work &&
        store.work.goals.map(g => {
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
            </MenuItem>
          );
        })}
      <MenuDivider title="独立任务" />
      {store.work &&
        store.work.missions.map(m => (
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
};

export const GoalMissionMenu = ({
  goalMission,
  onSelectGoalMission = eventHandlerWarning('onSelectGoalMission'),
  disabled,
}: {
  goalMission: IGoalMission;
  disabled?: boolean;
  onSelectGoalMission?: (goalMission: IGoalMission) => void;
}) => {
  return (
    <ButtonGroup>
      <Popover
        minimal
        autoFocus={false}
        content={
          <Menu>
            <GoalMissionSelectMenuItems
              onSelectGoalMission={onSelectGoalMission}
            />
          </Menu>
        }
        position={Position.BOTTOM_LEFT}
      >
        <Button small icon="swap-vertical" disabled={disabled}>
          <GoalMission isTag={false} goalMission={goalMission} />
        </Button>
      </Popover>
      {goalMission.goalID || goalMission.missionID ? (
        <Button
          small
          disabled={disabled}
          onClick={() =>
            onSelectGoalMission({
              goalID: 0,
            })
          }
          icon="cross"
        />
      ) : null}
    </ButtonGroup>
  );
};
