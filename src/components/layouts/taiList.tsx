/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { Classes, H5 } from '@yishanzhilubp/core';

export function TaiList({ children, title }): React.ReactElement {
  return (
    <div className="tai-list">
      <H5>{title}</H5>
      <ul className={Classes.LIST_UNSTYLED}>{children}</ul>
      <style jsx>{`
        .tai-list {
          margin-bottom: 10px;
          width: 100%;
        }
        ul {
          margin-top: 10px;
        }
        ul :global(li) {
          margin: 0 0 10px;
        }
      `}</style>
    </div>
  );
}
