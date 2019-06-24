/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import * as React from 'react';
import { shallow } from 'enzyme';

import App from '@/pages/index.tsx';

describe('Index', () => {
  it('should shows"Yishanjs\'s typescript&next starter"', async () => {
    const props = await App.getInitialProps();
    const app = shallow(<App {...props} />);

    expect(app.find('h1').text()).toEqual("Yishanjs's typescript&next starter");
  });

  it('should match snapshot', async () => {
    const props = await App.getInitialProps();
    const app = shallow(<App {...props} />);

    expect(app).toMatchSnapshot();
  });
});
