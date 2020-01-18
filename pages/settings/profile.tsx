/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { NextPage } from 'next';

import { FormGroup, InputGroup, Card } from '@yishanzhilubp/core';

import { SettingLayout } from '@/src/layout';
import { withPageGuard } from '@/src/utils/pageGuard';
import { useGlobalContext } from '@/src/contexts/global';

interface ICosCredentials {
  XCosSecurityToken: string;
  SecretId: string;
  SecretKey: string;
}

const SettingProfile: NextPage = () => {
  const [state] = useGlobalContext();
  return (
    <SettingLayout>
      <Card>
        <h3 style={{ marginTop: 0 }}>个人信息</h3>
        <div style={{ display: 'flex' }}>
          <div style={{ flexBasis: 500 }}>
            {state.user.avatarUrl && (
              <FormGroup label="头像">
                <div
                  style={{
                    borderRadius: 6,
                    width: 80,
                    height: 80,
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid rgba(55, 53, 47, 0.09)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={state.user.avatarUrl}
                    alt="avatar"
                    style={{
                      borderRadius: 3,
                      width: 70,
                      height: 70,
                      background: 'rgba(55, 53, 47, 0.4)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                </div>
              </FormGroup>
            )}
            <FormGroup label="昵称">
              <InputGroup readOnly fill value={state.user.name} />
            </FormGroup>
          </div>
        </div>
      </Card>
    </SettingLayout>
  );
};

export default withPageGuard(SettingProfile, true);
