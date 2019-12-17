/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { Card, Button } from '@yishanzhilu/blueprint-core';
import { Flex } from '../flex';

export function NewGoal() {
  return (
    <Card>
      <Flex justifyContent="space-between">
        <Button icon={<span>🎯</span>}>设立目标</Button>
        有什么一年左右完成的目标？
      </Flex>
    </Card>
  );
}
