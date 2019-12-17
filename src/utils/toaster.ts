/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { Toaster, Position } from '@yishanzhilu/blueprint-core';
import { IS_BROWSER } from './env';

export const Toast = IS_BROWSER
  ? Toaster.create({
      className: 'my-toaster',
      position: Position.TOP,
    })
  : null;
