/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import * as React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer'

import App from '@/pages/index';

describe('Index', () => {
  it('should shows"Yishan \'s typescript&next starter"', async () => {
    const app = shallow(<App />);

    expect(app.find('h1').text()).toEqual("Yishan typescript&next starter");
  });

  it('should match snapshot', async () => {
    const component = renderer.create(<App />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  });
});
