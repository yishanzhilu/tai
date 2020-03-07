/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import Highlighter from 'react-highlight-words';

export const P: React.FC = ({ children }) => {
  if (typeof children !== 'string') {
    throw Error('<P /> children has to be string');
  }
  const text = children.toString();
  return (
    <p>
      <Highlighter
        highlightClassName="YourHighlightClass"
        searchWords={['学习']}
        autoEscape
        textToHighlight={text}
      />
      <style jsx>{`
        p {
          word-break: break-all;
          white-space: pre-wrap;
          line-height: 1.5;
        }
      `}</style>
    </p>
  );
};
