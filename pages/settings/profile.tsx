/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { NextPage } from 'next';

import {
  FormGroup,
  InputGroup,
  Card,
  Dialog,
  Button,
  Classes,
} from '@yishanzhilubp/core';

import { SettingLayout } from '@/src/layout';
import { AvatarEditor } from '@/src/components/avatarEditor';

const Search: NextPage = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [avatarData, setAvatarData] = React.useState('');
  const [src, setSrc] = React.useState(
    'https://static-image-1255545382.cos.ap-shanghai.myqcloud.com/webwxgetmsgimg.jpeg'
  );
  function updateAvatar(srcData: string) {
    setSrc(srcData);
    setIsOpen(false);
  }
  return (
    <SettingLayout>
      <Card>
        <h3 style={{ marginTop: 0 }}>个人信息</h3>
        <div style={{ marginBottom: 15 }}>
          <img
            className={Classes.ELEVATION_2}
            style={{ borderRadius: '100%', margin: '5px 0 10px' }}
            width="80"
            height="80"
            src={src}
            alt="avatar"
          />
          <br />
          <Button style={{ width: 80 }} onClick={() => setIsOpen(true)}>
            更新头像
          </Button>
          <Dialog
            title="头像"
            isOpen={isOpen}
            isCloseButtonShown
            onClose={() => setIsOpen(false)}
          >
            <div className={Classes.DIALOG_BODY}>
              <AvatarEditor
                src={src}
                onCrop={setAvatarData}
                width={460}
                height={460}
              />
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <Button fill onClick={() => updateAvatar(avatarData)}>
                确认
              </Button>
            </div>
          </Dialog>
        </div>
        <FormGroup label="昵称">
          <InputGroup fill />
        </FormGroup>
        <Button
          style={{ width: 80 }}
          intent="primary"
          onClick={() => updateAvatar(avatarData)}
        >
          保存
        </Button>
      </Card>
    </SettingLayout>
  );
};

export default Search;
