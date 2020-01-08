/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import { NextPage } from 'next';

import { FormGroup, InputGroup, TextArea, Card } from '@yishanzhilubp/core';

import { SettingLayout } from '@/src/layout';

const Search: NextPage = () => {
  return (
    <SettingLayout>
      <Card>
        <h3 style={{ marginTop: 0 }}>个人信息</h3>
        <FormGroup label="昵称">
          <InputGroup fill />
        </FormGroup>
        <FormGroup label="简介">
          <TextArea fill rows={4} growVertically />
        </FormGroup>
      </Card>
    </SettingLayout>
  );
};

export default Search;
