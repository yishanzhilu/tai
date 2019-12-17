/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Classes, Divider, Text } from '@yishanzhilu/blueprint-core';

import { useGlobalContext } from '@/src/contexts/global';
import { UserProfile } from './sidebarUserProfile';

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
            margin: 15px 20px 10px;
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
  level = 0,
  active = false,
  expended = null,
}) {
  const liClass = classnames(
    Classes.TREE_NODE,
    active && Classes.TREE_NODE_SELECTED
  );
  return (
    <li className={liClass}>
      <div
        className={Classes.TREE_NODE_CONTENT}
        style={{ paddingRight: 20, paddingLeft: 23 * level + 20 }}
      >
        <SidebarAnchor href={href} asHref={asHref}>
          <span className={Classes.TREE_NODE_ICON}>{emoji}</span>
          <Text tagName="span" ellipsize>
            {title}
          </Text>
        </SidebarAnchor>
      </div>
      {expended && <div className={Classes.TREE_NODE_EXPANDED}>{expended}</div>}
    </li>
  );
}

function SidebarMission({ id, title, level = 0 }) {
  const router = useRouter();
  const {
    pathname,
    query: { id: qid },
  } = router;
  return (
    <NavLabel
      asHref={`/workspace/mission/${id}`}
      href="/workspace/mission/[id]"
      title={title}
      emoji="📜"
      level={level}
      active={pathname === '/workspace/mission/[id]' && id === Number(qid)}
    />
  );
}

function SidebarGoal({ id, title, missions }) {
  const router = useRouter();
  const {
    pathname,
    query: { id: qid },
  } = router;

  return (
    <NavLabel
      asHref={`/workspace/goal/${id}`}
      href="/workspace/goal/[id]"
      title={title}
      emoji="🎯"
      active={pathname === '/workspace/goal/[id]' && id === Number(qid)}
      expended={
        <ul className={Classes.TREE_NODE_LIST}>
          {missions.map(m => (
            <SidebarMission
              level={1}
              key={`mission-${m.id}`}
              title={m.title}
              id={m.id}
            />
          ))}
        </ul>
      }
    />
  );
}

function SidebarWorks() {
  const [store] = useGlobalContext();
  return (
    <ul className={Classes.TREE_NODE_LIST}>
      <SidebarHeader>目标</SidebarHeader>
      {store.work &&
        store.work.goals.map(g => (
          <SidebarGoal
            key={`goal-${g.id}`}
            id={g.id}
            missions={g.missions}
            title={g.title}
          />
        ))}
      <SidebarHeader>独立任务</SidebarHeader>
      {store.work &&
        store.work.missions.map(m => (
          <SidebarMission key={`mission-${m.id}`} title={m.title} id={m.id} />
        ))}
    </ul>
  );
}

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;
  const mainNavList = [
    {
      href: '/workspace/dashboard',
      title: '看板',
      emoji: '📋',
    },
    {
      href: '/workspace/plan',
      title: '规划',
      emoji: '🗓',
    },
    {
      href: '/workspace/success',
      title: '成就',
      emoji: '🏆',
    },
    {
      href: '/workspace/recycle',
      title: '回收站',
      emoji: '♻️',
    },
  ];
  return (
    <div className={classnames(Classes.TREE, Classes.ELEVATION_0)} id="sidebar">
      <UserProfile />
      <Divider />
      <nav>
        <ul className={Classes.TREE_NODE_LIST}>
          <SidebarHeader>导航</SidebarHeader>
          {mainNavList.map(nav => (
            <NavLabel
              key={nav.title}
              href={nav.href}
              title={nav.title}
              emoji={nav.emoji}
              active={pathname === nav.href}
            />
          ))}
        </ul>
        <SidebarWorks />
      </nav>
      <style jsx>
        {`
          #sidebar {
            display: flex;
            flex-direction: column;
            max-height: calc(100vh - 50px);
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
