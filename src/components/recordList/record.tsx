/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import * as React from 'react';
import classNames from 'classnames';
import { Card, Classes, H6, Button } from '@yishanzhilubp/core';

import { IRecord } from '@/src/model/schemas';
import { GoalMission } from '../goalMission';
import { Flex } from '../flex';
import { getDateDiffFromNow } from '@/src/utils/funcs';

interface IProps {
  record: IRecord;
}

export const Record = ({ record }: IProps): React.ReactElement => {
  return (
    <Card>
      <H6>
        <span className={classNames(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
          @{getDateDiffFromNow(record.createdAt)}
        </span>
        <Flex justifyContent="space-between">
          <GoalMission goalMission={record} isTag={false} isLink />
          <Button small icon="trash">
            删除
          </Button>
        </Flex>
      </H6>
      <p>{record.content}</p>
      {record.thoughts && (
        <>
          <H6 className={Classes.TEXT_MUTED}>想法</H6>
          <p>{record.thoughts}</p>
        </>
      )}
    </Card>
  );
};
