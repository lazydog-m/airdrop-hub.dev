import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ButtonOutline, ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useNotification from "@/hooks/useNotification";
import useSpinner from "@/hooks/useSpinner";
import useMessage from "@/hooks/useMessage";
import RHFTextarea from "@/components/hook-form/RHFTextarea";

export default function ProfileNewEditForm({ onCloseModal, isEdit, currentProfile, onUpdateData }) {

  const ProfileSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ!')
      .trim().required('Email không được để trống!'),
    email_password: Yup.string()
      .trim().required('Mật khẩu email không được để trống!'),
  });

  const defaultValues = {
    email: currentProfile?.email || '',
    email_password: currentProfile?.email_password || '',
    discord_password: currentProfile?.discord_password || '',
    x_username: currentProfile?.x_username || '',
    discord_username: currentProfile?.discord_username || '',
    telegram_phone: currentProfile?.telegram_phone || '',
    note: currentProfile?.note || '',
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const { onSuccess, onError } = useMessage();

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch, getValues,
  } = methods;

  const { showConfirm, showSaved } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const { onOpen, onClose } = useSpinner();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        ...data,
        id: currentProfile.id,
      }
      showConfirm("Xác nhận cập nhật profile?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới profile?", () => post(data));
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
    onSuccess("Cập nhật thành công!")
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/profiles", body);
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
      const response = await apiPut("/profiles", body);
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

        <Col span={12}>
          <RHFInput
            label='Email'
            name='email'
            placeholder='Nhập Email'
            required
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Mật khẩu Email'
            // type='password'
            name='email_password'
            placeholder='Nhập mật khẩu Email'
            required
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Username Discord'
            name='discord_username'
            placeholder='Nhập username Discord'
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Mật khẩu Discord'
            name='discord_password'
            placeholder='Nhập mật khẩu Discord'
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Username X'
            name='x_username'
            placeholder='Nhập username X'
          />
        </Col>
        <Col span={12}>
          <RHFInput
            label='SĐT Telegram'
            name='telegram_phone'
            placeholder='Nhập SĐT Telegram'
          />
        </Col>

        <Col span={24}>
          <RHFTextarea
            label='Ghi chú'
            name='note'
            placeholder='Nhập ghi chú ...'
          />
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-5 mt-5 gap-10'>
          <ButtonOutline type='button' title={'Hủy'} onClick={onCloseModal} />
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>
      </Row>
    </FormProvider>

  )
}

