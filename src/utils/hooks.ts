/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

/**
 * useInputRef 用于生成回调模式的 input 或者 textarea 的 ref
 *
 * https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
 *
 *
 */
export function useInputRef<T extends { value: string }>(): [
  T,
  (node: T) => void
] {
  const [input, setValue] = React.useState(null);
  const ref = React.useCallback((node: T) => {
    if (node !== null) {
      setValue(node);
    }
  }, []);
  return [input, ref];
}
