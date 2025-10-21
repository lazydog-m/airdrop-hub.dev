import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import { useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import { PATH_DASHBOARD } from "@/routes/path";
import useMessage from "@/hooks/useMessage";
import RHFTextarea from "@/components/hook-form/RHFTextarea";
import { delayApi } from "@/utils/commonUtil";

export default function ScriptNewEditForm({
  isEdit,
  onChangeScriptName,
  currentScript,
}) {

  const code = currentScript?.code;

  const ScriptSchema = Yup.object().shape({
    fileName: Yup.string()
      .trim().required('Tên script không được để trống!'), // trim() an luon value
  });

  const defaultValues = {
    fileName: currentScript?.fileName || '',
    description: currentScript?.description || '',
  };

  const methods = useForm({
    resolver: yupResolver(ScriptSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch, getValues, setError, formState: { isValid, errors }
  } = methods;

  const { showConfirm, onCloseLoader, isLoader } = useConfirm();
  const { onSuccess, onError } = useMessage();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        oldFileName: currentScript?.fileName,
        ...data,
        code,
        logicItems: currentScript?.logicItems?.map((item) => {
          return {
            type: item.type,
            id: item.id,
            formData: item.formData,
          }
        }),
      }
      console.log(body)
      showConfirm("Xác nhận cập nhật script?", () => put(body), '', () => trigger());
    }
    else {
      const body = {
        ...data,
        code,
        logicItems: currentScript?.logicItems?.map((item) => {
          return {
            type: item.type,
            id: item.id,
            formData: item.formData,
          }
        }),

      }
      console.log(body)
      showConfirm("Xác nhận tạo script?", () => post(body), '', () => trigger());
    }
  }

  const trigger = () => {
    navigate(PATH_DASHBOARD.script.list)
  }

  const post = async (body) => {
    try {
      const response = await apiPost("/scripts", body);

      delayApi(() => {
        onCloseLoader();
        onSuccess("Tạo mới thành công!");
      })
    } catch (error) {
      console.error(error);
      onError(error.message);
      onCloseLoader();
    }
  }

  const put = async (body) => {
    try {
      const response = await apiPut("/scripts", body);
      delayApi(() => {
        onCloseLoader();
        onSuccess("Tạo mới thành công!");
      })
    } catch (error) {
      console.error(error);
      onError(error.message);
      onCloseLoader();
    }
  }
  useEffect(() => {
    onChangeScriptName(watch('fileName'))
  }, [watch('fileName')]);

  useEffect(() => {
    reset(defaultValues)
  }, [isEdit, currentScript]);

  // useEffect(() => {
  //   if (Object.keys(errors).length > 0) {
  //     onOpenScript(true);
  //   }
  // }, [errors]);

  return (
    <FormProvider id="scriptForm" methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[25, 20]} >

        <Col span={24}>
          <div className="relative">
            <RHFInput
              label='Tên script'
              name='fileName'
              placeholder='Nhập tên script'
              required
            />
          </div>
        </Col>

        <Col span={24}>
          <RHFTextarea
            label='Mô tả'
            name='description'
            placeholder='Nhập mô tả ...'
          />
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-5 mt-5'>
          <ButtonPrimary
            type={'submit'}
            title={'Lưu thay đổi'}
          />
        </Col>
      </Row>
    </FormProvider>

  )
}

