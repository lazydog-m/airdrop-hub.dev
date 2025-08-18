import { SIZE_ICON_ACTION, TIMEOUT_DIVIDE_INTO_SECOND, TIMEOUT_SCRIPT } from "@/enums/enum";
import { Clock, Globe, MousePointerClick, ShieldCheck } from "lucide-react";
import ClickTextNewEditForm from "./ClickTextNewEditForm";

const getCodeClickText = ({ timeout = TIMEOUT_SCRIPT, text = '' }) => {
  const lines = [];

  if (timeout !== 0) {
    lines.push(`await page.waitForTimeout(${timeout});`);
  }

  lines.push(`await page.click('text=${text.trim()}');`);

  return lines.join('\n');
};

const getPlaceholderClickText = ({ timeout = TIMEOUT_SCRIPT, text = '' }) => {
  const parts = [];

  if (timeout !== 0) {
    parts.push(`${timeout / TIMEOUT_DIVIDE_INTO_SECOND}s`);
  }

  if (text.trim() !== '') {
    parts.push(`'${text.trim()}'`);
  }

  if (parts.length === 0) return '';

  return `// ${parts.join(' => ')}`;
};

export const CLICK_ACTION_DATA = [
  {
    label: 'Click',
    children: [
      {
        type: 'click-text',
        name: 'Text',
        logicName: 'Click Text',
        icon: <MousePointerClick size={SIZE_ICON_ACTION} />,
        formComponent: ClickTextNewEditForm,
        formData: {
          timeout: TIMEOUT_SCRIPT,
          text: '',
        },
        placeholder: ({ formData }) => getPlaceholderClickText({
          timeout: formData.timeout,
          text: formData.text,
        }),
        code: getCodeClickText({}),
        buildCode: getCodeClickText,
      },
    ]
  },
];
