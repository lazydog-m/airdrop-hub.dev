import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { convertProjectCostTypeEnumToColorHex, convertProjectStatusEnumToColorHex, convertProjectStatusEnumToText, convertProjectTypeEnumToColorHex, darkenColor, lightenColor } from '@/utils/convertUtil';
import { Check, Ellipsis, Fingerprint, SquareArrowOutUpRight, SquarePen, Trash2, X } from 'lucide-react';
import { TbCalendarCheck } from "react-icons/tb";
import { Badge } from '@/components/ui/badge';
import { Color, DailyTaskRefresh, NOT_AVAILABLE, ProjectStatus } from '@/enums/enum';
import { Link } from 'react-router-dom';
import { formatDateVN } from '@/utils/formatDate';
import Modal from '@/components/Modal';
import ProjectNewEditForm from '../create/ProjectNewEditForm';
import Popover from '@/components/Popover';
import { SelectItems } from '@/components/SelectItems';
import { FaDiscord } from 'react-icons/fa6';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete, apiPost, apiPut } from '@/utils/axios';
import useConfirm from '@/hooks/useConfirm';
import useMessage from '@/hooks/useMessage';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/Checkbox';

const colunms = [
  { header: 'Tên Dự Án', align: 'left' },
  { header: 'Mảng', align: 'left' },
  { header: 'Trạng Thái', align: 'left' },
  // { header: 'Tài Nguyên', align: 'left' },
  { header: 'Thời Gian', align: 'left' },
  { header: 'Cheat', align: 'left' },
  { header: 'Làm Hằng Ngày', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function ProjectDataTable({
  data = [],
  onUpdateData,
  onDeleteData,
  onChangePage,
  pagination,
  onSelectAllRows,
  onSelectRow,
  selected = []
}) {

  const [open, setOpen] = React.useState(false);
  const [project, setProject] = React.useState({});
  const { onOpen, onClose } = useSpinner();
  const { showConfirm } = useConfirm();

  const { onSuccess, onError } = useMessage();
  const isEdit = true;

  // const handleClick = (event) => {
  //   const rows = document.querySelectorAll('.table-row');
  //   rows.forEach((row) => row.classList.remove('active-row'));
  //
  //   const rowElement = event.target.closest('tr');
  //   if (rowElement) {
  //     rowElement.classList.add('active-row');
  //   }
  // };

  const handleClickOpen = (item) => {
    setOpen(true);
    setProject(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id) => {
    showConfirm("Xác nhận xóa dự án?", () => remove(id));
  }

  const handleUpdateProjectStatus = (id, status) => {
    const body = {
      id,
      status,
    };
    showConfirm(`Xác nhận cập nhật trạng thái của dự án thành '${convertProjectStatusEnumToText(status)?.toUpperCase()}'?`, () => putStatus(body));
  }

  const handleCompleteDailyTask = (project_id) => {
    const body = {
      project_id,
    };
    showConfirm(`Xác nhận hoàn thành nhiệm vụ của ngày hôm nay?`, () => postCompleteDailyTasks(body));
  }

  const postCompleteDailyTasks = async (body) => {
    try {
      onOpen();
      const response = await apiPost(`/projects/complete-daily-tasks`, body);
      onSuccess("Đã hoàn thành!");
      onUpdateData(isEdit, response.data.data);
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const putStatus = async (body) => {
    try {
      onOpen();
      const response = await apiPut(`/projects/status`, body);
      onSuccess("Cập nhật trạng thái của dự án thành công!");
      onUpdateData(isEdit, response.data.data);
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const triggerRemove = () => {
    onSuccess("Xóa dự án thành công!")
    onClose();
  }

  const remove = async (id) => {
    try {
      onOpen();
      const response = await apiDelete(`/projects/${id}`);
      onDeleteData(response.data.data, triggerRemove);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const rows = React.useMemo(() => {
    return data.map((row) => (
      <TableRow
        className='table-row'
        key={row.id}
        selected={selected.includes(row.id)}
      >
        <TableCell align="left" >
          <Checkbox
            checked={selected.includes(row.id)}
            onClick={() => onSelectRow(row.id)}
          />
        </TableCell>
        <TableCell align="left">
          <span className='font-inter color-white fw-bold text-too-long'>
            {row.name}
          </span>
        </TableCell>
        <TableCell align="left">
          <div className='d-flex gap-8'>
            <Badge
              className='text-capitalize custom-badge bdr'
              style={{
                backgroundColor: `${darkenColor(convertProjectTypeEnumToColorHex(row.type))}`,
                color: 'white',
                borderColor: `${lightenColor(convertProjectTypeEnumToColorHex(row.type))}`,
              }}
            >
              {row.type}
            </Badge>
            <Badge
              className='text-capitalize custom-badge bdr'
              style={{
                backgroundColor: `${darkenColor(convertProjectCostTypeEnumToColorHex(row.cost_type))}`,
                color: 'white',
                borderColor: `${lightenColor(convertProjectCostTypeEnumToColorHex(row.cost_type))}`,
              }}
            >
              {row.cost_type}
            </Badge>
          </div>
        </TableCell>
        <TableCell align="left">
          <Popover className='button-dropdown-filter-checkbox pointer'
            trigger={
              <Badge
                className='text-capitalize custom-badge select-none bdr'
                style={{
                  backgroundColor: `${darkenColor(convertProjectStatusEnumToColorHex(row.status))}`,
                  color: 'white',
                  borderColor: `${lightenColor(convertProjectStatusEnumToColorHex(row.status))}`,
                }}
              >
                <span className=''>
                  {convertProjectStatusEnumToText(row.status)}
                </span>
              </Badge>
            }
            content={
              <SelectItems
                items={[
                  {
                    actions: ProjectStatusList.map((item) => {
                      return {
                        disabled: item === row.status,
                        onClick: () => handleUpdateProjectStatus(row.id, item),
                        title:
                          <Badge
                            onClick={() => handleUpdateProjectStatus(row.id, row.status)}
                            className='text-capitalize custom-badge select-none bdr'
                            style={{
                              backgroundColor: `${darkenColor(convertProjectStatusEnumToColorHex(item))}`,
                              color: 'white',
                              borderColor: `${lightenColor(convertProjectStatusEnumToColorHex(item))}`,
                            }}
                          >
                            <span className='fs-14'>
                              {convertProjectStatusEnumToText(item)}
                            </span>
                          </Badge>
                      }
                    })
                  },
                ]}
              />
            }
          />
        </TableCell>
        <TableCell align="left">
          <Badge variant={'secondary'} className='badge-default bdr'>
            {`${formatDateVN(row.createdAt)} - ${!row.end_date ? NOT_AVAILABLE : formatDateVN(row.end_date)}`}
          </Badge>
        </TableCell>
        <TableCell align="left">
          <div className='d-flex gap-15'>
            {row.is_cheat ? <Check color={Color.SUCCESS} /> : <X color={Color.DANGER} />}
            {row.is_cheating ? <Fingerprint size={'22px'} color={Color.SECONDARY} /> : null}
          </div>
        </TableCell>
        <TableCell align="left">
          <div className='d-flex gap-8'>
            {/*xem xet lai*/}
            {row.url_daily_tasks && row.url_daily_tasks?.trim() !== '' && row.daily_tasks && row.daily_tasks?.trim() !== '' ?
              <Link to={row.url_daily_tasks} target='_blank' rel="noopener noreferrer">
                <Badge className='text-capitalize custom-badge pointer bdr select-none gap-6'
                  // onClick={handleClick}
                  style={{
                    backgroundColor: `${darkenColor(row.daily_tasks_completed ? Color.SUCCESS : row.daily_tasks_refresh === DailyTaskRefresh.NEW_TASK ? Color.SECONDARY :
                      row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP ? Color.WARNING : Color.ORANGE)}`,
                    borderColor: `${lightenColor(row.daily_tasks_completed ? Color.SUCCESS : row.daily_tasks_refresh === DailyTaskRefresh.NEW_TASK ? Color.SECONDARY :
                      row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP ? Color.WARNING : Color.ORANGE)}`,
                    color: 'white',
                  }}
                >
                  {/*
                    {row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP && !row.daily_tasks_completed && <ClockIcon size={'15px'} />}
*/}
                  {row.daily_tasks}
                  {row.daily_tasks_completed && <TbCalendarCheck size={'15px'} />}
                </Badge>
              </Link>
              :
              row.daily_tasks && row.daily_tasks?.trim() !== '' ?
                <Badge className='text-capitalize custom-badge pointer bdr select-none gap-6'
                  style={{
                    backgroundColor: `${darkenColor(row.daily_tasks_completed ? Color.SUCCESS : row.daily_tasks_refresh === DailyTaskRefresh.NEW_TASK ? Color.SECONDARY :
                      row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP ? Color.WARNING : Color.ORANGE)}`,
                    borderColor: `${lightenColor(row.daily_tasks_completed ? Color.SUCCESS : row.daily_tasks_refresh === DailyTaskRefresh.NEW_TASK ? Color.SECONDARY :
                      row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP ? Color.WARNING : Color.ORANGE)}`,
                    color: 'white',
                  }}
                >
                  {/*
                    {row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP && !row.daily_tasks_completed && <ClockIcon size={'15px'} />}
*/}
                  {row.daily_tasks}
                  {row.daily_tasks_completed && <TbCalendarCheck size={'15px'} />}
                </Badge>
                :
                <X color={Color.DANGER} />
            }
            {row.daily_tasks && row.daily_tasks?.trim() !== '' && !row.daily_tasks_completed && row.status === ProjectStatus.DOING &&
              <Badge className='custom-badge gap-1 select-none pointer bdr'
                onClick={() => handleCompleteDailyTask(row.id)}
                style={{
                  backgroundColor: `${darkenColor(Color.SUCCESS)}`,
                  borderColor: `${lightenColor(Color.SUCCESS)}`,
                  color: 'white',
                }}
              >
                <TbCalendarCheck size={'15px'} />
              </Badge>
            }
            {/* row.daily_tasks && row.daily_tasks?.trim() !== '' && row.daily_tasks_completed && !row.daily_tasks_refresh_end_of_day &&
              <Badge className='custom-badge gap-1 select-none'
                style={{
                  backgroundColor: Color.WARNING,
                  color: 'black',
                }}
              >
                <Clock size={'15px'} />
                <span>
                  {formatDateVN(row.task_time_completed)}
                </span>
               dem gio task clock
              </Badge>
            */}
          </div>
        </TableCell>
        <TableCell align="left">
          <div className='d-flex'>
            {row.url &&
              <div className='d-flex me-10 justify-content-center align-items-center'>
                <Link to={row.url} target='_blank' rel="noopener noreferrer"
                >
                  <ButtonIcon
                    variant='ghost'
                    icon={<SquareArrowOutUpRight color={Color.PRIMARY} />}
                  />
                </Link>
                <Separator orientation="vertical" className='h-4 sepa ms-10' />
              </div>
            }
            <ButtonIcon
              onClick={() => handleClickOpen(row)}
              variant='ghost'
              icon={<SquarePen color={Color.WARNING} />}
            />
            {row.discord_url &&
              <Link to={row.discord_url} target='_blank' rel="noopener noreferrer">
                <ButtonIcon
                  variant='ghost'
                  icon={<FaDiscord color={Color.SECONDARY} />}
                />
              </Link>
            }
            <ButtonIcon
              onClick={() => handleDelete(row.id)}
              variant='ghost'
              icon={<Trash2 color={Color.DANGER} />}
            />
            {(row.funding_rounds_url || row.galxe_url || row.zealy_url || row.faucet_url) &&
              <Popover className='button-dropdown-filter-checkbox pointer'
                trigger={
                  <ButtonIcon
                    className="pointer button-icon select-none bdr"
                    variant='ghost'
                    icon={<Ellipsis />}
                  />
                }
                content={
                  <SelectItems
                    items={[
                      row.funding_rounds_url ? {
                        url: row.funding_rounds_url,
                        title: `Funding Rounds`,
                      } : null,
                      row.galxe_url ? {
                        url: row.galxe_url,
                        title: `Galxe`,
                      } : null,
                      row.zealy_url ? {
                        url: row.zealy_url,
                        title: `Zealy`,
                      } : null,
                      row.faucet_url ? {
                        url: row.faucet_url,
                        title: `Faucet`,
                      } : null,
                    ]}
                  />
                }
              />
            }
          </div>
        </TableCell>
      </TableRow >
    ));
  }, [data, selected]);

  return (
    <>
      <DataTableMemo
        className='mt-20'
        colunms={colunms}
        data={rows}
        pagination={pagination}

        selected={selected}
        isCheckedAll={data.length > 0 && data?.every(row => selected?.includes(row.id))}
        isIndeterminate={selected.length > 0 && data?.some(row => selected.includes(row.id)) && !data.every(row => selected.includes(row.id))}

        onSelectAllRows={onSelectAllRows}
        onChangePage={onChangePage}

        selectedObjText={'dự án'}
      />

      <Modal
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật dự án"}
        content={
          <ProjectNewEditForm
            onCloseModal={handleClose}
            currentProject={project}
            isEdit={isEdit}
            onUpdateData={onUpdateData}
          />
        }
      />
    </>
  );
}

const ProjectStatusList = [
  ProjectStatus.DOING,
  ProjectStatus.END_PENDING_UPDATE,
  ProjectStatus.SNAPSHOT,
  ProjectStatus.TGE,
  ProjectStatus.END_AIRDROP
];
