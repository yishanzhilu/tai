/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import * as React from 'react';
import { NextStatelessComponent } from 'next';
import Link from 'next/link';

import LandingLayout from '@/components/LandingLayout/LandingLayout.tsx';

interface Post {
  title: string;


  href: string;
}

interface Props {
  posts: Post[];
}

const Index: NextStatelessComponent<Props> = ({
  posts,
}: Props): React.ReactElement => {
  const msg = "Yishanjs's typescript&next starter";
  return (
    <LandingLayout>
      <div>
        <h1>{msg}</h1>
        <ul>
          {posts.map(
            ({ title, href }): React.ReactElement => (
              <li key={title}>
                <Link passHref href={href}>
                  <a target="_blank">{title}</a>
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </LandingLayout>
  );
};

Index.getInitialProps = async (): Promise<Props> => {
  const posts = [
    { title: 'nextjs', href: 'https://github.com/zeit/next.js/' },
    {
      title: 'next-typescript',
      href:
        'https://github.com/zeit/next-plugins/tree/master/packages/next-typescript',
    },
    { title: 'typescript', href: 'https://www.typescriptlang.org/' },
    { title: 'eslint', href: 'https://eslint.org/' },
    { title: 'prettier', href: 'https://github.com/prettier/prettier' },
    { title: 'jest', href: 'https://github.com/prettier/prettier' },
  ];
  return { posts };
};

export default Index;
