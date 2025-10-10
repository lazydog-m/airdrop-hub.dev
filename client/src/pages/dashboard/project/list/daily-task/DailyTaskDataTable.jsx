import { ButtonIcon, ButtonPrimary } from "@/components/Button";
import DropdownUi from "@/components/DropdownUi";
import { Badge } from "@/components/ui/badge";
import { Color } from "@/enums/enum";
import { darkenColor, lightenColor } from "@/utils/convertUtil";
import { CirclePlay, ClipboardClock, ClipboardPen, Clock, Ellipsis, FileSymlink, Star, ToggleLeft, ToggleRight, Trash2, UserRoundCheck, } from "lucide-react";
import React, { useState } from "react";
import { RiTodoLine } from "react-icons/ri";
import { GrSchedulePlay } from "react-icons/gr";
import { TbClockCheck } from "react-icons/tb";
import { Progress } from "@/components/ui/progress";
import TablePagination from "@/components/TablePagination";
import { BadgePrimary, BadgePrimaryOutline, BadgeWhite } from "@/components/Badge";
import EmptyData from "@/components/EmptyData";
import useSpinner from "@/hooks/useSpinner";
import useConfirm from "@/hooks/useConfirm";
import useMessage from "@/hooks/useMessage";
import DailyTaskNewEditForm from "../../new-edit/DailyTaskNewEditForm";
import Modal from "@/components/Modal";
import { apiDelete, apiPut } from "@/utils/axios";

