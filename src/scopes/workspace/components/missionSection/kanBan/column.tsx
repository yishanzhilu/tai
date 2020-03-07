/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { IMission } from '@/src/model/schemas';
// TODO: add mission button from column
// import { Button } from '@yishanzhilubp/core';

import { MissionList } from './missionList';

export const Column: React.FC<{
  id: string;
  title: string;
  addButton?: React.ReactNode;
  missions: IMission[];
  index: number;
}> = ({ missions, title, id, addButton }) => {
  return (
    <div style={{ width: 250 }}>
      <div
        aria-label={`${title}任务列表`}
        style={{
          margin: 5,
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          height: 24,
        }}
      >
        {title}
        {addButton}
      </div>
      <MissionList
        listId={id}
        listType="MISSION"
        // style={{
        //   backgroundColor: snapshot.isDragging ? 'red' : null,
        // }}
        missions={missions}
      />
    </div>
  );
};
