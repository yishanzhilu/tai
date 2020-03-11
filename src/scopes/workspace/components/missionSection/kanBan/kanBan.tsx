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

// const reorder = <T extends unknown>(
//   list: T[],
//   startIndex: number,
//   endIndex: number
// ) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);

//   return result;
// };

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
    const missionOrder: number[] =
      JSON.parse(localStorage.getItem(`${goalID}-kanban-mission-order`)) || [];

    const sortedMissions = missions.sort((a, b) => {
      const o1 = missionOrder.indexOf(a.id);
      const o2 = missionOrder.indexOf(b.id);
      if (o1 >= 0 && o2 >= 0) {
        return o1 - o2;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    const map = sortedMissions.reduce(
      (previous: MissionMap, mission: IMission) => {
        if (mission.status !== 'drop') previous[mission.status].push(mission);
        return previous;
      },
      {
        todo: [],
        doing: [],
        done: [],
      }
    );
    localStorage.setItem(
      `${goalID}-kanban-mission-order`,
      JSON.stringify(
        map.todo
          .concat(map.doing)
          .concat(map.done)
          .map(m => m.id)
      )
    );
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
    localStorage.setItem(
      `${goalID}-kanban-mission-order`,
      JSON.stringify(
        ordered.todo
          .concat(ordered.doing)
          .concat(ordered.done)
          .map(m => m.id)
      )
    );
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
      // dispatchWorkProfile({ type: 'UpdateDetailMission', mission });
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
      localStorage.setItem(
        `${goalID}-kanban-mission-order`,
        JSON.stringify(
          missionMap.doing
            .concat(missionMap.done)
            .concat(missionMap.todo)
            .map(m => m.id)
        )
      );
      setMissionMap(missionMap);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
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
  );
};
