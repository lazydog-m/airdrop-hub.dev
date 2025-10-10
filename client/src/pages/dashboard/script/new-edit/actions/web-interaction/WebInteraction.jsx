import { DELAY_TIME_SCRIPT, SIZE_ICON_ACTION, TIMEOUT_DIVIDE, TIMEOUT_SCRIPT } from "@/enums/enum";
import { Clock, Globe, MousePointerClick, ShieldCheck } from "lucide-react";
import ClickTextNewEditForm from "./ClickTextNewEditForm";

const getCodeClickText = ({
  delayTime = DELAY_TIME_SCRIPT,
  text = ''
}) => {
  const lines = [];

  if (delayTime !== 0) {
    lines.push(`await page.waitForTimeout(${delayTime});`);
  }

  lines.push(`await page.click('text=${text}');`);

  return lines.join('\n');
};

const getPlaceholderClickText = ({
  delayTime = DELAY_TIME_SCRIPT,
  text = ''
}) => {
  const parts = [];

  if (delayTime !== 0) {
    parts.push(`${delayTime / TIMEOUT_DIVIDE}s`);
  }

  if (text !== '') {
    parts.push(`'${text}'`);
  }

  if (parts.length === 0) return '';

  return `// ${parts.join(' => ')}`;
};

export const WEB_INTERACTION = [
  {
    label: 'Web Interaction',
    children: [
      {
        type: 'click-text',
        name: 'Click Text',
        icon: <MousePointerClick size={SIZE_ICON_ACTION} />,
        formComponent: ClickTextNewEditForm,
        formData: {
          description: '',
          delay_time: DELAY_TIME_SCRIPT,
          text: '',
          timeout: TIMEOUT_SCRIPT,
        },
        placeholder: getPlaceholderClickText,
        code: ``,
        buildCode: getCodeClickText,
      },
      // {
      //   type: 'click-button-text',
      //   name: 'Click Button Text',
      //   icon: <MousePointerClick size={SIZE_ICON_ACTION} />,
      //   formComponent: ClickTextNewEditForm,
      //   formData: {
      //     description: '',
      //     delay_time: DELAY_TIME_SCRIPT,
      //     text: '',
      //     timeout: TIMEOUT_SCRIPT,
      //   },
      //   placeholder: ({ formData }) => getPlaceholderClickText({
      //     delay_time: formData.delay_time,
      //     text: formData.text,
      //     timeout: formData.timeout,
      //   }),
      //   code: getCodeClickText({}),
      //   buildCode: getCodeClickText,
      // },
    ]
  },
];