export default function DailyTaskDataTable({
  data = [],
  pagination,
  onChangePage,
  onUpdateData,
  onDeleteData,

  projectId,
  projectName,
}) {

  const [open, setOpen] = React.useState(false);
  const [task, setTask] = React.useState({});
  const { onOpen, onClose } = useSpinner();
  const { showConfirm, showSaved } = useConfirm();
  const { onSuccess, onError } = useMessage();
  const isEdit = true;

  const handleClickOpen = (item) => {
    setOpen(true);
    setTask(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id, name) => {
    showConfirm(`Xác nhận xóa task '${name}'?`, () => remove(id));
  }

  const handleOrderStar = (id, orderStar) => {
    const body = {
      id,
      orderStar,
    }
    star(body);
  }

  const triggerRemove = () => {
    onClose();
    onSuccess("Xóa thành công!")
  }

  const triggerPut = () => {
    onClose();
  }

  const star = async (body) => {
    try {
      onOpen();
      const response = await apiPut(`/tasks/order-star`, body);
      onDeleteData(triggerPut);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const remove = async (id) => {
    try {
      onOpen();
      const response = await apiDelete(`/tasks/${id}`);
      onDeleteData(triggerRemove);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const rows = React.useMemo(() => {
    return data?.map((row) => (
      <div className="project-task-item font-inter pdi-20 border-1 flex flex-col justify-between"
        // opacity-70
        key={row?.id}
      >

        <div className="project-task-header d-flex justify-between items-center mt-2">
          <span className="text-capitalize d-flex fw-500 fs-18 items-center gap-6">
            <RiTodoLine size={'19px'} />
            <span className="text-too-long-280">
              {row?.name}
            </span>
          </span>

          <div className="d-flex gap-3 items-center">
            <Star
              onClick={() => handleOrderStar(row?.id, row?.order_star)}
              className="select-none task-icon"
              size={'16px'}
              color={row?.order_star ? Color.WARNING : 'white'}
              fill={row?.order_star ? Color.WARNING : 'transparent'}
            />
            <DropdownUi
              align='end'
              footerDelete
              trigger={
                <Ellipsis size={'16px'}
                  className="select-none task-icon"
                />
              }
              group={[
                {
                  title: <MoreItem
                    title={'Chỉnh sửa'}
                    icon={<ClipboardPen size={'17px'} />}

                  />,
                  onClick: () => handleClickOpen(row)
                },
                {
                  title: (
                    <MoreItem
                      title={row?.status ? 'Hiển thị' : 'Ẩn'}
                      icon={<ToggleRight size={'18px'} />}
                    />
                  ),
                  // onClick: () => handleDelete(row.id, row.name)
                },
                row?.script_name && {
                  title: (
                    <MoreItem
                      title={row?.script_name}
                      icon={<FileSymlink size={'17px'} />}
                    />
                  ),
                },
              ].filter(Boolean)
              }
              footer={
                {
                  title: <MoreItem
                    title={<span style={{ color: Color.ORANGE }}>Xóa task</span>}
                    icon={<Trash2 size={'17px'} color={Color.ORANGE} />}
                  />,
                  onClick: () => handleDelete(row.id, row.name)
                }
              }
            />
          </div>
        </div>

        <div className="project-task-desc mt-15">
          <span className="fw-400 clamp-3">
            {row?.description || 'Chưa có mô tả'}
          </span>
        </div>

        <div className="project-task-badge d-flex gap-6 mt-20">
          {row?.points &&
            <BadgePrimaryOutline>
              {`${row?.points} Points`}
            </BadgePrimaryOutline>
          }
          <BadgePrimary>
            {'Automation'}
          </BadgePrimary>

          {row?.has_manual &&
            <BadgeWhite>
              Manual
            </BadgeWhite>
          }

          {/* <Badge className='custom-badge bdr select-none' */}
          {/*   style={{ */}
          {/*     backgroundColor: `${darkenColor(Color.PRIMARY)}`, */}
          {/*     borderColor: `${lightenColor(Color.PRIMARY)}`, */}
          {/*     color: 'white', */}
          {/*   }} */}
          {/* > */}
          {/*   UTC+0 */}
          {/* </Badge> */}
          {/* <Badge className='custom-badge bdr select-none' */}
          {/*   style={{ */}
          {/*     backgroundColor: `${darkenColor(Color.WARNING)}`, */}
          {/*     borderColor: `${lightenColor(Color.WARNING)}`, */}
          {/*     color: 'white', */}
          {/*   }} */}
          {/* > */}
          {/*   CD-24 */}
          {/* </Badge> */}
        </div>

        <div className="project-task-progress mt-20">
          <div className="progress-header d-flex items-center justify-between">
            <div className='d-flex items-center gap-1.5'>
              <UserRoundCheck size={'16px'} className="mb-1" />
              <span className=''>0/60</span>
            </div>
            <div className='d-flex items-center gap-1.5'>
              10%
            </div>
          </div>
          <Progress
            className="progress mt-5
            [&>div]:bg-gradient-to-r
            [&>div]:from-[#E2574C]
            [&>div]:via-[#C36648]
            [&>div]:to-[#2EAD33]
            overflow-hidden
              "
            value={50}
            style={{ borderRadius: '0px' }}
          />
        </div>

        <div className="project-task-footer d-flex justify-between items-center mt-15">
          <div className='d-flex items-center gap-3'>

            <div className='d-flex items-center gap-1.5 mb-2'>
              {/* <Clock size={"15px"} /> */}
              <ClipboardClock size={"16px"} />
              <span className="d-flex">
                {'UTC+0'}
              </span>
            </div>
          </div>

          <div className="d-flex">
            <GrSchedulePlay className='select-none pointer task-icon-footer' size={'21.5px'} />
          </div>
        </div>

      </div>
    ))
  }, [data]);

  return (
    <>
      {rows?.length > 0 ?
        <div className="project-task-container gap-20 scroll-smooth grid grid-cols-3">
          {rows}
        </div>
        :
        <div className="mt-20">
          <EmptyData table={false} />
        </div>
      }
      <TablePagination
        checkbox={false}
        selectedObjText='task'
        onChangePage={onChangePage}
        pagination={pagination}
      />

      <Modal
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật task hằng ngày"}
        content={
          <DailyTaskNewEditForm
            onCloseModal={handleClose}
            currentDailyTask={task}
            isEdit={isEdit}
            onUpdateData={onUpdateData}
            projectName={projectName}
            projectId={projectId}
          />
        }
      />
    </>
  )
}

const MoreItem = ({ title, icon }) => {
  return (
    <div
      style={{ width: '100%' }}
      className='fw-400 fs-13 d-flex justify-content-between gap-20'>
      <span className="text-too-long-180">
        {title}
      </span>
      {icon}
    </div>
  )
}
