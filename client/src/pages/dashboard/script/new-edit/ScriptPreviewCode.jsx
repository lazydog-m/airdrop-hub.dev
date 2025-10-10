import React, { useState, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // hoặc chọn style khác
import { Code, Copy, CopyCheck, } from "lucide-react";
import { ButtonOutline } from '@/components/Button';

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

const MAX_LINE_PREVIEW = 22;

export default function ScriptPreviewCode({
  currentScript,
}) {

  const code = currentScript?.code || '';

  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentLines = code.split('\n');
  const shouldPreview = currentLines.length > MAX_LINE_PREVIEW;
  const previewCode = currentLines.slice(0, MAX_LINE_PREVIEW).join('\n');

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
    <div className="font-inter fw-400 fs-15 preview-code-container">
      <div className="font-inter fw-400 fs-15">
        <SyntaxHighlighterMemo
          code={expanded || !shouldPreview ? code : previewCode}
        />
      </div>

      <div className='d-flex justify-content-end gap-10 mt-20 pt-1 pb-1'>
        {(!expanded && shouldPreview) &&
          <ButtonOutline
            title={
              'Xem thêm'
            }
            icon={<Code />}
            onClick={() => setExpanded(!expanded)}
          />
        }
        <ButtonOutline
          title={
            copied ?
              <>
                <CopyCheck size={'13px'} /> Đã Sao chép
              </>
              :
              <>
                <Copy size={'13px'} /> Sao chép
              </>
          }
          onClick={handleCopy}
        />
      </div>
    </div>
  )
}

