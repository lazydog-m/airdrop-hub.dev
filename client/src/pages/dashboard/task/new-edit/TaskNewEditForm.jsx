import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import { useState, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from "react-router-dom"
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Select from "@/components/Select";
import { ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useNotification from "@/hooks/useNotification";
import useSpinner from "@/hooks/useSpinner";
import Editor from "@/components/Editor";
import { TaskRank, TaskStatus } from "@/enums/enum";
import { PATH_DASHBOARD } from "@/routes/path";
import useMessage from "@/hooks/useMessage";
import { format } from "date-fns"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // 👈
dayjs.locale('vi'); // 👈 set global
import { viVN } from '@mui/x-date-pickers/locales';
import Popover from "@/components/Popover";
import { Badge } from "@/components/ui/badge";
import { convertTaskStatusEnumToColorHex, convertTaskStatusEnumToText, darkenColor, lightenColor } from "@/utils/convertUtil";
import { DropdownMenu } from "@/components/DropdownMenu";

const ff = "Inter, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

export default function TaskNewEditForm({ isEdit, currentTask, onUpdateData }) {


  const { id } = useParams();

  const navigate = useNavigate();
  const { onSuccess } = useMessage();

  const TaskSchema = Yup.object().shape({
    task_name: Yup.string()
      .trim().required('Tên công việc không được để trống!'),
    // due_date: currentTask?.status || ProjectCost.FREE,
  });

  const defaultValues = {
    task_name: currentTask?.task_name || '',
    // status: currentTask?.status || '',
    due_date: currentTask?.due_date ? dayjs(currentTask.due_date) : null,
    description: currentTask?.description || '',
    status: currentTask?.status || TaskStatus.TO_DO,
  };

  const methods = useForm({
    resolver: yupResolver(TaskSchema),
    defaultValues,
  });

  const {
    reset,
    formState,
    control,
    setValue,
    handleSubmit,
    watch, getValues,
  } = methods;

  useEffect(() => {
    if (isEdit && currentTask) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTask]);

  const { showConfirm, showSaved } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const { onOpen, onClose } = useSpinner();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        ...data,
        id,
        due_date: data.due_date ? dayjs(data.due_date).format('YYYY-MM-DD') : null,
      }
      console.log(body)
      showConfirm("Xác nhận cập nhật công việc?", () => put(body));
    }
    else {
      const body = {
        ...data,
        due_date: dayjs(data.due_date).format('YYYY-MM-DD'),
      }
      console.log(body)
      showConfirm("Xác nhận tạo công việc?", () => post(data));
    }
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/tasks", body);
      navigate(PATH_DASHBOARD.task.list)
      showSaved("Tạo công việc thành công!");
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const put = async (body) => {
    try {
      onOpen();
      const response = await apiPut("/tasks", body);
      onUpdateData(response.data.data);
      // navigate(PATH_DASHBOARD.task.edit(response.data.data.id))
      navigate(PATH_DASHBOARD.task.list)
      showSaved("Cập nhật công việc thành công!"); // ?? cai nao nen hien truoc (ko tot ui vi ben list loading dang den man hinh)
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const customLocaleText = {
    ...viVN.components.MuiLocalizationProvider.defaultProps.localeText,
    toolbarTitle: <span className="font-inter fw-500 fs-14 d-block" style={{ width: '200px' }}>Chọn ngày hết hạn</span>, // ← Đây là dòng đổi "text Select date"
    cancelButtonLabel: 'Làm mới',
  };

  return (

    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='d-flex justify-content-center mt-20 pt-1' gutter={[0, 20]}>

        <Col span={24}>
          <RHFInput
            label='Tên công việc'
            name='task_name'
            placeholder='Nhập tên công việc'
            required
            style={{ height: '45px', fontSize: '15px' }}
          />
        </Col>

        <Col span={24}>
          <Controller
            name='status'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Trạng thái
                </label>
                <Popover className='button-dropdown-filter-checkbox pointer mt-10'
                  trigger={
                    <Badge
                      className='text-capitalize custom-badge select-none pointer h-9'
                      style={{
                        backgroundColor: `${darkenColor(convertTaskStatusEnumToColorHex(field.value))}`,
                        color: 'white',
                        borderColor: `${lightenColor(convertTaskStatusEnumToColorHex(field.value))}`,
                        paddingInline: '15px',
                        borderRadius: '0px'
                      }}
                    >
                      <span className="fs-14">
                        {convertTaskStatusEnumToText(field.value)}
                      </span>
                    </Badge>
                  }
                  content={
                    <DropdownMenu
                      items={[
                        {
                          actions: TaskStatusList.map((item) => {
                            return {
                              disabled: item === field.value,
                              onClick: () => field.onChange(item),
                              title:
                                <Badge
                                  onClick={() => field.onChange(item)}
                                  className='text-capitalize custom-badge select-none'
                                  style={{
                                    backgroundColor: `${darkenColor(convertTaskStatusEnumToColorHex(item))}`,
                                    color: 'white',
                                    borderColor: `${lightenColor(convertTaskStatusEnumToColorHex(item))}`,
                                    borderRadius: '0px'
                                  }}
                                >
                                  <span className="fs-14">
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
              </>
            )}
          />

        </Col>


        <Col span={24} className='color-white'>
          <Controller
            name='due_date'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Ngày hết hạn
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                  <StaticDatePicker
                    onChange={(date) => field.onChange(date)}
                    onClose={() => field.onChange(null)}
                    value={field.value}
                    disablePast
                    // orientation="landscape"
                    className="mt-10 font-inter"
                    localeText={customLocaleText}
                    dayOfWeekFormatter={(date) => date.format("dd")}
                    sx={{
                      backgroundColor: '#323230',
                      border: '1px solid #404040',
                      borderRadius: '0px',
                      maxHeight: '550px',
                      letterSpacing: '0.05rem !important',
                      '& .MuiPickersDay-today': {
                        // borderRadius: 0,
                        letterSpacing: '0.05rem !important',
                        backgroundColor: darkenColor('#D97757', 0.50),  // Màu nền ngày hiện tại
                        color: '#fff !important',    // Màu chữ của ngày hiện tại
                        borderColor: '#D97757 !important'
                      },
                      '& .MuiButton-root': {
                        marginBottom: '20px',
                        marginRight: '15px',
                        borderRadius: '0px',
                        height: '40px',
                        width: '100px',
                        fontSize: '13px',
                        letterSpacing: '0.05rem !important',
                        textTransform: 'capitalize',
                        backgroundColor: '#D97757',
                        fontFamily: ff,
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#C36B4E',
                        },
                      },
                    }}
                    slotProps={{
                      actionBar: {
                        actions: ['cancel'], // Chỉ hiển thị nút "Cancel" (mà ta rename thành "Clear")
                        onCalcel: () => field.onChange(null), // Xử lý "Clear"
                      },
                      toolbar: {
                        toolbarFormat: 'Ngày D [tháng] M',
                      },
                      day: {
                        sx: {
                          color: '#fff !important',            // chữ trắng
                          '&.Mui-selected': {
                            backgroundColor: '#D97757 !important',  // chọn -> xám
                            color: '#fff !important',            // chữ trắng
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: '#C36B4E !important',  // hover khi đã chọn
                          },
                          '&:hover': {
                            backgroundColor: '#C36B4E',             // hover khi chưa chọn
                            color: '#fff !important',            // chữ trắng
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        <Col span={24}>
          <div>
            <Controller
              name='description'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <label className='d-block font-inter fw-500 fs-14'>
                    Mô tả công việc
                  </label>

                  <Editor
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                  {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
                </>
              )}
            />
          </div>
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-20 mt-5'>
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>

      </Row>
    </FormProvider>
  )
}

const TaskStatusList = [TaskStatus.TO_DO, TaskStatus.IN_PROGRESS, TaskStatus.TO_REVIEW, TaskStatus.COMPLETED];
