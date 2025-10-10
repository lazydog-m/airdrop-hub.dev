import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Select from "@/components/Select";
import { ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useNotification from "@/hooks/useNotification";
import { Checkbox } from "@/components/Checkbox";
import { Textarea } from "@/components/ui/textarea";
import useSpinner from "@/hooks/useSpinner";
import useMessage from "@/hooks/useMessage";
import RHFTextarea from "@/components/hook-form/RHFTextarea";

export default function ProfileAccountNewEditForm({ onCloseModal, isEdit, currentProfile, onUpdateData }) {

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

  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const { onOpen, onClose } = useSpinner();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        ...data,
        id: currentProfile.id,
      }
      showConfirm("Xác nhận cập nhật hồ sơ?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới hồ sơ?", () => post(data));
    }
  }

  const triggerPost = () => {
    onSuccess("Tạo hồ sơ thành công!")
    onCloseModal();
    onClose();
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/profiles", body);
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
      const response = await apiPut("/profiles", body);
      onSuccess("Cập nhật hồ sơ thành công!");
      onUpdateData(isEdit, response.data.data)
      onCloseModal();
      onClose();
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

        <Col span={24} className='d-flex justify-content-end mb-5'>
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>
      </Row>
    </FormProvider>

  )
}

