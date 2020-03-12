/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React, { useCallback } from 'react';

import { Button, Card } from '@yishanzhilubp/core';

import { Flex } from '@/src/components/flex';

import { RecordsContext } from './recordListReduceContext';
import { useWorkListContext } from '../workList';
import { NewRecordEditing } from './newRecordEditing';

export const NewRecord = () => {
  const { state, dispatch } = React.useContext(RecordsContext);
  const [_, setWorkList] = useWorkListContext();
  const handleCancel = useCallback(() => {
    setWorkList({});
    dispatch({ type: 'AddRecordCancel' });
  }, []);
  const NewRecordEl = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (state.addNew) {
      const headerOffset = 110;
      const elementPosition = NewRecordEl.current.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, [state.addNew]);
  return (
    <div className="new-record" ref={NewRecordEl}>
      <Card>
        <Flex justifyContent="space-between">
          <Button
            icon={<span>📝</span>}
            onClick={() => dispatch({ type: 'AddRecord' })}
          >
            添加记录
          </Button>
          <div>记录点什么？</div>
        </Flex>
      </Card>
      <div className="back-drop" onClick={handleCancel} />
      {state.addNew && <NewRecordEditing />}
      <style jsx>{`
        .new-record {
          position: relative;
          transition: all 0.3s;
        }
        .back-drop {
          background: #000;
          left: 0;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 20;
        }
      `}</style>
      <style jsx>{`
        .back-drop {
          bottom: ${state.addNew ? '0%' : '100%'};
          opacity: ${state.addNew ? '0.6' : '0'};
          transition: ${state.addNew
            ? 'opacity 0.3s'
            : 'opacity 0.3s, bottom 0s 0.3s'};
        }
      `}</style>
    </div>
  );
};
