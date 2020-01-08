/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import classNames from 'classnames';
import { IProps } from '@/src/model/utils';

interface IFlexProps {
  children: React.ReactNode;
  className?: string;
  dir?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  wrap?: boolean;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  childMargin?: number;
}

export function Flex({
  children,
  className = '',
  dir = 'row',
  wrap = false,
  alignItems = 'center',
  justifyContent = 'flex-start',
  childMargin = 5,
}: IFlexProps) {
  let margin: string;
  switch (dir) {
    case 'row':
      margin = `0 ${childMargin}px ${childMargin}px 0`;
      break;
    case 'row-reverse':
      margin = `0 0 ${childMargin}px ${childMargin}px`;
      break;
    case 'column':
      margin = `0 ${childMargin}px ${childMargin}px 0`;
      break;
    case 'column-reverse':
      margin = `${childMargin}px ${childMargin}px 0 0`;
      break;
    default:
      margin = ' 0 0 0 0';
      break;
  }
  return (
    <div className={classNames('container', className)}>
      {children}
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: ${dir};
            align-items: ${alignItems};
            justify-content: ${justifyContent};
            flex-wrap: ${wrap ? 'wrap' : 'nowrap'};
          }
          .container > :global(*) {
            margin: ${margin};
          }
        `}
      </style>
    </div>
  );
}

export function FlexPlaceHolder({ className }: IProps) {
  return (
    <div className={classNames('flex-place-holder', className)}>
      <style jsx>
        {`
          .flex-place-holder {
            flex-grow: 1;
          }
        `}
      </style>
    </div>
  );
}
