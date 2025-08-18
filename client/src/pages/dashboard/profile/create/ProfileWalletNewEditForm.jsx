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
import { apiGet, apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useNotification from "@/hooks/useNotification";
import { Checkbox } from "@/components/Checkbox";
import { Textarea } from "@/components/ui/textarea";
import useSpinner from "@/hooks/useSpinner";
import { WalletStatus } from "@/enums/enum";
import useMessage from "@/hooks/useMessage";

export default function ProfileWalletNewEditForm({ isEdit, currentProfileWallet, onUpdateData, onCloseModal, profileId }) {

  const [wallets, setWallets] = useState([]);

  const ProfileWalletSchema = Yup.object().shape({
    wallet_address: Yup.string()
      .trim().required('Địa chỉ ví không được để trống!'),
    secret_phrase: Yup.string()
      .trim().required('Cụm từ bí mật không được để trống!'),
    wallet_id: Yup.string()
      .trim().required('Ví chưa được lựa chọn!'),
  });

  const defaultValues = {
    wallet_address: currentProfileWallet?.wallet_address || '',
    secret_phrase: currentProfileWallet?.secret_phrase || '',
    wallet_id: currentProfileWallet?.wallet_id || '',
  };

  const methods = useForm({
    resolver: yupResolver(ProfileWalletSchema),
    defaultValues,
  });

  const [loading, setLoading] = useState(false);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch, getValues,
  } = methods;

  const { showConfirm } = useConfirm();
  const { onSuccess, onError } = useMessage();
  const { onOpen, onClose } = useSpinner();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        ...data,
        id: currentProfileWallet.id,
        profile_id: currentProfileWallet.profile_id,
        wallet_name: findWalletNameByWalletId(data.wallet_id),
        need_check_wallet_id: data.wallet_id !== currentProfileWallet.wallet_id, // ví chọn khác ví hiện tại
      }
      showConfirm("Xác nhận cập nhật địa chỉ ví?", () => put(body));
    }
    else {
      const body = {
        ...data,
        profile_id: profileId,
        wallet_name: findWalletNameByWalletId(data.wallet_id),
      }
      console.log(body)
      showConfirm("Xác nhận thêm mới địa chỉ ví?", () => post(body));
    }
  }

  const triggerPost = () => {
    onSuccess("Tạo địa chỉ ví thành công!");
    onCloseModal();
    onClose();
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/profile-wallets", body);
      onUpdateData(isEdit, response.data.data, triggerPost)
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const put = async (body) => {
    try {
      onOpen();
      const response = await apiPut("/profile-wallets", body);
      onSuccess("Cập nhật địa chỉ ví thành công!");
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
      const params = {
        selectedStatusItems: [WalletStatus.IN_ACTIVE],
      };

      try {
        setLoading(true);
        const response = await apiGet("/wallets/no-page", params);
        setWallets(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        onError(error.message)
        // setLoading(false);
      }
    }

    fetch();
  }, [])

  const findWalletNameByWalletId = (walletId) => {
    const findWallet = wallets.find((item) => item.id === walletId);
    return findWallet.name || 'Không tìm thấy ví!';
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='mt-5' gutter={[25, 20]} >

        <Col span={24}>
          <Controller
            name='wallet_id'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Ví
                  <span className={'required'}></span>
                </label>
                <Select
                  disabled={loading}
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Chọn ví'
                  className='mt-10'
                  items={wallets.map((item) => item.id)}
                  convertItem={findWalletNameByWalletId}
                />
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        <Col span={24}>
          <RHFInput
            label='Địa chỉ ví'
            name='wallet_address'
            placeholder='Nhập địa chỉ ví'
            required
          />
        </Col>


        <Col span={24}>
          <RHFInput
            label='Cụm từ bí mật'
            name='secret_phrase'
            placeholder='Nhập cụm từ bí mật'
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

