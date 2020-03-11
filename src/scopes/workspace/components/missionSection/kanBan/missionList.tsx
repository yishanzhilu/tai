/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { Classes } from '@yishanzhilubp/core';
import { IMission } from '@/src/model/schemas';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import { MissionCard } from './missionCard';

const MissionListMemo = React.memo(function missionList({
  missions,
}: {
  missions: IMission[];
}) {
  return (
    <>
      {missions.map((mission: IMission, index: number) => (
        <MissionCard key={mission.id} mission={mission} index={index} />
      ))}
    </>
  );
});

type InnerListProps = {
  empty: boolean;
  title?: string;
  dropProvided: DroppableProvided;
  missions: IMission[];
};

const InnerList: React.FC<InnerListProps> = ({
  missions,
  dropProvided,
  empty,
}) => {
  let emptyPlaceHolder: string;
  switch (dropProvided.droppableProps['data-rbd-droppable-id']) {
    case 'doing':
      emptyPlaceHolder = '没有进行的任务';
      break;
    case 'todo':
      emptyPlaceHolder = '没有计划的任务';
      break;
    case 'done':
      emptyPlaceHolder = '没有完成的任务';
      break;
    default:
      break;
  }
  return (
    <div
      ref={dropProvided.innerRef}
      style={{
        paddingBottom: 8,
        overflowX: 'hidden',
        overflowY: 'auto',
        height: 250,
        padding: 5,
      }}
    >
      <MissionListMemo missions={missions} />
      {empty && <span className={Classes.TEXT_MUTED}>{emptyPlaceHolder}</span>}
      {dropProvided.placeholder}
    </div>
  );
};

interface IMissionList {
  listId?: string;
  listType?: string;
  missions: IMission[];
  title?: string;
  disabled?: boolean;
}

export const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean
): string => {
  if (isDraggingOver) {
    return 'rgba(191, 204, 214, 0.6)';
  }
  if (isDraggingFrom) {
    return 'rgba(191, 204, 214, 0.4)';
  }
  return null;
};

export const MissionList: React.FC<IMissionList> = ({
  listId = 'LIST',
  listType,
  missions,
  title,
}) => {
  return (
    <Droppable droppableId={listId} type={listType}>
      {(dropProvided, dropSnapshot) => (
        <div
          // isDraggingOver={dropSnapshot.isDraggingOver}
          // isDropDisabled={isDropDisabled}
          // isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          <div
            style={{
              background: getBackgroundColor(
                dropSnapshot.isDraggingOver,
                Boolean(dropSnapshot.draggingFromThisWith)
              ),
              borderRadius: 3,
            }}
          >
            <InnerList
              missions={missions}
              title={title}
              empty={missions.length === 0 && !dropSnapshot.isDraggingOver}
              dropProvided={dropProvided}
            />
          </div>
        </div>
      )}
    </Droppable>
  );
};
