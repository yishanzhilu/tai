/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */

import * as React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Index, { Banner, Section } from '@/pages/index';

describe('首页', () => {
  it('snapshot 必须保持一致', async () => {
    const component = renderer.create(<Index />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('Banner ', () => {
    const banner = shallow(<Banner />);
    it('标题 必须为"确立目标 & 达成理想"', () => {
      expect(banner.find('h1').text()).toEqual('确立目标 & 达成理想');
    });
  });

  describe('Section ', () => {
    const baseProps = {
      title: 'test',
      description: ['我没说过'],
      credit: '鲁迅',
      imgSrc: '/public/image.png',
    };
    const section = mount(<Section {...baseProps} />);
    it('默认 dir 为 left，flexDirection 为 row', () => {
      expect(section.find('.content').prop('style').flexDirection).toEqual(
        'row'
      );
    });
    it('如果 dir 为 right，flexDirection 为 row-reverse', () => {
      section.setProps({ dir: 'right' });
      expect(section.find('.content').prop('style').flexDirection).toEqual(
        'row-reverse'
      );
    });
  });
});
