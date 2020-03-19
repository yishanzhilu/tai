/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import {
  Classes,
  ProgressBar,
  Tooltip,
  // AnchorButton,
} from '@yishanzhilubp/core';
import classNames from 'classnames';

import { useUserContext } from '@/src/scopes/global/userContext';
import { Flex } from '@/src/components/flex';
import { formatMinutes } from '@/src/utils/funcs';
// import Link from 'next/link';

// function UserProfileStat({ title = '', hours = 0 }) {
//   return (
//     <div className="user-profile-stat">
//       <span>{title}</span>
//       <p>
//         <strong>{hours}</strong>
//         <span className={Classes.TEXT_SMALL}>小时</span>
//       </p>
//       <style jsx>{`
//         .user-profile-stat {
//           width: 60px;
//           line-height: 1.5;
//         }
//         strong {
//           margin-right: 5px;
//           width: 24px;
//           display: inline-block;
//           font-size: 16px;
//           font-style: italic;
//         }
//         p {
//           display: flex;
//           justify-content: space-between;
//           align-items: baseline;
//           margin: 0;
//         }
//       `}</style>
//     </div>
//   );
// }

export function UserProfile() {
  const {
    state: { user },
  } = useUserContext();
  if (!user) {
    return null;
  }
  const { name, avatarUrl, minutes } = user;
  const hours = Math.floor(minutes / 60);
  const hoursTo10k = 10000 - Math.ceil(minutes / 60);
  return (
    <div className="user-profile">
      <Flex className="row" alignItems="center">
        {avatarUrl && (
          <img
            src={avatarUrl}
            className={Classes.ELEVATION_1}
            style={{ borderRadius: 10, width: 24, height: 24 }}
            width="24"
            height="24"
            alt="avatar"
          />
        )}
        <div
          className={classNames(Classes.TEXT_OVERFLOW_ELLIPSIS)}
          style={{ fontWeight: 600, flexGrow: 1 }}
        >
          {name || '您好'}
        </div>
        {/* <div className="mobile-search">
          <Link href="/search" passHref>
            <AnchorButton icon="search" minimal small />
          </Link>
        </div> */}
      </Flex>
      <div className="row">
        <Tooltip
          targetTagName="div"
          position="right"
          interactionKind="hover"
          hoverCloseDelay={50}
          content={<span>距离达成一万小时还差 {hoursTo10k} 小时</span>}
        >
          <div>
            <Flex justifyContent="space-between">
              <span>累计历程</span>
              <strong>{formatMinutes(minutes)}</strong>
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
        </Tooltip>
      </div>

      {/* <Flex className="row" justifyContent="space-between">
        <UserProfileStat title="今日历程" hours={24} />
        <UserProfileStat title="本周历程" hours={24} />
        <UserProfileStat title="本月历程" hours={24} />
      </Flex> */}
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
        .mobile-search {
          display: none;
        }
        @media (max-width: 1024px) {
          .mobile-search {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
