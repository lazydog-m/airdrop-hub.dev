import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Select from "@/components/Select";
import { DailyTaskRefresh, ProjectCost, ProjectType } from "@/enums/enum";
import { ButtonPrimary } from "@/components/Button";
import { apiGet, apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import { Checkbox } from "@/components/Checkbox";
import useSpinner from "@/hooks/useSpinner";
import { convertDailyTaskRefreshEnumToText } from "@/utils/convertUtil";
import useMessage from "@/hooks/useMessage";
import AutocompleteInput from "@/components/Autocomplete";
import RHFTextarea from "@/components/hook-form/RHFTextarea";

export default function ProjectNewEditForm({ onCloseModal, isEdit, currentProject, onUpdateData }) {

  const ProjectSchema = Yup.object().shape({
    name: Yup.string()
      .trim().required('Tên dự án không được để trống!'),
  });

  const defaultValues = {
    name: currentProject?.name || '',
    type: currentProject?.type || ProjectType.WEB,
    cost_type: currentProject?.cost_type || ProjectCost.FREE,
    url: currentProject?.url || '',
    faucet_url: currentProject?.faucet_url || '',
    zealy_url: currentProject?.zealy_url || '',
    galxe_url: currentProject?.galxe_url || '',
    discord_url: currentProject?.discord_url || '',
    funding_rounds_url: currentProject?.funding_rounds_url || '',
    is_cheat: isEdit ? currentProject.is_cheat : true,
    is_cheating: isEdit ? currentProject.is_cheating : false,
    daily_tasks: currentProject?.daily_tasks || '',
    daily_tasks_refresh: currentProject?.daily_tasks_refresh || DailyTaskRefresh.UNKNOWN,
    url_daily_tasks: currentProject?.url_daily_tasks || '',
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
  const [dailyTasks, setDailyTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log(data)
    if (isEdit) {
      const body = {
        ...data,
        id: currentProject.id,
      }
      showConfirm("Xác nhận cập nhật dự án?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới dự án?", () => post(data));
    }
  }

  const triggerPost = () => {
    onSuccess("Tạo dự án thành công!")
    onCloseModal();
    onClose();
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/projects", body);
      onUpdateData(isEdit, response.data.data, triggerPost);
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
      onSuccess("Cập nhật dự án thành công!");
      onUpdateData(isEdit, response.data.data)
      onCloseModal();
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await apiGet("/projects/daily-tasks");
        setDailyTasks(response.data.data || []);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        onError(error.message);
        setLoading(false);
      }
    }

    fetch();
  }, [])

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
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Loại dự án
                </label>

                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Select type'
                  className='mt-10'
                  items={[ProjectType.TESTNET, ProjectType.WEB, ProjectType.DEPIN, ProjectType.RETROACTIVE, ProjectType.GAME, ProjectType.GALXE]}
                />
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        <Col span={8}>
          <Controller
            name='cost_type'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Chi phí
                </label>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Select cost type'
                  className='mt-10'
                  items={[ProjectCost.FREE, ProjectCost.FEE, ProjectCost.HOLD]}
                />
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        <Col span={8}>
          <RHFInput
            label='Link'
            name='url'
            placeholder='https://www.airdrophub.dev'
          />
        </Col>

        <Col span={8}>
          <RHFInput
            label='Funding rounds'
            name='funding_rounds_url'
            placeholder='https://cryptorank.io/ico'
          />
        </Col>

        <Col span={8}>
          <RHFInput
            label='Discord'
            name='discord_url'
            placeholder='https://discord.com/channels'
          />
        </Col>

        <Col span={8}>
          <Controller
            name='daily_tasks'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Làm hằng ngày
                </label>
                <AutocompleteInput
                  style={{ pointerEvents: loading ? 'none' : '' }}
                  value={field.value}
                  items={dailyTasks}
                  placeholder='Check-in | Xào task'
                  onChange={(value) => field.onChange(value)}
                />
              </>
            )}
          />
        </Col>

        <Col span={8}>
          <RHFInput
            label='Link làm'
            name='url_daily_tasks'
            placeholder='https://www.airdrophub.dev/task'
          />
        </Col>

        <Col span={8}>
          <Controller
            name='daily_tasks_refresh'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Làm mới task
                </label>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Chọn thời điểm làm mới'
                  className='mt-10'
                  items={[DailyTaskRefresh.UNKNOWN, DailyTaskRefresh.UTC0, DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP, DailyTaskRefresh.NEW_TASK]}
                  convertItem={convertDailyTaskRefreshEnumToText}
                />
                {error && <span className='font-inter color-red mt-3 d-block errorColor'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        <Col span={8}>
          <RHFInput
            label='Faucet'
            name='faucet_url'
            placeholder='https://faucet.project'
          />
        </Col>

        <Col span={8}>
          <RHFInput
            label='Galxe'
            name='galxe_url'
            placeholder='https://app.galxe.com/quest'
          />
        </Col>

        <Col span={8}>
          <RHFInput
            label='Zealy'
            name='zealy_url'
            placeholder='https://zealy.io/project'
          />
        </Col>

        <Col span={24}>
          <RHFTextarea
            label='Ghi chú'
            name='note'
            placeholder='Nhập ghi chú ...'
          />
        </Col>

        <Col span={24} className='d-flex gap-15 mt-6'>

          <Controller
            name='is_cheat'
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  {...field}
                  label='Cheat'
                  checked={field.value}
                />
              </>
            )}
          />

          <Controller
            name='is_cheating'
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  {...field}
                  label='Đang cheat'
                  checked={field.value}
                />
              </>
            )}
          />

        </Col>

        <Col span={24} className='d-flex justify-content-end mb-5'>
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>
      </Row>
    </FormProvider>

  )
}

