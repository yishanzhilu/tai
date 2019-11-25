/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

export default function Flex({ children }) {
  return (
    <div className="container">
      {children}
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .container > :global(*) {
            margin-right: 5px;
          }
          .container > :global(*):last-child {
            margin-right: 0;
          }
        `}
      </style>
    </div>
  );
}
