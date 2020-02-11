/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Classes, Divider, Text } from '@yishanzhilubp/core';

import {
  useWorkProfileContext,
  IGoalBrief,
  IMissionBrief,
} from '@/src/scopes/global/workProfileContext';
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

function SidebarGoal({ id, title, missions }: IGoalBrief) {
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
          {missions &&
            missions.map(m => (
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

const SidebarWorks: React.FC<{
  goals: IGoalBrief[];
  missions: IMissionBrief[];
}> = ({ goals, missions }) => {
  return (
    <ul className={Classes.TREE_NODE_LIST}>
      <SidebarHeader>目标</SidebarHeader>
      {goals.length > 0 ? (
        goals.map(g => (
          <SidebarGoal
            key={`goal-${g.id}`}
            id={g.id}
            missions={g.missions}
            title={g.title}
          />
        ))
      ) : (
        <li className={Classes.TREE_NODE}>
          <div className={Classes.TEXT_MUTED} style={{ padding: '0 20px' }}>
            <span>未设立</span>
          </div>
        </li>
      )}
      <SidebarHeader>独立任务</SidebarHeader>
      {missions.length > 0 ? (
        missions.map(m => (
          <SidebarMission key={`mission-${m.id}`} title={m.title} id={m.id} />
        ))
      ) : (
        <li className={Classes.TREE_NODE}>
          <div className={Classes.TEXT_MUTED} style={{ padding: '0 20px' }}>
            <span>未设立</span>
          </div>
        </li>
      )}
    </ul>
  );
};

export const WorkSpaceSidebar: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;
  const mainNavList = [
    {
      href: '/workspace/dashboard',
      title: '看板',
      emoji: '📋',
    },
    {
      href: '/workspace/trophy',
      title: '成就',
      emoji: '🏆',
    },
    {
      href: '/workspace/recycle',
      title: '回收站',
      emoji: '♻️',
    },
  ];
  const {
    state,
  } = useWorkProfileContext();
  const navEl = React.useRef<HTMLElement>();
  React.useEffect(() => {

    // scroll side bar to show current active li
    const active = navEl.current?.querySelector<HTMLElement>(
      `.${Classes.TREE_NODE_SELECTED}`
    );
    const activeTop = active?.offsetTop;
    // const activeBottom = active?.offsetTop + active?.offsetHeight;
    // const navTop = navEl?.current.offsetTop;
    const navBottom = navEl?.current.offsetTop + navEl?.current.offsetHeight;

    if (activeTop > navBottom) {
      if (active) active.scrollIntoView();
    }
  }, [state]);
  return (
    <div className={classnames(Classes.TREE, Classes.ELEVATION_0)} id="sidebar">
      <UserProfile />
      <Divider />
      <nav ref={navEl}>
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
        <SidebarWorks goals={state.goals} missions={state.missions} />
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
