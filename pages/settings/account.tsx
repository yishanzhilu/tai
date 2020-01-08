/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { SettingLayout } from '@/src/layout';

const Search: NextPage = () => {
  const { query } = useRouter();
  return (
    <SettingLayout>
      <main>
        account
        <p>{query.q}</p>
      </main>
      <style jsx>{`
        @media (max-width: 600px) {
          main :global(h1) {
            font-size: 25px;
          }
        }
      `}</style>
    </SettingLayout>
  );
};

export default Search;
