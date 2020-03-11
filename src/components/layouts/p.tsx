/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { Text } from '@yishanzhilubp/core';

export const P: React.FC<{
  ellipsize?: boolean;
}> = ({ children, ellipsize }) => {
  if (typeof children !== 'string') {
    throw Error('<P /> children has to be string');
  }
  const text = children.toString();
  return (
    <div>
      <Text ellipsize={ellipsize}>{text}</Text>
      <style jsx>{`
        div {
          word-break: break-all;
          white-space: pre-wrap;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export const Span: React.FC<{
  ellipsize?: boolean;
}> = ({ children }) => {
  if (typeof children !== 'string') {
    throw Error('<P /> children has to be string');
  }
  const text = children.toString();
  return (
    <span
      style={{
        wordBreak: 'break-all',
        whiteSpace: 'nowrap',
        maxWidth: 100,
        display: 'inline-block',
        verticalAlign: 'bottom',
        lineHeight: 1.5,
      }}
    >
      <Text ellipsize>{text}</Text>
    </span>
  );
};
