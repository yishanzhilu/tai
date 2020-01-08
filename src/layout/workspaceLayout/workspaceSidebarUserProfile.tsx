/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { Classes, ProgressBar, Tooltip } from '@yishanzhilubp/core';
import classNames from 'classnames';

import { Flex } from '@/src/components/flex';
import { useGlobalContext } from '@/src/contexts/global';

function UserProfileStat({ title = '', hours = 0 }) {
  return (
    <div className="user-profile-stat">
      <span>{title}</span>
      <p>
        <strong>{hours}</strong>
        <span className={Classes.TEXT_SMALL}>小时</span>
      </p>
      <style jsx>{`
        .user-profile-stat {
          width: 60px;
          line-height: 1.5;
        }
        strong {
          margin-right: 5px;
          width: 24px;
          display: inline-block;
          font-size: 16px;
          font-style: italic;
        }
        p {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export function UserProfile() {
  const [store] = useGlobalContext();
  const {
    work: { minutes },
    user: { username },
  } = store;
  const hours = Math.floor(minutes / 24);
  const hoursTo10k = 10000 - Math.ceil(minutes / 24);
  return (
    <div className="user-profile">
      <Flex className="row" alignItems="center">
        <img
          src="https://avatars0.githubusercontent.com/u/39581744?s=40&amp;v=4"
          width="20"
          height="20"
          alt="@ChiQianBingYue"
        />
        <div
          className={classNames(Classes.TEXT_OVERFLOW_ELLIPSIS)}
          style={{ fontWeight: 600, maxWidth: 125 }}
        >
          {username || '您好'}
        </div>
      </Flex>
      <div className="row">
        <Flex justifyContent="space-between">
          <Tooltip
            position="bottom-left"
            interactionKind="hover"
            hoverCloseDelay={50}
            content={<span>距离达成一万小时还差 {hoursTo10k} 小时</span>}
          >
            <span>累计历程</span>
          </Tooltip>
          <div>
            <strong>{hours}</strong>
            <span className={Classes.TEXT_SMALL}>小时</span>
          </div>
        </Flex>
        <div style={{ marginTop: 5 }}>
          <ProgressBar
            animate={false}
            stripes={false}
            value={Math.max(hours / 10000, 0.01)}
            intent="primary"
          />
        </div>
      </div>

      <Flex className="row" justifyContent="space-between">
        <UserProfileStat title="今日历程" hours={24} />
        <UserProfileStat title="本周历程" hours={24} />
        <UserProfileStat title="本月历程" hours={24} />
      </Flex>
      <style jsx>{`
        .user-profile {
          margin: 15px 20px 0;
        }
        .bar-title {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin: 0 0 5px;
        }
        strong {
          margin-right: 5px;
          font-weight: 600;
          font-size: 16px;
          font-style: italic;
        }
        .username {
          margin: 15px;
          line-height: 1.5;
          font-size: 14px;
          display: flex;
          align-items: center;
          font-weight: 500;
        }
        .username img {
          width: 20px;
          height: 20px;
          border-radius: 3px;
          margin-right: 10px;
        }
        .user-profile :global(.row) {
          margin: 5px 0 10px;
        }
      `}</style>
    </div>
  );
}
