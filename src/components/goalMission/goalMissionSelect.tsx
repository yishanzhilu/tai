/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import {
  Menu,
  MenuItem,
  Button,
  MenuDivider,
  ButtonGroup,
} from '@yishanzhilu/blueprint-core';
import {
  Select,
  ItemRenderer,
  ItemListRenderer,
} from '@yishanzhilu/blueprint-select';

import { IGoalMission, IWorkProfile } from '@/src/model/schemas';

import { GoalMission } from './goalMission';
import { eventHandlerWarning } from '@/src/utils/funcs';
import { useGlobalContext } from '@/src/contexts/global';

interface IGoalMissionSelectorItem {
  type: 'goal' | 'mission';
  id: number;
  title: string;
  missions?: IGoalMissionSelectorItem[];
  goalID?: number;
  goalTitle?: string;
}

const renderGoalMission: ItemRenderer<IGoalMissionSelectorItem> = (
  item,
  { handleClick, modifiers }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      icon={<span>{item.type === 'goal' ? '🎯' : '📜'}</span>}
      key={item.title}
      onClick={handleClick}
      text={item.title}
    >
      {item.missions &&
        item.missions.map(m => (
          <MenuItem
            icon={<span>📜</span>}
            text={m.title}
            key={m.id}
            onClick={(e: React.MouseEvent<HTMLElement>) => handleClick(e, m)}
          />
        ))}
    </MenuItem>
  );
};

const renderMenu: ItemListRenderer<IGoalMissionSelectorItem> = ({
  items,
  itemsParentRef,
  renderItem,
}) => {
  const goals = items.filter(item => item.type === 'goal');
  const missions = items.filter(item => item.type === 'mission');
  return (
    <Menu ulRef={itemsParentRef}>
      <MenuDivider title="目标" />
      {goals.map(renderItem)}
      <MenuDivider title="独立任务" />
      {missions.map(renderItem)}
    </Menu>
  );
};

const GoalMissionSelector = Select.ofType<IGoalMissionSelectorItem>();

const computeGoalMissionItems = (
  work: IWorkProfile
): IGoalMissionSelectorItem[] => {
  const res: IGoalMissionSelectorItem[] = [];
  work.goals.forEach(g => {
    res.push({
      id: g.id,
      type: 'goal',
      title: g.title,
      missions: g.missions.map(m => {
        return {
          type: 'mission',
          id: m.id,
          title: m.title,
          goalID: g.id,
          goalTitle: g.title,
        };
      }),
    });
  });
  work.missions.forEach(m => {
    res.push({
      type: 'mission',
      id: m.id,
      title: m.title,
    });
  });
  return res;
};

export const GoalMissionSelect = ({
  goalMission,
  onSelectGoalMission = eventHandlerWarning('onSelectGoalMission'),
  disabled,
}: {
  goalMission: IGoalMission;
  disabled?: boolean;
  onSelectGoalMission?: (goalMission: IGoalMission) => void;
}) => {
  const [store] = useGlobalContext();
  const handleItemSelect = (item: IGoalMissionSelectorItem) => {
    if (item.type === 'goal') {
      onSelectGoalMission({ goalID: item.id, goalTitle: item.title });
    } else if (item.goalID) {
      onSelectGoalMission({
        goalID: item.goalID,
        goalTitle: item.goalTitle,
        missionID: item.id,
        missionTitle: item.title,
      });
    } else {
      onSelectGoalMission({
        missionID: item.id,
        missionTitle: item.title,
      });
    }
  };
  const items = React.useMemo(() => computeGoalMissionItems(store.work), [
    store.work,
  ]);
  const nonSelect = !goalMission.goalID && !goalMission.missionID;
  return (
    <ButtonGroup>
      <GoalMissionSelector
        items={items}
        onItemSelect={handleItemSelect}
        filterable={false}
        itemListRenderer={renderMenu}
        itemRenderer={renderGoalMission}
      >
        <Button
          rightIcon={nonSelect ? 'double-caret-vertical' : false}
          disabled={disabled}
        >
          <GoalMission
            isTag={false}
            goalMission={goalMission}
            emptyText="独立历程"
          />
        </Button>
      </GoalMissionSelector>
      {nonSelect ? null : (
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
      )}
    </ButtonGroup>
  );
};
