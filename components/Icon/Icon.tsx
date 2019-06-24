/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All right reserved
 */
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import styled from '@emotion/styled';

import { DISPLAYNAME_PREFIX } from '@/components/common/variables';

import IconSvgPaths from './paths';

import * as IconNames from './iconNames';

export { IconNames };

export type IconName = (typeof IconNames)[keyof typeof IconNames];

/**
 * Alias for a `JSX.Element` or a value that renders nothing.
 *
 * In React, `boolean`, `null`, and `undefined` do not produce any output.
 */
export type MaybeElement = JSX.Element | false | null | undefined;

export interface IconProps {
  /**
   * 本组件不支持children 。请使用`icon`prop。
   */
  children?: never;

  /**
   * icon的颜色。用来作为`<svg>` 图像`fill 属性的值
   * 所以这会覆盖任何CSS的`color`属性，包括被`intent`设置的
   * 如果没有这个prop，icon的颜色会继承周围的text。
   */
  color?: string;

  /**
   * 渲染元素的 `title` 属性显示的字符串，悬浮时浏览器自带的tooltip
   */
  htmlTitle?: string;

  /**
   * Name of a  UI icon, or an icon element, to render. This prop is
   * required because it determines the content of the component, but it can
   * be explicitly set to falsy values to render nothing.
   *
   * - If `null` or `undefined` or `false`, this component will render
   *   nothing.
   * - If given an `IconName` (a string literal union of all icon names), that
   *   icon will be rendered as an `<svg>` with `<path>` tags. Unknown strings
   *   will render a blank icon to occupy space.
   * - If given a `JSX.Element`, that element will be rendered and _all other
   *   props on this component are ignored._ This type is supported to
   *   simplify icon support in other Dao Style React components.
   *   As a consumer, you should avoid using `<Icon icon={<Element />}`
   *   directly; simply render
   *   `<Element />` instead.
   */
  icon: IconName | MaybeElement;

  /**
   * Size of the icon, in pixels. Dao Style React contains 16px and 20px
   * SVG icon images, and chooses the appropriate resolution based on
   * this prop.
   * @default Icon.SIZE_STANDARD = 16
   */
  iconSize?: number;

  /** CSS style properties. */
  style?: React.CSSProperties;

  /**
   * HTML tag to use for the rendered element.
   * @default "span"
   */
  tagName?: keyof JSX.IntrinsicElements;

  /**
   * Description string. This string does not appear in normal browsers, but
   * it increases accessibility. For instance, screen readers will use it for
   * aural feedback. By default, this is set to the icon's name. Pass an
   * explicit falsy value to disable.
   */
  title?: string | false | null;
}

// Render `<path>` elements for the given icon name.
// Returns `null` if name is unknown.
function renderSvgPaths(iconName: IconName): JSX.Element[] | null {
  const pathStrings = IconSvgPaths[iconName];
  if (pathStrings == null) {
    return null;
  }
  return pathStrings.map(
    (d: string, i: number): JSX.Element => (
      // eslint-disable-next-line react/no-array-index-key
      <path key={i} d={d} fillRule="evenodd" />
    )
  );
}

const StyledSVG = styled.svg`
  display: block;
  &:not([fill]) {
    fill: currentColor;
  }
`;

export class Icon extends React.PureComponent<
  IconProps & React.DOMAttributes<Element>
> {
  public static displayName = `${DISPLAYNAME_PREFIX}.Icon`;

  public render(): JSX.Element | null {
    const { icon } = this.props;
    if (icon == null || typeof icon === 'boolean') {
      return null;
    }
    if (typeof icon !== 'string') {
      return icon;
    }

    const {
      color,
      htmlTitle,
      title = icon,
      iconSize = 16,
      tagName: TagName = 'span',
      ...htmlprops
    } = this.props;

    const viewBox = `0 0 20 20`;

    const paths = renderSvgPaths(icon);
    return (
      <TagName
        {...htmlprops}
        title={htmlTitle}
        css={css`
          display: inline-block;
          flex: 0 0 auto;
          vertical-align: text-bottom;
        `}
      >
        <StyledSVG
          fill={color}
          data-icon={icon}
          width={iconSize}
          height={iconSize}
          viewBox={viewBox}
        >
          {title && <desc>{title}</desc>}
          {paths}
        </StyledSVG>
      </TagName>
    );
  }
}
