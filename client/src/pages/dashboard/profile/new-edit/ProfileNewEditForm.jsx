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
import useMessage from "@/hooks/useMessage";
import RHFTextarea from "@/components/hook-form/RHFTextarea";
import { IdCard } from "lucide-react";
import { RESOURCES } from "@/commons/Resources";

export default function ProfileNewEditForm({ onCloseModal, isEdit, currentProfile, onUpdateData }) {

  const ProfileSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ!')
      .trim().lowercase().required('Email không được để trống!'),
    email_password: Yup.string()
      .trim().required('Mật khẩu email không được để trống!'),
    discord_email: Yup.string().trim().lowercase().email('Email không hợp lệ!'),
    x_email: Yup.string().trim().lowercase().email('Email không hợp lệ!'),
    telegram_email: Yup.string().trim().lowercase().email('Email không hợp lệ!'),
  });

  const defaultValues = {
    email: currentProfile?.email || '',
    email_password: currentProfile?.email_password || '',
    discord_email: currentProfile?.discord_email || '',
    discord_email_password: currentProfile?.discord_email_password || '',
    discord_password: currentProfile?.discord_password || '',
    discord_username: currentProfile?.discord_username || '',
    x_email: currentProfile?.x_email || '',
    x_email_password: currentProfile?.x_email_password || '',
    x_username: currentProfile?.x_username || '',
    telegram_email: currentProfile?.telegram_email || '',
    telegram_email_password: currentProfile?.telegram_email_password || '',
    telegram_phone: currentProfile?.telegram_phone || '',
    telegram_username: currentProfile?.telegram_username || '',
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

  const { showConfirm, onCloseLoader } = useConfirm();

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
    onCloseLoader();
    onSuccess("Thêm mới thành công!")
  }

  const triggerPut = () => {
    onCloseModal();
    onCloseLoader();
    onSuccess("Cập nhật thành công!")
  }

  const post = async (body) => {
    try {
      const response = await apiPost("/profiles", body);
      onUpdateData(triggerPost);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onCloseLoader();
    }
  }

  const put = async (body) => {
    try {
      const response = await apiPut("/profiles", body);
      onUpdateData(triggerPut);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onCloseLoader();
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='mt-0' gutter={[25, 20]} align='stretch'>

        <Col span={12}>
          <div className='border-1 pdi-20 pt-4.5 pb-6 pd bg-color h-full'>
            <span className="fw-500 fs-18 font-inter d-flex gap-8">
              <span className="mt-1">
                {google?.icon}
              </span>
              Tài khoản {google?.title}
            </span>
            <Row className='mt-15' gutter={[25, 20]}>
              <Col span={24}>
                <RHFInput
                  label='Email'
                  name='email'
                  placeholder='Nhập email'
                  required
                />
              </Col>
              <Col span={24}>
                <RHFInput
                  label='Mật khẩu email'
                  // type='password'
                  name='email_password'
                  placeholder='Nhập mật khẩu email'
                  required
                />
              </Col>

              <Col span={24}>
                <RHFTextarea
                  mt=""
                  name='note'
                  placeholder='Ghi chú ...'
                  height="40px"
                />
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={12}>
          <div className='border-1 pdi-20 pt-4.5 pb-6 pd bg-color h-full'>
            <span className="fw-500 fs-18 font-inter d-flex gap-8">
              <span className="mt-1">
                {discord?.icon}
              </span>
              Tài khoản {discord?.title}
            </span>
            <Row className='mt-15' gutter={[25, 20]}>
              <Col span={12}>
                <RHFInput
                  label='Email'
                  name='discord_email'
                  placeholder='Nhập email'
                />
              </Col>
              <Col span={12}>
                <RHFInput
                  label='Mật khẩu email'
                  name='discord_email_password'
                  placeholder='Nhập mật khẩu email'
                />
              </Col>

              <Col span={12}>
                <RHFInput
                  label='Username discord'
                  name='discord_username'
                  placeholder='Nhập username discord'
                />
              </Col>
              <Col span={12}>
                <RHFInput
                  label='Mật khẩu discord'
                  name='discord_password'
                  placeholder='Nhập mật khẩu discord'
                />
              </Col>
              <Col span={24}>
                <RHFTextarea
                  mt=""
                  name='note'
                  placeholder='Ghi chú ...'
                  height="40px"
                />
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={12}>
          <div className='border-1 pdi-20 pt-4.5 pb-6 pd bg-color h-full'>
            <div className="d-flex items-center justify-between">
              <span className="fw-500 fs-18 font-inter d-flex gap-8">
                <span className="mt-1">
                  {x?.icon}
                </span>

                Tài khoản {x?.title} (Twitter)
              </span>
              <IdCard size={'27px'} />
            </div>
            <Row className='mt-15' gutter={[25, 20]}>
              <Col span={12}>
                <RHFInput
                  label='Email'
                  name='x_email'
                  placeholder='Nhập email'
                />
              </Col>
              <Col span={12}>
                <RHFInput
                  label='Mật khẩu email'
                  name='x_email_password'
                  placeholder='Nhập mật khẩu email'
                />
              </Col>

              <Col span={24}>
                <RHFInput
                  label='Username twitter'
                  name='x_username'
                  placeholder='Nhập username twitter'
                />
              </Col>
              <Col span={24}>
                <RHFTextarea
                  mt=""
                  name='note'
                  placeholder='Ghi chú ...'
                  height="40px"
                />
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={12}>
          <div className='border-1 pdi-20 pt-4.5 pb-6 pd bg-color h-full'>
            <span className="fw-500 fs-18 font-inter d-flex gap-8">
              <span className="mt-1">
                {telegram?.icon}
              </span>

              Tài khoản {telegram?.title}
            </span>
            <Row className='mt-15' gutter={[25, 20]}>
              <Col span={12}>
                <RHFInput
                  label='Email'
                  name='telegram_email'
                  placeholder='Nhập email'
                />
              </Col>
              <Col span={12}>
                <RHFInput
                  label='Mật khẩu email'
                  name='telegram_email_password'
                  placeholder='Nhập mật khẩu email'
                />
              </Col>

              <Col span={12}>
                <RHFInput
                  label='Username telegram'
                  name='telegram_username'
                  placeholder='Nhập username telegram'
                />
              </Col>

              <Col span={12}>
                <RHFInput
                  label='SĐT telegram'
                  name='telegram_phone'
                  placeholder='Nhập SĐT telegram'
                />
              </Col>
              <Col span={24}>
                <RHFTextarea
                  mt=""
                  name='note'
                  placeholder='Ghi chú ...'
                  height="40px"
                />
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-5 mt-5 gap-10'>
          <ButtonOutline type='button' title={'Hủy'} onClick={onCloseModal} />
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>
      </Row>
    </FormProvider>

  )
}

const discord = RESOURCES.find(res => res?.id === 'discord');
const x = RESOURCES.find(res => res?.id === 'x');
const google = RESOURCES.find(res => res?.id === 'google');
const telegram = RESOURCES.find(res => res?.id === 'telegram');
