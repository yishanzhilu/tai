/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { IMission } from '@/src/model/schemas';
import Link from 'next/link';

export const MissionCard: React.FC<{
  index: number;
  mission: IMission;
  loading?: boolean;
}> = ({ mission, index }) => {
  // const [showMore, setShowMore] = useState(false);
  return (
    <Draggable draggableId={mission.id.toString()} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          className="card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className="row"
            // onMouseEnter={() => {
            //   setShowMore(true);
            // }}
            // onMouseLeave={() => {
            //   setShowMore(false);
            // }}
          >
            <div style={{ marginRight: 10 }}>
              <span style={{ marginRight: 5 }}>📜</span>
              <Link
                href="/workspace/mission/[id]"
                as={`/workspace/mission/${mission.id}`}
              >
                <a>{mission.title}</a>
              </Link>
            </div>
            {/* {loading ? (
              <Spinner size={14} />
            ) : (
              <Popover
                position="bottom-left"
                boundary="viewport"
                content={
                  <Menu>
                    <MenuItem icon={<span>✅</span>} text="添加事项" />
                    <MenuItem icon={<span>📝</span>} text="记录历程" />
                    <MenuItem icon={<span>⛔</span>} text="放弃任务" />
                  </Menu>
                }
              >
                <Button
                  style={{ visibility: showMore ? 'visible' : 'hidden' }}
                  minimal
                  small
                  icon="more"
                />
              </Popover>
            )} */}
          </div>

          <style jsx>{`
            .card {
              box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px,
                rgba(15, 15, 15, 0.1) 0px 2px 4px;
              border-radius: 3px;
              margin-bottom: 8px;
              background: white;
              padding: 10px 12px;
              line-height: 1.5;
              // shrink size for windows scroll bar
            }
            .row {
              display: flex;
              justify-content: space-between;
              align-items: start;
            }
          `}</style>
        </div>
      )}
    </Draggable>
  );
};
