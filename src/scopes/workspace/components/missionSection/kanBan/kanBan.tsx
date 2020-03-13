/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  DropResult,
  DraggableLocation,
} from 'react-beautiful-dnd';
import { Divider, Button } from '@yishanzhilubp/core';

import { IMission } from '@/src/model/schemas';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import { useTopBarContext } from '@/src/scopes/global/topBarContext';
import { f } from '@/src/api';
import { TaiToastError } from '@/src/utils/toaster';

import { Column } from './column';

function getOrderArr(goalID: number): number[] {
  const arr = localStorage.getItem(`${goalID}-kanban-mission-order`);

  return JSON.parse(arr) || [];
}

function setOrderArr(goalID: number, map: MissionMap) {
  const arr = JSON.stringify(
    map.todo
      .concat(map.doing)
      .concat(map.done)
      .map(m => m.id)
  );

  localStorage.setItem(`${goalID}-kanban-mission-order`, arr);
}

type MissionMap = {
  todo: IMission[];
  doing: IMission[];
  done: IMission[];
};

const reorder = (
  list: IMission[],
  startIndex: number,
  endIndex: number
): IMission[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const reorderMissionMap = (
  missionMap: MissionMap,
  source: DraggableLocation,
  destination: DraggableLocation
): MissionMap => {
  const current: IMission[] = [...missionMap[source.droppableId]];
  const next: IMission[] = [...missionMap[destination.droppableId]];
  const target: IMission = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: IMission[] = reorder(
      current,
      source.index,
      destination.index
    );
    const result: MissionMap = {
      ...missionMap,
      [source.droppableId]: reordered,
    };
    return result;
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: MissionMap = {
    ...missionMap,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return result;
};

export const KanBan: React.FC = () => {
  const {
    state: {
      currentDetail: { missions = [], goalID },
    },
    dispatch: dispatchWorkProfile,
  } = useWorkProfileContext();
  const [missionMap, setMissionMap] = useState({
    todo: [],
    doing: [],
    done: [],
  });
  const { dispatch: dispatchTopBar } = useTopBarContext();
  useEffect(() => {
    if (!goalID) return;
    const missionOrder: number[] = getOrderArr(goalID);

    const sortedMissions = missions
      .filter(m => m.status !== 'drop')
      .sort((a, b) => {
        const o1 = missionOrder.indexOf(a.id);
        const o2 = missionOrder.indexOf(b.id);
        if (o1 >= 0 && o2 >= 0) {
          return o1 - o2;
        }
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

    const map = {
      todo: [],
      doing: [],
      done: [],
    };
    sortedMissions.forEach((mission: IMission) => {
      map[mission.status].push(mission);
    });
    setOrderArr(goalID, map);
    setMissionMap(map);
  }, [missions]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const ordered = reorderMissionMap(missionMap, source, destination);
    setOrderArr(goalID, ordered);
    setMissionMap(ordered);
    // 更新状态
    if (destination.droppableId === source.droppableId) {
      return;
    }
    try {
      const { data: mission } = await f.patch<IMission>(
        `/mission/${result.draggableId}`,
        {
          status: destination.droppableId,
        }
      );
      dispatchWorkProfile({ type: 'UpdateDetailMission', mission });
      if (destination.droppableId === 'doing') {
        dispatchWorkProfile({
          type: 'AddMission',
          mission,
          goalID: mission.goalID,
        });
      } else {
        dispatchWorkProfile({
          type: 'RemoveMission',
          id: mission.id,
          goalID: mission.goalID,
        });
      }
    } catch (error) {
      TaiToastError('更新任务状态失败', error);
      // 复原顺序
      setOrderArr(goalID, missionMap);
      setMissionMap(missionMap);
    }
  };

  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '820px',
            height: 277,
          }}
        >
          <Column
            missions={missionMap.todo}
            index={0}
            title="计划"
            id="todo"
            addButton={
              <Button
                small
                minimal
                icon="plus"
                onClick={() =>
                  dispatchTopBar({
                    type: 'SetNewMissionDialog',
                    isOpen: true,
                    startNow: false,
                    goalID,
                  })
                }
              />
            }
          />
          <Divider style={{ marginTop: 30 }} />
          <Column
            missions={missionMap.doing}
            index={1}
            title="进行"
            id="doing"
            addButton={
              <Button
                small
                minimal
                icon="plus"
                onClick={() =>
                  dispatchTopBar({
                    type: 'SetNewMissionDialog',
                    isOpen: true,
                    startNow: true,
                    goalID,
                  })
                }
              />
            }
          />
          <Divider style={{ marginTop: 30 }} />
          <Column missions={missionMap.done} index={2} title="完成" id="done" />
        </div>
      </DragDropContext>
    </div>
  );
};
