/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { Classes } from '@yishanzhilubp/core';

import { IProps } from '@/src/model/utils';

interface IIconSelectorProps extends IProps {
  imgDataUrl: string;
  name: string;
}

export const AvatarSelector: React.FC<IIconSelectorProps> = ({
  imgDataUrl,
  name,
}) => {
  const [selectorHover, setSelectorHover] = React.useState(false);
  return (
    <div
      className={Classes.ELEVATION_2}
      onMouseEnter={() => setSelectorHover(true)}
      onMouseLeave={() => setSelectorHover(false)}
      style={{
        borderRadius: 6,
        width: 80,
        height: 80,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        border: '1px solid rgba(55, 53, 47, 0.09)',
        background: selectorHover ? 'rgba(55, 53, 47, 0.08)' : null,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {imgDataUrl ? (
        <img
          width={70}
          crossOrigin="anonymous"
          height={70}
          src={imgDataUrl}
          alt="avatar"
        />
      ) : (
        <div
          style={{
            borderRadius: 3,
            width: 70,
            height: 70,
            background: 'rgba(55, 53, 47, 0.4)',
            color: 'rgba(255, 255, 255, 0.9)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ lineHeight: 1, fontSize: 40, height: 40 }}>
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};
