/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import * as React from 'react';
import { shallow } from 'enzyme';

import LandingLayout from './LandingLayout.tsx';

describe('LandingLayout', () => {

  it('should shows "header" and "footer"', async () => {
    const comp = shallow(<LandingLayout />);

    expect(comp.find('header').text()).toEqual("header");
    expect(comp.find('footer').text()).toEqual("footer");
  });

  it('should match snapshot', async () => {
    const comp = shallow(<LandingLayout />);

    expect(comp).toMatchSnapshot();
  });
});
