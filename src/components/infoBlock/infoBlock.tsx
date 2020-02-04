/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';

export function InfoBlock({ label = '', value = '' }) {
  return (
    <div className="info-block">
      <div>{label}</div>
      <strong>{value}</strong>
      <style jsx>{`
        .info-block {
          line-height: 1.5;
        }
        strong {
          margin-right: 5px;
          display: inline-block;
          font-size: 16px;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
