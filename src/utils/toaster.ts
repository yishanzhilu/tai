/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import { Toaster, Position } from '@yishanzhilubp/core';
import { IS_BROWSER } from './constants';

export const TaiToast = IS_BROWSER
  ? Toaster.create({
      className: 'my-toaster',
      position: Position.TOP,
    })
  : null;
