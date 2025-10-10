import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Select from "@/components/Select";
import { DailyTaskRefresh, DAILY_TASK_TEXT, ProjectStatus, ProjectType, PROJECT_STATUS_ARR, PROJECT_TYPE_ARR } from "@/enums/enum";
import { ButtonOutline, ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useSpinner from "@/hooks/useSpinner";
import { convertDailyTaskRefreshEnumToText, convertProjectStatusEnumToText } from "@/utils/convertUtil";
import useMessage from "@/hooks/useMessage";
import RHFTextarea from "@/components/hook-form/RHFTextarea";
import AutocompleteTag from "@/components/AutocompleTag";
import { RESOURCES } from "@/commons/Resources";
import Combobox from "@/components/Combobox";

export default function ProjectNewEditForm({ onCloseModal, isEdit, currentProject, onUpdateData }) {

  const ProjectSchema = Yup.object().shape({
    name: Yup.string()
      .trim().required('Tên dự án không được để trống!'),
  });

  const defaultValues = {
    name: currentProject?.name || '',
    type: currentProject?.type || ProjectType.WEB,
    status: currentProject?.status || ProjectStatus.DOING,
    url: currentProject?.url || '',
    // daily_tasks: currentProject?.daily_tasks || '',
    daily_tasks_refresh: currentProject?.daily_tasks_refresh || DailyTaskRefresh.UNKNOWN,
    resources: currentProject?.resources?.length > 0 ? currentProject?.resources : [],
    note: currentProject?.note || '',
  };

  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch, getValues,
  } = methods;

  const { showConfirm } = useConfirm();
  const { onOpen, onClose } = useSpinner();
  const { onSuccess, onError } = useMessage();

  const onSubmit = async (data) => {
    console.log(data)
    if (isEdit) {
      const body = {
        ...data,
        id: currentProject.id,
      }
      console.log(body)
      showConfirm("Xác nhận cập nhật dự án?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới dự án?", () => post(data));
    }
  }

  const triggerPost = () => {
    onCloseModal();
    onClose();
    onSuccess("Thêm mới thành công!");
  }

  const triggerPut = () => {
    onCloseModal();
    onClose();
    onSuccess("Cập nhật thành công!");
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/projects", body);
      onUpdateData(triggerPost);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const put = async (body) => {
    try {
      onOpen();
      const response = await apiPut("/projects", body);
      onUpdateData(triggerPut);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='mt-5' gutter={[25, 20]} >

        <Col span={8}>
          <RHFInput
            label='Tên dự án'
            name='name'
            placeholder='Nhập tên dự án'
            required
          />
        </Col>

        <Col span={8}>
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Mảng
                </label>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Select type'
                  className='mt-10'
                  items={[...PROJECT_TYPE_ARR]}
                />
              </>
            )}
          />
        </Col>

        <Col span={8}>
          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Trạng thái
                </label>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Select status'
                  className='mt-10'
                  items={[...PROJECT_STATUS_ARR]}
                  convertItem={convertProjectStatusEnumToText}
                  disabled={currentProject?.status === ProjectStatus.END_AIRDROP}
                />
              </>
            )}
          />
        </Col>

        {/* <Col span={8}> */}
        {/*   <Controller */}
        {/*     name='daily_tasks' */}
        {/*     control={control} */}
        {/*     render={({ field }) => ( */}
        {/*       <> */}
        {/*         <label className='d-block font-inter fw-500 fs-14'> */}
        {/*           {DAILY_TASK_TEXT} */}
        {/*         </label> */}
        {/*         <Combobox */}
        {/*           value={field.value} */}
        {/*           items={DAILY_TASK_ARR} */}
        {/*           onChange={(value) => field.onChange(value)} */}
        {/*           placeholder='Chọn task' */}
        {/*           placeholderSearch="task" */}
        {/*         /> */}
        {/*       </> */}
        {/*     )} */}
        {/*   /> */}
        {/* </Col> */}

        <Col span={8}>
          <RHFInput
            label='Link'
            name='url'
            placeholder='https://www.lazy-airdrop.dev'
          />
        </Col>


        <Col span={8}>
          <Controller
            name='daily_tasks_refresh'
            control={control}
            render={({ field }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Refresh task hằng ngày
                </label>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Chọn thời điểm làm mới'
                  className='mt-10'
                  items={[DailyTaskRefresh.UNKNOWN, DailyTaskRefresh.UTC0, DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP]}
                  convertItem={convertDailyTaskRefreshEnumToText}
                />
              </>
            )}
          />
        </Col>

        <Col span={8}>
          <Controller
            name='resources'
            control={control}
            render={({ field }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Tài nguyên cần thiết
                </label>
                <AutocompleteTag
                  value={field.value}
                  items={RESOURCES}
                  onChange={(value) => field.onChange(value)}
                  placeholder='Chọn tài nguyên'
                  placeholderSearch='tài nguyên'
                  tags={
                    field.value?.map((id) => {
                      return RESOURCES.find(res => res.id === id)?.icon
                    })
                  }
                />
              </>
            )}
          />
        </Col>

        <Col span={24}>
          <RHFTextarea
            label='Ghi chú'
            name='note'
            placeholder='Nhập ghi chú ...'
            height="200px"
          />
        </Col>

        <Col span={24} className='d-flex justify-content-end mt-5 mb-5 gap-10'>
          <ButtonOutline type='button' title={'Hủy'} onClick={onCloseModal} />
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>

      </Row>
    </FormProvider>

  )
}

const DAILY_TASK_ARR = [
  'Check-in',
  // 'Check-in (Ext)',
  'Check-in, Xào task',
  'Xào task',
];
