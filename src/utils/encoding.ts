/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { IS_SERVER } from './env';

export function base64ToString(base64: string) {
  if (IS_SERVER) {
    return Buffer.from(base64, 'base64').toString('binary');
  }
  return atob(base64);
}

export function stringToBase64(base64: string) {
  if (IS_SERVER) {
    return Buffer.from(base64, 'base64').toString('binary');
  }
  return atob(base64);
}

export function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs
  // see SO answer #6850276 for code that does this
  const byteString = base64ToString(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Old Code
  // write the ArrayBuffer to a blob, and you're done
  // var bb = new BlobBuilder();
  // bb.append(ab);
  // return bb.getBlob(mimeString);

  // New Code
  return new Blob([ab], { type: mimeString });
}
