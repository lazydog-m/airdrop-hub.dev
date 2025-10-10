import { GotoUrl } from "./goto-url/GotoUrl";

export const BROWSER = [
  {
    label: 'Browser',
    children: [
      GotoUrl,
      // {
      //   id: 'wait-timeout',
      //   name: 'Wait Timeout',
      //   icon: <Clock size={SIZE_ICON_ACTION} />,
      // },
      // {
      //   id: 'wait-verify-capcha',
      //   name: 'Wait Verify Capcha',
      //   icon: <ShieldCheck size={SIZE_ICON_ACTION} />,
      // },
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
