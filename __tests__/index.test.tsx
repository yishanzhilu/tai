/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */
/* eslint-env jest */

import React from 'react';
import { render } from '@testing-library/react';

import Index from '@/pages/index';

describe('Landing Page', () => {
  it('Shows "确立目标 & 达成理想" title', () => {
    const { getByText } = render(<Index />);

    expect(getByText('确立目标 & 达成理想')).not.toBeNull();
  });
});
