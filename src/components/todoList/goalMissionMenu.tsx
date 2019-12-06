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

import { ITodo, IGoalMission } from '@/src/types/schemas';

import { useGlobalStore } from '@/src/store/global';
import { TodoGoalMission } from './todoGoalMission';
import { eventHandlerWarning } from '@/src/utils/funcs';

const GoalMissionSelectMenuItems = ({
  onSelectGoalMission = eventHandlerWarning(
    'GoalMissionSelectMenuItems-onSelectGoalMission'
  ),
}: {
  onSelectGoalMission?: (todo: Partial<ITodo>) => void;
}) => {
  const store = useGlobalStore();
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

export const GoalMissionUpdateMenu = ({
  goalMission,
  onSelectGoalMission,
  disabled,
}: {
  goalMission: IGoalMission;
  disabled: boolean;
  onSelectGoalMission: (goalMission: IGoalMission) => void;
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
        position={Position.BOTTOM_RIGHT}
      >
        <Button icon="swap-vertical" disabled={disabled}>
          <TodoGoalMission isTag={false} goalMission={goalMission} />
        </Button>
      </Popover>
      {goalMission.goalID || goalMission.missionID ? (
        <Button
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

export const GoalMissionNewMenu = ({
  goalMission,
  onSelectGoalMission,
}: {
  goalMission: IGoalMission;
  onSelectGoalMission: (goalMission: IGoalMission) => void;
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
        position={Position.BOTTOM_RIGHT}
      >
        <Button icon="swap-vertical">
          <TodoGoalMission isTag={false} goalMission={goalMission} />
        </Button>
      </Popover>
      {goalMission.goalID || goalMission.missionID ? (
        <Button
          onClick={() => onSelectGoalMission({ goalID: 0 })}
          icon="cross"
        />
      ) : null}
    </ButtonGroup>
  );
};
