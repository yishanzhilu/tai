/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import classNames from 'classnames';

export default function Flex({
  children,
  className = '',
  dir = 'row',
  alignItems = 'center',
  childMargin = 5,
}) {
  return (
    <div className={classNames('container', className)}>
      {children}
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: ${dir};
            align-items: ${alignItems};
          }
          .container > :global(*) {
            margin-right: ${childMargin}px;
          }
          .container > :global(*):last-child {
            margin-right: 0;
          }
        `}
      </style>
    </div>
  );
}
