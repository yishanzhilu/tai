/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import * as React from 'react';
import renderer from 'react-test-renderer';

import { LandingLayout } from '@/src/layout/landingLayout';

describe('着陆页布局', () => {
  it('snapshot 必须保持一致', async () => {
    const component = renderer.create(<LandingLayout>test</LandingLayout>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
