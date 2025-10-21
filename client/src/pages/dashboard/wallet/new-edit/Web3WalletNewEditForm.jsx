import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { ButtonOutline, ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useSpinner from "@/hooks/useSpinner";
import useMessage from "@/hooks/useMessage";
import Combobox from "@/components/Combobox";
import { RESOURCES } from "@/commons/Resources";

export default function Web3WalletNewEditForm({ onCloseModal, isEdit, currentWallet, onUpdateData }) {

  const WalletSchema = Yup.object().shape({
    name: Yup.string()
      .trim().required('Tên ví không được để trống!'),
    password: Yup.string()
      .trim().required('Mật khẩu ví không được để trống!'),
  });

  const defaultValues = {
    name: currentWallet?.name || '',
    password: currentWallet?.password || '',
    url: currentWallet?.url || '',
    resource_id: currentWallet?.resource_id || '',
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

  const { onSuccess, onError } = useMessage();
  const { showConfirm, onCloseLoader } = useConfirm();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        ...data,
        id: currentWallet.id,
      }
      showConfirm("Xác nhận cập nhật ví Web3?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới ví Web3?", () => post(data));
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
    onSuccess("Cập nhật thành công!");
  }

  const post = async (body) => {
    try {
      const response = await apiPost("/web3-wallets", body);
      onUpdateData(triggerPost);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onCloseLoader();
    }
  }

  const put = async (body) => {
    try {
      const response = await apiPut("/web3-wallets", body);
      onUpdateData(triggerPut);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onCloseLoader();
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

        <Col span={24}>
          <RHFInput
            label='Link'
            name='url'
            placeholder='chrome-extension://aflkmfhebedbjioipglgcbcmnbpgliof/popup.html'
          />
        </Col>

        <Col span={24}>
          <Controller
            name='resource_id'
            control={control}
            render={({ field }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Resource id
                </label>
                <Combobox
                  value={field.value}
                  items={RESOURCES?.filter(res => res?.type)?.map(item => item?.id)}
                  placeholder='Chọn resource id'
                  placeholderSearch="resource id"
                  onChange={(value) => field.onChange(value)}
                  capitalize={false}
                />
              </>
            )}
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

