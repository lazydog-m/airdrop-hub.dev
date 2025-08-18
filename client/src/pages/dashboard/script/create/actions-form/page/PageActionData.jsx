import { SIZE_ICON_ACTION, TIMEOUT_DIVIDE_INTO_SECOND, TIMEOUT_SCRIPT } from "@/enums/enum";
import { Clock, Globe, ShieldCheck } from "lucide-react";
import GotoUrlNewEditForm from "./GotoUrlNewEditForm";

const getCodeGotoUrl = ({ timeout = TIMEOUT_SCRIPT, url = '' }) => {
  const lines = [];

  if (timeout !== 0) {
    lines.push(`await page.waitForTimeout(${timeout});`);
  }

  lines.push(`await page.goto("${url.trim()}");`);
  lines.push(`await page.waitForLoadState('networkidle');`);

  return lines.join('\n');
};

const getPlaceholderGotoUrl = ({ timeout = TIMEOUT_SCRIPT, url = '' }) => {
  const parts = [];

  if (timeout !== 0) {
    parts.push(`${timeout / TIMEOUT_DIVIDE_INTO_SECOND}s`);
  }

  if (url.trim() !== '') {
    parts.push(`'${url.trim()}'`);
  }

  if (parts.length === 0) return '';

  return `// ${parts.join(' => ')}`;
};

export const PAGE_ACTION_DATA = [
  {
    label: 'Page Context',
    children: [
      {
        type: 'goto-url',
        name: 'Goto URL',
        logicName: 'Goto URL',
        icon: <Globe size={SIZE_ICON_ACTION} />,
        formComponent: GotoUrlNewEditForm,
        formData: {
          timeout: TIMEOUT_SCRIPT,
          url: '',
        },
        placeholder: ({ formData }) => getPlaceholderGotoUrl({
          timeout: formData.timeout,
          url: formData.url,
        }),
        code: getCodeGotoUrl({}),
        buildCode: getCodeGotoUrl,
      },
      {
        id: 'wait-timeout',
        name: 'Wait Timeout',
        logicName: 'Wait Timeout',
        icon: <Clock size={SIZE_ICON_ACTION} />,
      },
      {
        id: 'wait-verify-capcha',
        name: 'Wait Verify Capcha',
        logicName: 'Wait Verify Capcha',
        icon: <ShieldCheck size={SIZE_ICON_ACTION} />,
      },
    ]
  },
  // {
  //   key: 'Wallet',
  //   label: 'Wallet',
  //   children: [
  //     {
  //       name: 'Connect MetaMask',
  //       fullName: 'Click Text',
  //       icon: <Wallet size={SIZE_ICON_ACTION} />,
  //     },
  //     {
  //       name: 'Connect Backpack',
  //       icon: <Wallet size={SIZE_ICON_ACTION} />,
  //     },
  //     {
  //       name: 'Connect Phantom',
  //       icon: <Wallet size={SIZE_ICON_ACTION} />,
  //     },
  //     {
  //       name: 'Connect SUI',
  //       icon: <Wallet size={SIZE_ICON_ACTION} />,
  //     },
  //   ].map((item) => {
  //     return (
  //       <ActionChildrenItem item={item} key={item.name} />
  //     )
  //   }),
  // },
  // {
  //   key: 'Fill Input',
  //   label: 'Fill Input',
  //   children: [
  //     {
  //       name: 'Fill Input',
  //       icon: <Type size={SIZE_ICON_ACTION} />,
  //     },
  //   ].map((item) => {
  //     return (
  //       <ActionChildrenItem item={item} key={item.name} />
  //     )
  //   }),
  // },
];
