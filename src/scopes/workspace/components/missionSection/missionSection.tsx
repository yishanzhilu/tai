/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React, { useState, ReactText } from 'react';

import { H5, Card, Tabs, Tab, Divider } from '@yishanzhilubp/core';

import { Flex } from '@/src/components/flex';

import { KanBan } from './kanBan';
import { Recycle } from './recycle';

export const MissionSection: React.FC = () => {
  const [tab, setTab] = useState<ReactText>('kanban');
  return (
    <div>
      <H5>任务</H5>
      <Card>
        <Flex justifyContent="space-between">
          <Tabs
            id="TabsExample"
            onChange={newTabId => setTab(newTabId)}
            selectedTabId={tab}
          >
            <Tab
              id="kanban"
              title="看板"
              // panel={<KanBan initial={missions} />}
            />
            <Tab id="recyle" title="回收站" />
          </Tabs>
        </Flex>
        <Divider style={{ margin: '10px 0' }} />
        {tab === 'kanban' ? <KanBan /> : <Recycle />}
      </Card>
    </div>
  );
};
