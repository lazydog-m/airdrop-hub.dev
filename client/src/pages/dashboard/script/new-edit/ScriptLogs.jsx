import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import React, { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
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
import Select from "@/components/Select";
import { Color, NOT_AVAILABLE } from "@/enums/enum";
import { Separator } from "@/components/ui/separator";

export default function ScriptLogs({
  logs = []
}) {

  // lam sao de biet log dag action gi ?? chi tiet hon, button view wmore log ? bam vao log nao thif biey doc log do dag o dau trong list, mof form
  return (
    <div className="logs-container font-inter fs-14">
      {logs.map((log, index) => {
        return (
          <>
            <div className="logs d-flex align-items-center" key={index}>
              <span className="log-item log-time">{log.time}</span>

              <span
                className="log-item log-action fw-500 d-flex"
                style={{ color: Color.PRIMARY }}
              >
                {log.action}
              </span>

              <span className="log-item">|</span>

              <span className="log-item log-duration">{`${log.duration} ms`}</span>
              <span
                className="log-item log-status fw-500"
                style={{ color: log.status === 'Success' ? Color.SUCCESS : Color.ORANGE }}
              >
                {`[${log.status}]`}
              </span>
            </div>

            {log?.message &&
              <>
                <span className="log-item log-message" style={{ color: Color.ORANGE }}>{log?.message}</span>
              </>
            }
          </>
        )
      })}
    </div>

  )
}

