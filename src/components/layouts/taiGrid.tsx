/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { H5, Classes } from '@yishanzhilubp/core';

interface ITaiGrid {
  title: string;
  isEmpty?: boolean;
}

export const TaiGrid: React.FC<ITaiGrid> = ({ title, children, isEmpty }) => {
  return (
    <div className="tai-grid">
      <H5>{title}</H5>
      {isEmpty ? (
        <span className={Classes.TEXT_MUTED}>无</span>
      ) : (
        <div className="tai-grid-content">{children}</div>
      )}

      <style jsx>{`
        .tai-grid {
          margin: 10px 0;
          width: 100%;
        }
        .tai-grid-content {
          padding: 5px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-content: flex-start;
        }
      `}</style>
    </div>
  );
};
