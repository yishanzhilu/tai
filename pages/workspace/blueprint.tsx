/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';

import { GoalList } from '@/src/components/goalList';
import { TaiLayout } from '@/src/layout';

const Plan = () => {
  return (
    <TaiLayout>
      <GoalList />
    </TaiLayout>
  );
};

export default Plan;
