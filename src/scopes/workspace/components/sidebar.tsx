/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Classes, Divider, Text, Button } from '@yishanzhilubp/core';

import {
  useWorkProfileContext,
  IGoalBrief,
  IMissionBrief,
} from '@/src/scopes/global/workProfileContext';
import { UserProfile } from './sidebarUserProfile';
import { useTopBarContext } from '../../global/topBarContext';

const SidebarHeader: React.FC<{ action?: React.ReactNode }> = ({
  children,
  action,
}) => {
  return (
    <h6 className="sidebar-heading">
      <span>{children}</span>
      {action}
      <style jsx>
        {`
          h6 {
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            margin: 8px 20px 8px;
            line-height: 18px;
            font-size: 14px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 24px;
          }
          span{
            margin-right: 5px;
          }
        `}
      </style>
    </h6>
  );
};

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
      emoji="📌"
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
  const {
    state: {
      currentDetail: { goalID, missionStatus },
    },
  } = useWorkProfileContext();

  return (
    <NavLabel
      asHref={`/workspace/goal/${id}`}
      href="/workspace/goal/[id]"
      title={title}
      emoji="🎯"
      active={
        (pathname === '/workspace/goal/[id]' && id === Number(qid)) ||
        (goalID === id && missionStatus !== 'doing')
      }
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
  const { dispatch } = useTopBarContext();
  return (
    <ul className={Classes.TREE_NODE_LIST}>
      <SidebarHeader
        action={
          <Button
            icon="plus"
            minimal
            small
            onClick={() =>
              dispatch({
                type: 'SetNewGoalDialog',
                isOpen: true,
                startNow: true,
              })
            }
          />
        }
      >
        目标
      </SidebarHeader>

      {goals.length > 0 ? (
        goals.map(g => (
          <SidebarGoal
            key={`goal-${g.id}`}
            id={g.id}
            title={g.title}
            missions={g.missions}
          />
        ))
      ) : (
        <li className={Classes.TREE_NODE}>
          <div className={Classes.TEXT_MUTED} style={{ padding: '0 20px' }}>
            <span>未设立</span>
          </div>
        </li>
      )}
      <SidebarHeader
        action={
          <Button
            icon="plus"
            minimal
            small
            onClick={() =>
              dispatch({
                type: 'SetNewMissionDialog',
                isOpen: true,
                startNow: true,
              })
            }
          />
        }
      >
        独立任务
      </SidebarHeader>
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
      status: '',
    },
    {
      href: '/workspace/trophy',
      title: '成就',
      emoji: '🏆',
      status: 'done',
    },
    {
      href: '/workspace/recycle',
      title: '回收站',
      emoji: '♻️',
      status: 'drop',
    },
  ];
  const {
    state: { goals, missions },
    computed: { currentNavStatus },
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
  }, [goals, missions]);
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
              active={pathname === nav.href || currentNavStatus === nav.status}
            />
          ))}
        </ul>
        <SidebarWorks goals={goals} missions={missions} />
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
