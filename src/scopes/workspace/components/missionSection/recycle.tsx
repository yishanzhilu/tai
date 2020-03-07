/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { useWorkProfileContext } from '@/src/scopes/global/workProfileContext';
import Link from 'next/link';
import { IMission } from '@/src/model/schemas';
import { Classes } from '@yishanzhilubp/core';

// const MissionCardMenu: React.FC = () => {
//   return (
//     <Menu>
//       <MenuItem icon={<span>✅</span>} text="重新开始" />
//       <MenuItem icon={<span>📝</span>} text="永久删除" />
//     </Menu>
//   );
// };

const MissionCard: React.FC<{ mission: IMission }> = ({ mission }) => {
  // const [showMore, setShowMore] = useState(false);
  return (
    <div className="card">
      <div
        className="row"
        // onMouseEnter={() => {
        //   setShowMore(true);
        // }}
        // onMouseLeave={() => {
        //   setShowMore(false);
        // }}
      >
        <div style={{ marginRight: 10 }}>
          <span style={{ marginRight: 5 }}>📜</span>
          <Link
            href="/workspace/mission/[id]"
            as={`/workspace/mission/${mission.id}`}
          >
            <a>{mission.title}</a>
          </Link>
        </div>
        {/* <Popover
          position="bottom-left"
          boundary="viewport"
          content={<MissionCardMenu />}
        >
          <Button
            style={{ visibility: showMore ? 'visible' : 'hidden' }}
            minimal
            small
            icon="more"
          />
        </Popover> */}
      </div>

      <style jsx>{`
        .card {
          box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px,
            rgba(15, 15, 15, 0.1) 0px 2px 4px;
          border-radius: 3px;
          margin-bottom: 8px;
          width: 240px;
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
      `}</style>
    </div>
  );
};

export const Recycle: React.FC = () => {
  const {
    state: {
      currentDetail: { missions = [] },
    },
  } = useWorkProfileContext();
  const delted = missions.filter(m => m.status === 'drop');
  return (
    <div style={{ height: 277, overflowY: 'auto', padding: 5 }}>
      {delted.length > 0 ? (
        delted.map(m => <MissionCard key={m.id} mission={m} />)
      ) : (
        <span className={Classes.TEXT_MUTED}>尚无任务</span>
      )}
    </div>
  );
};
