/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
import React from 'react';

import { IGoal, IMission } from '@/src/model/schemas';
import Link from 'next/link';
import { P } from '@/src/components/layouts/p';
import { formatDate } from '@/src/utils/funcs';
import { Classes } from '@yishanzhilubp/core';

// const MiniGoalCardMissions: React.FC<{ missions: IMission[] }> = ({
//   missions,
// }) => {
//   if (!missions) {
//     return null;
//   }
//   const s: React.CSSProperties = {
//     flexGrow: 1,
//     padding: 10,
//   };
//   return (
//     <div>
//       <p className={Classes.TEXT_MUTED}>子任务</p>
//       <Flex wrap>
//         {missions.map(m => (
//           <Card style={s} key={m.id} className={Classes.TEXT_SMALL}>
//             <strong>{m.title}</strong>
//             <Text ellipsize>{m.description}</Text>
//           </Card>
//         ))}
//       </Flex>
//     </div>
//   );
// };

interface IMiniCardPorps {
  title: string;
  href: string;
  updatedAt: string;
  as: string;
}

export const MimiCard: React.FC<IMiniCardPorps> = ({
  title,
  href,
  updatedAt,
  as,
}) => {
  return (
    <div className="card">
      <div className="row">
        <div style={{ marginRight: 10, width: 150 }}>
          <Link href={href} as={as}>
            <a>
              <P ellipsize>{title}</P>
            </a>
          </Link>
        </div>
        <div className={Classes.TEXT_MUTED}>{formatDate(updatedAt)}</div>
      </div>

      <style jsx>{`
        .card {
          box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px,
            rgba(15, 15, 15, 0.1) 0px 2px 4px;
          border-radius: 3px;
          margin-right: 50px;
          margin-bottom: 15px;
          width: 250px;
          background: white;
          padding: 10px 12px;
          line-height: 1.5;
          // shrink size for windows scroll bar
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: start;
        }
        strong {
          font-weight: 600;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export const MiniGoalCard: React.FC<{ goal: IGoal }> = ({ goal }) => {
  return (
    <MimiCard
      title={goal.title}
      updatedAt={goal.updatedAt}
      href="/workspace/goal/[id]"
      as={`/workspace/goal/${goal.id}`}
    />
  );
};

export const MiniMissionCard: React.FC<{ mission: IMission }> = ({
  mission,
}) => {
  return (
    <MimiCard
      title={mission.title}
      updatedAt={mission.updatedAt}
      href="/workspace/mission/[id]"
      as={`/workspace/mission/${mission.id}`}
    />
  );
};
