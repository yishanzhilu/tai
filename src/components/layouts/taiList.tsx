/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { H5, Card, Classes } from '@yishanzhilubp/core';
import { IProps } from '@/src/model/utils';

interface IListProps<T> extends IProps {
  title: string;
  render: (item: T) => React.ReactElement;
  items: Array<T>;
  pre?: React.ReactNode;
  after?: React.ReactNode;
  showEmptyPlaceholder?: boolean;
  container?: React.ReactElement;
  liMargin?: number;
}

export const TaiList = <T extends { id: number }>({
  title,
  items,
  render,
  pre,
  after,
  container = (
    <ul className={Classes.LIST_UNSTYLED} style={{ marginBottom: 10 }} />
  ),
  liMargin = 10,
  showEmptyPlaceholder = false,
}: IListProps<T>) => {
  const liStyle: React.CSSProperties = {
    marginTop: liMargin,
    marginBottom: liMargin,
  };
  const list = items.length
    ? items.map(i => render(i))
    : showEmptyPlaceholder && (
        <li style={liStyle}>
          <Card>
            <div>暂无</div>
          </Card>
        </li>
      );
  return (
    <div className="tai-list" style={{ marginTop: 10 }}>
      <H5>{title}</H5>
      {container
        ? React.cloneElement(container, {}, pre, list, after)
        : [pre, list, after]}
    </div>
  );
};

export function TaiListSimple({ children, title }): React.ReactElement {
  return (
    <div className="tai-list">
      <H5>{title}</H5>
      <ul className={Classes.LIST_UNSTYLED}>{children}</ul>
      <style jsx>{`
        .tai-list {
          margin: 10px 0;
          width: 100%;
        }
        ul {
          margin-top: 10px;
        }
        ul :global(li) {
          margin: 0 0 10px;
        }
      `}</style>
    </div>
  );
}
