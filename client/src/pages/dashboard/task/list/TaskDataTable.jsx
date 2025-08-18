import React, { useRef, useState } from 'react';
import { ButtonIcon } from '@/components/Button';
import { convertTaskStatusEnumToColorHex, convertTaskStatusEnumToText, convertWalletStatusEnumToReverse, convertWalletStatusEnumToTextReverse, darkenColor, lightenColor } from '@/utils/convertUtil';
import { Calendar1, CalendarX, GripVertical, SquarePen, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Color, TaskStatus, } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete, apiPut } from '@/utils/axios';
import useConfirm from '@/hooks/useConfirm';
import useNotification from '@/hooks/useNotification';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useMessage from '@/hooks/useMessage';
import Popover from '@/components/Popover';
import { SelectItems } from '@/components/SelectItems';
import { Link, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '@/routes/path';
import { formatDateVN } from '@/utils/formatDate';
import dayjs from 'dayjs';

export default function TaskDataTable({ data, onUpdateData, onUpdateRow, onDeleteData, dataType }) {
  const { onOpen, onClose } = useSpinner();
  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const { onSuccess } = useMessage();
  const navigate = useNavigate();

  const handleUpdateTaskStatus = (id, status) => {
    const body = {
      id,
      status,
    };
    showConfirm(`Xác nhận cập nhật trạng thái của công việc thành '${convertTaskStatusEnumToText(status)?.toUpperCase()}'?`, () => putStatus(body));
  }

  const handleUpdateTaskOrder = (orderedPayload) => {
    const body = {
      orderedPayload,
    };
    putOrder(body);
  }

  const putStatus = async (body) => {
    console.log(body)
    try {
      onOpen();
      const response = await apiPut(`/tasks/status`, body);
      onUpdateRow(response.data.data);
      onSuccess("Cập nhật trạng thái của công việc thành công!");
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const handleDelete = (id) => {
    showConfirm("Xác nhận xóa công việc?", () => remove(id));
  }

  const remove = async (id) => {
    try {
      onOpen();
      const response = await apiDelete(`/tasks/${id}`);
      onDeleteData(response.data.data);
      onSuccess("Xóa công việc thành công!");
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const putOrder = async (body) => {
    // onOpen();
    try {
      const response = await apiPut(`/tasks/order`, body);
      // onUpdateData(response.data.data);
      console.log(response.data.data)
      // onSuccess("Cập nhật thứ tự công việc thành công!");
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
      // onClose();
    } finally {
      // onClose();
    }
  }


  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdateData(items);

    const orderedPayload = items.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    handleUpdateTaskOrder(orderedPayload);
  }

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="task-container">
          {(provided) => (
            <div className='mt-15 font-inter color-white task-container fs-15' {...provided.droppableProps} ref={provided.innerRef}>
              {data?.map((row, index) => {
                return (
                  <Draggable key={row.id} draggableId={row.id} index={index}>
                    {(provided) => (
                      <>
                        <div
                          key={row.id}
                          className='task-row d-flex justify-content-center align-items-center select-none'
                          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        >

                          <div className='task-cell' style={{ width: '5%', flexBasis: '5%' }}>
                            <GripVertical className='select-none' color='#A8A8A8' size={'17px'} />
                          </div>

                          <div className='task-cell fw-bold gap-10 d-flex' style={{ width: '40%', flexBasis: '40%' }}>
                            <span className='task-name text-too-long-500'>
                              {row.task_name}
                            </span>
                          </div>

                          <div className='task-cell gap-15 d-flex' style={{ width: '25%', flexBasis: '25%' }}>
                            <Popover className='button-dropdown-filter-checkbox pointer'
                              trigger={
                                <Badge
                                  className='text-capitalize custom-badge select-none pointer d-flex align-items-center justify-content-center'
                                  style={{
                                    backgroundColor: `${darkenColor(convertTaskStatusEnumToColorHex(row.status))}`,
                                    color: 'white',
                                    borderColor: `${lightenColor(convertTaskStatusEnumToColorHex(row.status))}`,
                                    height: 'auto',
                                    borderRadius: '0px'
                                  }}
                                >
                                  <span className='fs-14'>
                                    {convertTaskStatusEnumToText(row.status)}
                                  </span>
                                </Badge>
                              }
                              content={
                                <SelectItems
                                  items={[
                                    {
                                      actions: TaskStatusList.map((item) => {
                                        return {
                                          disabled: item === row.status,
                                          onClick: () => handleUpdateTaskStatus(row.id, item),
                                          title:
                                            <Badge
                                              onClick={() => handleUpdateTaskStatus(row.id, row.status)}
                                              className='text-capitalize custom-badge select-none'
                                              style={{
                                                backgroundColor: `${darkenColor(convertTaskStatusEnumToColorHex(item))}`,
                                                color: 'white',
                                                borderColor: `${lightenColor(convertTaskStatusEnumToColorHex(item))}`,
                                                borderRadius: '0px'
                                              }}
                                            >
                                              <span className='fs-14'>
                                                {convertTaskStatusEnumToText(item)}
                                              </span>
                                            </Badge>
                                        }
                                      })
                                    },
                                    ,
                                  ]}
                                />
                              }
                            />

                            <Badge
                              className='text-capitalize custom-badge align-items-center gap-6 d-flex h-9'
                              style={{
                                backgroundColor: `${darkenColor(convertDayLeftToColoHex(formatDueDateText(row.due_date)))}`,
                                color: 'white',
                                borderColor: `${lightenColor(convertDayLeftToColoHex(formatDueDateText(row.due_date)))}`,
                                height: '30px',
                                borderRadius: '0px'
                              }}
                            >
                              {row.due_date ? <Calendar1 size={'15px'} style={{ marginBottom: '2.3px' }} /> : <CalendarX size={'15px'} style={{ marginBottom: '2.3px' }} />}
                              <span className='fs-14'>
                                {`${formatDueDateText(row.due_date)} ${row.due_date ? `- ${formatDateVN(row.due_date)}` : ''}`}
                              </span>
                            </Badge>
                          </div>

                          <div className='task-cell fw-bold'>
                            <div className='d-flex'>
                              <Link to={PATH_DASHBOARD.task.edit(row.id)}>
                                <ButtonIcon
                                  variant='ghost'
                                  icon={<SquarePen color={Color.WARNING} />}
                                />
                              </Link>
                              <ButtonIcon
                                onClick={() => handleDelete(row.id)}
                                variant='ghost'
                                icon={<Trash2 color={Color.DANGER} />}
                              />
                            </div>
                          </div>

                        </div>
                        {(index + 1) % 7 === 0 && <div className="padding-block" style={{ paddingBlock: '25px' }}>
                        </div>}
                      </>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

function formatDueDateText(dueDate) {
  if (!dueDate) return 'Không có thời hạn';

  const parsedDueDate = dayjs(dueDate);
  const today = dayjs().startOf('day');
  const daysLeft = parsedDueDate.diff(today, 'day');

  if (daysLeft > 0) return `Hạn còn ${daysLeft} ngày`;
  if (daysLeft === 0) return 'Hết hạn hôm nay';
  return `Đã quá hạn ${Math.abs(daysLeft)} ngày`;
}


const convertDayLeftToColoHex = (dayLeft) => {

  switch (dayLeft) {
    case 'Không có thời hạn':
      return Color.INFO
    case 'Hết hạn hôm nay':
      return Color.ORANGE
    default: return Color.ORANGE1
  }

}

const TaskStatusList = [TaskStatus.TO_DO, TaskStatus.IN_PROGRESS, TaskStatus.TO_REVIEW, TaskStatus.COMPLETED];











