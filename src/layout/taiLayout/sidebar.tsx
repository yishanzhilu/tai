/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Classes,
  Divider,
  Text,
  ProgressBar,
  Tooltip,
  Icon,
} from '@yishanzhilu/blueprint-core';

import { useGlobalStore } from '@/src/store/global';
import Flex from '@/src/components/flex';

function SidebarHeader({ children }) {
  return (
    <h6 className="sidebar-heading">
      {children}
      <style jsx>
        {`
          h6 {
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            margin: 15px 10px 10px;
            line-height: 17px;
            font-size: 14px;
          }
        `}
      </style>
    </h6>
  );
}

function SidebarAnchor({ children, href, asHref }) {
  return (
    <Link href={href} as={asHref}>
      <a>
        {children}
        <style jsx>{`
          a {
            color: inherit;
            display: flex;
            width: 100%;
            padding: 6px 0;
          }
          a:hover {
            color: inherit;
            text-decoration: none;
          }
        `}</style>
      </a>
    </Link>
  );
}

function NavLabel({
  href,
  asHref = '',
  title,
  emoji,
  currentPath = '',
  level = 0,
}) {
  const liClass = classnames(
    Classes.TREE_NODE,
    currentPath === (asHref || href) && Classes.TREE_NODE_SELECTED
  );
  return (
    <li className={liClass}>
      <div
        className={Classes.TREE_NODE_CONTENT}
        style={{ paddingRight: 14, paddingLeft: 23 * level + 14 }}
      >
        <SidebarAnchor href={href} asHref={asHref}>
          <span className={Classes.TREE_NODE_ICON}>{emoji}</span>
          <Text tagName="span" ellipsize>
            {title}
          </Text>
        </SidebarAnchor>
      </div>
    </li>
  );
}

function SidebarGoal({
  href,
  asHref = '',
  title,
  emoji,
  currentPath = '',
  missions,
}) {
  const liClass = classnames(
    Classes.TREE_NODE,
    currentPath === (asHref || href) && Classes.TREE_NODE_SELECTED
  );
  return (
    <li className={liClass}>
      <div className={Classes.TREE_NODE_CONTENT} style={{ padding: '0 14px' }}>
        <SidebarAnchor href={href} asHref={asHref}>
          <span className={Classes.TREE_NODE_ICON}>{emoji}</span>
          <Text className={Classes.TREE_NODE_LABEL} tagName="span" ellipsize>
            {title}
          </Text>
        </SidebarAnchor>
      </div>
      <div className={Classes.TREE_NODE_EXPANDED}>
        <ul className={Classes.TREE_NODE_LIST}>
          {missions.map(m => (
            <NavLabel
              level={1}
              key={m.id}
              asHref={`/workspace/missions/${m.id}`}
              href="/workspace/missions/[id]"
              title={m.title}
              emoji="📜"
              currentPath={currentPath}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}

function SidebarWorks({ currentPath = '' }) {
  const store = useGlobalStore();
  return (
    <ul className={Classes.TREE_NODE_LIST}>
      <SidebarHeader>目标</SidebarHeader>
      {store.work &&
        store.work.goals.map(g => (
          <SidebarGoal
            key={`goal-${g.id}`}
            missions={g.missions}
            asHref={`/workspace/goals/${g.id}`}
            href="/workspace/goals/[id]"
            title={g.title}
            emoji="🎯"
            currentPath={currentPath}
          />
        ))}
      <SidebarHeader>独立任务</SidebarHeader>
      {store.work &&
        store.work.missions.map(m => (
          <NavLabel
            key={`mission-${m.id}`}
            asHref={`/workspace/missions/${m.id}`}
            href="/workspace/missions/[id]"
            title={m.title}
            emoji="📜"
            currentPath={currentPath}
          />
        ))}
    </ul>
  );
}

function UserProfileStat({ title = '', hours = 0 }) {
  return (
    <div className="user-profile-stat">
      {/* <h3 className="bp3-heading">{title}</h3> */}
      <span>{title}</span>
      <p>
        <strong>{hours}</strong>
        <span>小时</span>
      </p>
      <style jsx>{`
        .user-profile-stat {
          width: 65px;
          line-height: 1.5;
        }
        strong {
          margin-right: 5px;
          width: 30px;
          display: inline-block;
          font-size: 16px;
        }
        p {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin: 0;
        }
        span {
        }
      `}</style>
    </div>
  );
}

function UserProfile({ user = { username: '', email: '' } }) {
  console.log('UserProfile', user);

  return (
    <div className="user-profile">
      {/* <div className="username">
        <img
          src="https://avatars3.githubusercontent.com/u/25254?s=64&v=4"
          alt="avatar"
        />
        <span>{user.username || user.email || 'tj'}</span>
      </div>
      <Divider /> */}
      <div className="total-hours">
        <div className="bar-title">
          <div>
            <strong>500</strong>
            <span>小时</span>
          </div>
          <Tooltip
            className={Classes.TOOLTIP_INDICATOR}
            position="bottom-right"
            interactionKind="hover"
            hoverCloseDelay={50}
            content={<span>距离达成1万小时还差9500小时</span>}
          >
            <Flex>
              <span>累计历程</span>
              <Icon icon="info-sign" iconSize={12} />
            </Flex>
          </Tooltip>
        </div>
        <ProgressBar
          animate={false}
          stripes={false}
          value={0.05}
          intent="primary"
        />
      </div>
      {/* <Divider /> */}

      <div className="hours">
        {/* <UserProfileStat title="总历程" hours={100} /> */}
        <UserProfileStat title="今日历程" hours={24} />
        <UserProfileStat title="本周历程" hours={24} />
        <UserProfileStat title="本月历程" hours={24} />
      </div>
      <style jsx>{`
        .user-profile {
          margin: 0 0 10px;
        }
        .bar-title {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin: 5px 0 5px;
        }
        .bar-title strong {
          margin-right: 5px;
          font-weight: 500;
          font-size: 30px;
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
        .total-hours {
          margin: 5px 15px 15px;
        }
        .hours {
          margin: 15px 15px 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { asPath } = router;
  const store = useGlobalStore();
  return (
    <div className={classnames(Classes.TREE, Classes.ELEVATION_0)} id="sidebar">
      <UserProfile user={store.user} />
      <Divider />
      <nav>
        <ul className={Classes.TREE_NODE_LIST}>
          <SidebarHeader>导航</SidebarHeader>
          <NavLabel
            href="/workspace"
            title="看板"
            emoji="📋"
            currentPath={asPath}
          />
          <NavLabel
            href="/workspace/plan"
            title="规划"
            emoji="🗓"
            currentPath={asPath}
          />
          <NavLabel
            href="/workspace/success"
            title="成就"
            emoji="🏆"
            currentPath={asPath}
          />
          <NavLabel
            href="/workspace/recycle"
            title="回收站"
            emoji="♻️"
            currentPath={asPath}
          />
        </ul>
        <SidebarWorks currentPath={asPath} />
      </nav>
      <style jsx>
        {`
          #sidebar {
            display: flex;
            flex-direction: column;
            max-height: calc(100vh - 50px);
            padding-top: 10px;

            height: 100%;
          }
          nav {
            overflow: hidden auto;
            display: block;
            max-height: 100%;
            padding-bottom: 20px;
          }
        `}
      </style>
    </div>
  );
};
