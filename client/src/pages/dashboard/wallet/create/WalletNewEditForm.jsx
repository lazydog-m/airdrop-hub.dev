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
import { PATH_DASHBOARD } from "@/routes/path";
import useMessage from "@/hooks/useMessage";

export default function WalletNewEditForm({ onCloseModal, isEdit, currentWallet, onUpdateData }) {

  const WalletSchema = Yup.object().shape({
    name: Yup.string()
      .trim().required('Tên ví không được để trống!'),
    password: Yup.string()
      .trim().required('Mật khẩu ví không được để trống!'),
  });

  const defaultValues = {
    name: currentWallet?.name || '',
    password: currentWallet?.password || '',
  };

  const methods = useForm({
    resolver: yupResolver(WalletSchema),
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
    if (isEdit) {
      const body = {
        ...data,
        id: currentWallet.id,
      }
      showConfirm("Xác nhận cập nhật ví?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới ví?", () => post(data));
    }
  }

  const triggerPost = () => {
    onSuccess("Thêm mới ví thành công!")
    onCloseModal();
    onClose();
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/wallets", body);
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
      const response = await apiPut("/wallets", body);
      onSuccess("Cập nhật ví thành công!");
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

        <Col span={24}>
          <RHFInput
            label='Tên ví'
            name='name'
            placeholder='Nhập tên ví'
            required
          />
        </Col>

        <Col span={24}>
          <RHFInput
            label='Mật khẩu ví'
            name='password'
            placeholder='Nhập mật khẩu ví'
            required
          />
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-5 mt-5'>
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>
      </Row>
    </FormProvider>

  )
}

