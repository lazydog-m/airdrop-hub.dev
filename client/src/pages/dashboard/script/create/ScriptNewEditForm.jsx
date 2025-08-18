import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import React, { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useSpinner from "@/hooks/useSpinner";
import { PATH_DASHBOARD } from "@/routes/path";
import useMessage from "@/hooks/useMessage";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // hoặc chọn style khác
import { Copy, CopyCheck, Folder, MoveDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SyntaxHighlighterCustom = ({ code }) => {
  return (
    <SyntaxHighlighter
      language="javascript"
      style={vscDarkPlus}
      className="preview-code"
      customStyle={{ fontSize: 18 }}
      wrapLines={true}
      showLineNumbers={true}
    >
      {code}
    </SyntaxHighlighter>
  )
}
const SyntaxHighlighterMemo = React.memo(SyntaxHighlighterCustom);

const MAX_LINE_PREVIEW = 10;

export default function ScriptNewEditForm({
  isEdit,
  onCloseModal,
  currentScript,
}) {

  const code = currentScript?.code || '';

  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentLines = code.split('\n');
  const shouldPreview = currentLines.length > MAX_LINE_PREVIEW;
  const previewCode = currentLines.slice(0, 10).join('\n');

  const ScriptSchema = Yup.object().shape({
    fileName: Yup.string()
      .trim().required('Tên ví không được để trống!'), // trim() an luon value
  });

  const defaultValues = {
    fileName: currentScript?.fileName || '',
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
    watch, getValues, setError, formState: { isValid }
  } = methods;

  const { showConfirm } = useConfirm();
  const { onOpen, onClose } = useSpinner();
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
      showConfirm("Xác nhận cập nhật script?", () => put(body));
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
      showConfirm("Xác nhận thêm mới script?", () => post(body));
    }
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/scripts", body);
      onSuccess("Tạo script thành công!");
      onCloseModal();
      onClose();
      navigate(PATH_DASHBOARD.script.list)
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const put = async (body) => {
    try {
      onOpen();
      const response = await apiPut("/scripts", body);
      onSuccess("Cập nhật script thành công!");
      navigate(PATH_DASHBOARD.script.list)
      onCloseModal();
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const copyTimeoutRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 3000);
  }
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='mt-5' gutter={[25, 20]} >

        <Col span={24}>
          <div className="relative">
            <RHFInput
              label='Tên file'
              name='fileName'
              placeholder='Nhập tên file'
              required
            />
          </div>

        </Col>

        <Col span={24}>
          <div className="d-flex justify-content-between">
            <label className='d-block font-inter fw-400 fs-14'>Preview Code</label>
            <Badge variant={'secondary'} className='badge-default bdr gap-6 select-none'>
              <Folder size={'15px'} />
              <span className="text-too-long-auto fs-14 fw-400">{`./script/${watch('fileName')?.trim() ? `${watch('fileName')?.trim()}.js` : ''}`}</span>
            </Badge>
          </div>

          {code ?
            <div className="font-inter fw-400 mt-10 fs-15 syntax-highlighter-container">
              <SyntaxHighlighterMemo
                code={expanded || !shouldPreview ? code : previewCode}
              />

              <div className="copy-code-icon select-none d-flex align-items-center fs-14 gap-7 font-inter fw-300" onClick={handleCopy}>
                {copied ?
                  <>
                    <CopyCheck size={'13px'} /> Đã Sao chép
                  </>
                  :
                  <>
                    <Copy size={'13px'} /> Sao chép
                  </>}
              </div>

              {(!expanded && shouldPreview) && <MoveDown className="view-more-code" size={'20px'} onClick={() => setExpanded(!expanded)} />}
            </div>
            :
            <>
              <div className='preview-code-empty mt-10'>
              </div>
              {isSubmitted && !code && <span className='font-inter color-red d-block errorColor mt-3'>Chưa có logic cho kịch bản!</span>}
            </>
          }
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-8 mt-5'>
          <ButtonPrimary
            type={(isValid && !code) ? 'button' : 'submit'}
            title={'Lưu thay đổi'}
            onClick={() =>
              setIsSubmitted(true)
            }
          />
        </Col>
      </Row>
    </FormProvider>

  )
}

