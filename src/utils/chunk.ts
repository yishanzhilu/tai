/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

export function chunk<T>(array: Array<T>, size = 1): Array<T[]> {
  size = Math.max(size, 0);
  const length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex] = array.slice(index, (index + size));
    index += size;
    resIndex += 1;
  }
  return result;
}
