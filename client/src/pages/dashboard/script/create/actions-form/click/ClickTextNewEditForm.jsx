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
import { parseTimeout, textTrim } from "@/utils/convertUtil";

export default function ClickTextNewEditForm({
  id,
  formData,
  buildCode = () => { },
  onUpdateLogic = () => { },
}) {

  const defaultValues = {
    timeout: formData?.timeout || '',
    text: formData?.text || '',
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
    const { timeout, text } = data;

    const parsedTimeout = parseTimeout(timeout);

    const updated = {
      id,
      code: buildCode({ timeout: parsedTimeout, text }),
      formData: {
        timeout: parsedTimeout,
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
            type='number'
            step={STEP_DEFAULT_TIMEOUT}
            min="0"
            // max="9999999999999999"
            label='Timeout'
            name='timeout'
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

