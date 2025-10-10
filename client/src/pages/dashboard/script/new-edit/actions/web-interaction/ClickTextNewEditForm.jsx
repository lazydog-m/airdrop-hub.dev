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
import { STEP_DEFAULT_TIMEOUT } from "@/enums/enum";
import { parseNumber, textTrim } from "@/utils/convertUtil";

export default function ClickTextNewEditForm({
  id,
  formData,
  action,
  buildCode = () => { },
  onUpdateLogic = () => { },
}) {

  const defaultValues = {
    description: formData?.description || '',
    delayTime: formData?.delayTime || '',
    text: formData?.text || '',
    timeout: formData?.timeout || '',
  };

  const methods = useForm({
    // resolver: yupResolver(GotuUrlSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch, getValues,
  } = methods;

  const onSubmit = (data) => {
    const { delayTime, text, description, timeout } = data;

    const parsedTimeout = parseNumber(delayTime);

    const updated = {
      id,
      code: buildCode({
        description: textTrim(description),
        delayTime: parsedTimeout,
        text: textTrim(text),
        action,
      }),
      formData: {
        description: textTrim(description),
        delayTime: parsedTimeout,
        text: textTrim(text),
      }
    }
    onUpdateLogic(updated)
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[25, 20]} >

        <Col span={24}>
          <RHFInput
            label='Mô tả'
            name='description'
            placeholder='Nhập mô tả ...'
          />
        </Col>

        <Col span={24}>
          <RHFInput
            type='number'
            step={STEP_DEFAULT_TIMEOUT}
            min="0"
            // max="9999999999999999"
            label='Delay time (millisecond)'
            name='delayTime'
            placeholder='0'
          />
        </Col>

        <Col span={24}>
          <RHFInput
            label='Text'
            name='text'
            placeholder='Nhập text'
          />
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-5'>
          <ButtonPrimary type='submit' title={'Lưu'} />
        </Col>
      </Row>
    </FormProvider>
  )
}

