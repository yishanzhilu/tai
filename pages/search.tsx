/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { NextPage } from 'next';

import { useRouter } from 'next/router';

import { Tabs, Tab } from '@yishanzhilubp/core';
import { LandingLayout } from '@/src/components/layouts/landing';

const Search: NextPage = () => {
  const { query } = useRouter();
  const [tab, setTab] = React.useState<React.ReactText>('goal');
  return (
    <LandingLayout>
      <main>
        <Tabs onChange={newTabId => setTab(newTabId)} selectedTabId={tab}>
          <Tab id="goal" title="目标" />
          <Tab id="mission" title="任务" />
          <Tab id="todo" title="事项" />
          <Tab id="record" title="记录" />
        </Tabs>
        <p>{query.q}</p>
      </main>
      <style jsx>{`
        main {
          max-width: 1000px;
          margin: 0 auto;
        }
      `}</style>
    </LandingLayout>
  );
};

export default Search;
