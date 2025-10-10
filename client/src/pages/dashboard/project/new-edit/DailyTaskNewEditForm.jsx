import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { ButtonOutline, ButtonPrimary } from "@/components/Button";
import { apiGet, apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import { Checkbox } from "@/components/Checkbox";
import useSpinner from "@/hooks/useSpinner";
import useMessage from "@/hooks/useMessage";
import RHFTextarea from "@/components/hook-form/RHFTextarea";
import { ErrorMessage } from "@/components/ErrorMessage";
import Combobox from "@/components/Combobox";
import Autocomplete from "@/components/Autocomplete";
import { parseNumber } from "@/utils/convertUtil";

export default function DailyTaskNewEditForm({ onCloseModal, isEdit, currentDailyTask, onUpdateData, projectName, projectId }) {

  const DailyTaskSchema = Yup.object().shape({
    name: Yup.string()
      .trim().required('Tên task không được để trống!'),
  });

  const defaultValues = {
    name: currentDailyTask?.name || '',
    points: currentDailyTask?.points || '', // null
    url: currentDailyTask?.url || '',
    script_name: currentDailyTask?.script_name || '',
    // status: currentDailyTask?.status || ProjectStatus.DOING,
    // daily_tasks_refresh: currentDailyTask?.daily_tasks_refresh || DailyTaskRefresh.UNKNOWN,
    description: currentDailyTask?.description || '',
    has_manual: isEdit ? currentDailyTask.has_manual : false,
  };

  const methods = useForm({
    resolver: yupResolver(DailyTaskSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch,
    getValues,
    formState: { isValid }
  } = methods;

  const { showConfirm, showSaved } = useConfirm();
  const { onOpen, onClose } = useSpinner();
  const { onSuccess, onError } = useMessage();

  const onSubmit = async (data) => {
    console.log(data)
    const points = parseNumber(data?.points) || null;
    if (isEdit) {
      const body = {
        ...data,
        id: currentDailyTask.id,
        project_id: projectId,
        points,
      }
      console.log(body)
      showConfirm("Xác nhận cập nhật task hằng ngày?", () => put(body));
    }
    else {
      const body = {
        ...data,
        project_id: projectId,
        points,
      }
      console.log(body)
      showConfirm("Xác nhận thêm mới task hằng ngày?", () => post(body));
    }
  }

  const triggerPost = () => {
    onCloseModal();
    onClose();
    onSuccess("Thêm mới thành công!")
  }

  const triggerPut = () => {
    onCloseModal();
    onClose();
    onSuccess("Cập nhật thành công!");
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/tasks", body);
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
      const response = await apiPut("/tasks", body);
      onUpdateData(triggerPut);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const [scripts, setScripts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await apiGet("/scripts/project/contains-name", { projectName });
        setScripts(response.data.data || []);
      } catch (error) {
        console.error(error);
        onError(error.message)
      }
    }

    fetch();
  }, [])

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='mt-5' gutter={[25, 20]}>

        <Col span={16}>
          <Controller
            name='name'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Tên task
                  <span className={'required'}></span>
                </label>
                <Autocomplete
                  value={field.value}
                  items={DAILY_TASK_ARR}
                  onChange={(value) => field.onChange(value)}
                  placeholder='Nhập tên task'
                />
                <ErrorMessage
                  message={error?.message}
                />
              </>
            )}
          />
        </Col>

        <Col span={8}>
          <RHFInput
            label='Points bonus'
            name='points'
            placeholder='Nhập số points'
            type='number'
            min="1"
          // max="9999999999999999"
          />
        </Col>

        <Col span={24}>
          <RHFInput
            label='Link'
            name='url'
            placeholder='https://www.lazy-airdrop.dev'
          />
        </Col>

        <Col span={24}>
          <Controller
            name='script_name'
            control={control}
            render={({ field }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Script
                </label>
                <Combobox
                  value={field.value}
                  items={scripts?.map(item => item.fileName) || []}
                  placeholder='Chọn script'
                  placeholderSearch="script"
                  onChange={(value) => field.onChange(value)}
                  capitalize={false}
                />
              </>
            )}
          />
        </Col>

        {/* <Col span={24}> */}
        {/*   <Controller */}
        {/*     name='daily_tasks_refresh' */}
        {/*     control={control} */}
        {/*     render={({ field, fieldState: { error } }) => ( */}
        {/*       <> */}
        {/*         <label className='d-block font-inter fw-500 fs-14'> */}
        {/*           Làm mới task */}
        {/*         </label> */}
        {/*         <Select */}
        {/*           onValueChange={(value) => field.onChange(value)} */}
        {/*           value={field.value} */}
        {/*           // placeholder='Chọn thời điểm làm mới' */}
        {/*           className='mt-10' */}
        {/*           items={[DailyTaskRefresh.UNKNOWN, DailyTaskRefresh.UTC0, DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP]} */}
        {/*           convertItem={convertDailyTaskRefreshEnumToText} */}
        {/*         /> */}
        {/*       </> */}
        {/*     )} */}
        {/*   /> */}
        {/* </Col> */}

        <Col span={24}>
          <RHFTextarea
            label='Mô tả'
            name='description'
            placeholder='Nhập mô tả ...'
            height="150px"
          />
        </Col>

        <Col span={24} className='d-flex gap-15 mt-6'>

          {/* <Checkbox */}
          {/*   label='Points' */}
          {/*   checked={hasPoint} */}
          {/*   onChange={() => { */}
          {/*     setValue('point', '') */}
          {/*     setHasPoint(!hasPoint) */}
          {/*   }} */}
          {/* /> */}

          <Controller
            name='has_manual'
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  {...field}
                  label='Manual'
                  checked={field.value}
                />
              </>
            )}
          />

        </Col>

        <Col span={24} className='d-flex justify-content-end mb-5 gap-10'>
          <ButtonOutline type='button' title={'Hủy'} onClick={onCloseModal} />
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>

      </Row>
    </FormProvider>

  )
}

const DAILY_TASK_ARR = [
  'Check-In',
  'Check Login',
  'Faucet',
  'Bridge',
  'Swap',
  'Stake',
  'Chatbot',
  'Quiz',
];
