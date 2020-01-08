/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import {
  Menu,
  MenuItem,
  Tag,
  InputGroup,
  Popover,
} from '@yishanzhilubp/core';

export function NavSearch() {
  const [query, setQuery] = React.useState('');

  return (
    <div>
      <div className="bp3-input-group">
        <Popover minimal position="bottom-left">
          <InputGroup
            placeholder="搜索"
            leftIcon="search"
            onInput={e => {
              setQuery(e.currentTarget.value);
            }}
          />
          {query && (
            <Menu style={{ width: 300 }}>
              <MenuItem
                href={`/search?q=${query}`}
                target="_blank"
                text={query}
                labelElement={<Tag>搜课程</Tag>}
              />
              <MenuItem
                href={`/search?type=roadmap&q=${query}`}
                target="_blank"
                text={query}
                labelElement={<Tag>搜学习路线图</Tag>}
              />
            </Menu>
          )}
        </Popover>
      </div>
    </div>
  );
}
