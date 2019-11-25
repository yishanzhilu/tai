/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import Link from 'next/dist/client/link';
import { AnchorButton } from '@yishanzhilu/blueprint-core';

import { LandingLayout } from '@/src/layout';

function Banner() {
  return (
    <section>
      <div className="content">
        <h1>确立目标，达成理想</h1>
        <p>规划工作学习的伙伴</p>
        <Link href="/login">
          <AnchorButton large intent="primary">
            立刻开始
          </AnchorButton>
        </Link>
      </div>
      <img
        src="/images/banner.jpg"
        alt="people using yishan to get keep on their goal"
      />
      <style jsx>{`
        .content {
          text-align: center;
          position: relative;
          font-size: ;
        }
        h1 {
          box-sizing: border-box;
          margin-top: 104px;
          margin-bottom: 16px;
          padding: 0 20px;
          color: #262626;
          line-height: 1.35;
          font-size: 40px;
          font-weight: 700;
        }
        p {
          color: #595959;
          line-height: 1.75;
          box-sizing: border-box;
          margin-top: 0;
          margin-bottom: 16px;
          text-align: center;
          font-size: 18px;
          padding: 0 3em;
        }
        img {
          width: 90%;
          max-width: 1256px;
          display: block;
          margin: -100px auto 0;
        }
        @media (max-width: 600px) {
          img {
            margin-top: -10px;
          }
        }
      `}</style>
    </section>
  );
}

const Index = (): React.ReactElement => {
  return (
    <LandingLayout>
      <main>
        <Banner />
      </main>
    </LandingLayout>
  );
};

export default Index;
