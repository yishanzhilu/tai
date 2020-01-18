/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import jsCookie from 'js-cookie';
import { NextPage } from 'next';

import { Classes, H1, Button } from '@yishanzhilubp/core';

import { LandingLayout } from '@/src/layout';
import { GITHUB_OAUTH_URL } from '@/src/utils/constants';
import { redirect } from '@/src/utils/funcs';
import { withPageGuard } from '@/src/utils/pageGuard';
import { IPageProps } from '@/src/model/utils';

const onClick = () => {
  if (jsCookie.get('token')) {
    redirect('/workspace/dashboard');
  } else {
    window.location.href = GITHUB_OAUTH_URL;
  }
};

export function Banner() {
  return (
    <section>
      <div className="content">
        <h1>确立目标 & 达成理想</h1>
        <p>关于长期目标的代办事项</p>
        <Button intent="primary" onClick={onClick}>
          内测 Github 账户登录
        </Button>
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
          font-size: 44px;
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
          margin: -140px auto 0;
        }
        @media (max-width: 600px) {
          img {
            margin-top: 00px;
          }
        }
      `}</style>
    </section>
  );
}

export function Section({
  dir = 'left',
  title,
  description,
  credit,
  imgSrc,
}: {
  dir?: 'left' | 'right';
  title: string;
  description: string[];
  credit: string;
  imgSrc: string;
}) {
  return (
    <section>
      <div
        className="content"
        style={{ flexDirection: dir === 'left' ? 'row' : 'row-reverse' }}
      >
        <div className="desc">
          <H1 style={{ marginBottom: 20, textAlign: 'center' }}>{title}</H1>
          {description.map((d, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <p className={Classes.TEXT_LARGE} key={i}>
              {d}
            </p>
          ))}
          <p className={`${Classes.TEXT_MUTED} credit`}>- {credit}</p>
        </div>
        <div className="cover">
          <img src={imgSrc} alt={title} />
        </div>
      </div>
      <style jsx>{`
        section:not(:first-child) {
          min-height: 50vh;
          padding: 75px 0;
        }
        .content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1256px;
          align-items: center;
        }
        @media (max-width: 1000px) {
          .content {
            justify-content: center;
          }
        }
        .desc {
          max-width: 100%;
          width: 400px;
          text-align: left;
          margin: 0 100px;
          line-height: 1.5;
        }
        .desc .credit {
          text-align: right;
        }
        img {
          max-width: 100%;
          width: 600px;
          border-radius: 100px;
          height: auto;
        }
        .cover {
          position: relative;
        }
        .cover:after {
          position: absolute;
          content: '';
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border-radius: 90px;
          box-shadow: 0 0 30px 40px #ffffff inset;
        }
      `}</style>
    </section>
  );
}

const Index: NextPage<IPageProps> = () => {
  return (
    <LandingLayout>
      <main>
        <Banner />
        <Section
          title="设立长远目标"
          description={[
            "所有的都将围绕长远价值展开。It's All About the Long Term.",
          ]}
          credit="贝索斯1997年致股东的信"
          imgSrc="/images/landing/long-term.jpeg"
        />
        <Section
          title="反思与总结"
          dir="right"
          description={['君子博学而日参省乎己，则知明而行无过矣。']}
          credit="《荀子·劝学》"
          imgSrc="/images/landing/re-introspect.png"
        />
        <Section
          title="记录你的一万小时"
          description={['1万小时的锤炼是任何人从平凡变成超凡的必要条件。']}
          credit="格拉德威尔《异类》"
          imgSrc="/images/landing/10000.jpg"
        />
      </main>
      <style jsx>{`
        @media (max-width: 600px) {
          main :global(h1) {
            font-size: 25px;
          }
        }
      `}</style>
    </LandingLayout>
  );
};

export default withPageGuard(Index);
