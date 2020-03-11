/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { NextPage } from 'next';

import { LandingLayout } from '@/src/components/layouts/landing';
import { Tooltip } from '@yishanzhilubp/core';
import { chunk } from '@/src/utils/chunk';

export const MissionCard: React.FC<{
  mission: string;
  todos?: string[];
  dir?: 'left' | 'right';
}> = ({ mission, todos, dir = 'right' }) => {
  return (
    <div
      className={`container ${dir} ${
        mission === 'special-finish' ? 'finish' : ''
      }`}
    >
      {todos ? (
        <Tooltip
          hoverCloseDelay={100}
          interactionKind="hover"
          content={
            <ol>
              {todos.map((t, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={i}>{t}</li>
              ))}
            </ol>
          }
        >
          <div className="card">
            <div>{mission}</div>
          </div>
        </Tooltip>
      ) : (
        <div className="card">
          <div>{mission === 'special-finish' ? '🏆 完成目标' : mission}</div>
        </div>
      )}

      <style jsx>{`
        .container {
          position: relative;
          text-align: center;
          margin: 25px;
        }
        .card {
          padding: 10px 25px;
          background: #ffffff;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
          border-radius: 10px;
          width: 200px;
          height: 40px;
        }
        .container::after {
          content: '';
          position: absolute;
          background: #5c7080;
          width: 48px;
          height: 2.4px;
          top: 20px;
        }
        .container.finish::after {
          display: none;
        }
        .container.right::after {
          right: -48px;
        }
        .container.left::after {
          left: -48px;
        }
        .container:nth-child(4)::after {
          background: none;
          border: solid #5c7080;
        }
        .container.right:nth-child(4)::after {
          border-width: 2px 2px 2px 0;
          height: 92px;
          width: 20px;
          right: -20px;
          border-radius: 0 10px 10px 0;
        }
        .container.left:nth-child(4)::after {
          border-width: 2px 0 2px 2px;
          height: 92px;
          width: 20px;
          left: -20px;
          border-radius: 10px 0 0 10px;
        }
      `}</style>
    </div>
  );
};

const YishanRoadMap = [
  {
    mission: '📌 开始',
  },
  {
    mission: 'Web 应用泰山开发',
  },
  {
    mission: '找到3个伙伴',
  },
  {
    mission: '获取100个长期用户',
  },
  {
    mission: '寻得天使投资10w',
  },
  {
    mission: 'special-finish',
  },
];

const ChunkedYishanRoadMap = chunk(YishanRoadMap, 4);

const FrontEnd: NextPage = () => {
  return (
    <LandingLayout>
      <div className="head">
        <h1>前端工程师路线图</h1>
        <p>利用免费的网课资源自学成为前端工程师，打造完美的用户体验。</p>
        <p>零基础上手，上万月薪不是梦。</p>
      </div>
      <div className="roadmap">
        <div className="grid">
          {ChunkedYishanRoadMap.map((row, rIndex) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={rIndex}
              className={`row ${rIndex % 2 === 0 ? 'right' : 'left'}`}
            >
              {row.map((m, i) => (
                <MissionCard
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  mission={m.mission}
                  dir={rIndex % 2 === 0 ? 'right' : 'left'}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .head {
          text-align: center;
          padding: 60px;
        }
        h1 {
          font-weight: bold;
          font-size: 48px;
          line-height: 120%;
          margin: 0 0 30px;
        }
        p {
          font-size: 20px;
          line-height: 150%;
          margin: 0;
        }
        .roadmap {
          background: #f2f2f2;
          min-height: 400px;
        }
        .grid {
          border-top: 1px solid #eaeaea;
          width: 1000px;
          margin: 0 auto;
        }
        .row {
          display: flex;
        }
        .row.left {
          flex-direction: row-reverse;
        }
      `}</style>
    </LandingLayout>
  );
};

export default FrontEnd;
