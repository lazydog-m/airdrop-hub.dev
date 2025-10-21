import { PATH_DASHBOARD } from "@/routes/path"
import { ChartPie, StepForward, CircleUserRound, FolderDot, SquareCheck, WalletIcon } from "lucide-react"
import { Link } from "react-router-dom"


const ICONS = {
  statistics: <ChartPie size={17} />,
  project: <FolderDot size={17} />,
  profile: <CircleUserRound size={17} />,
  wallet: <WalletIcon size={17} />,
  task: <SquareCheck size={17} />,
  script_auto: <StepForward size={17} />,
}

const labelStyle = {
  fontSize: 14,
}

const SpanStyle = ({ label }) => (
  <span style={labelStyle}>{label}</span>
)

export const group = [
  {
    name: 'Menu',
    items: [
      {
        link: PATH_DASHBOARD.app,
        key: 'statistics',
        label: <Link to={PATH_DASHBOARD.app}>
          <SpanStyle label="Thống Kê" />
        </Link>,
        icon: ICONS.statistics,
      },
      {
        link: PATH_DASHBOARD.project,
        key: 'project',
        label: <Link to={PATH_DASHBOARD.project.list}>
          <SpanStyle label="Quản Lý Dự Án" />
        </Link>,
        icon: ICONS.project,
      },
      {
        link: PATH_DASHBOARD.profile,
        key: 'profile',
        label: <Link to={PATH_DASHBOARD.profile.list}>
          <SpanStyle label="Quản Lý Hồ Sơ" />
        </Link>,
        icon: ICONS.profile,
      },
      {
        link: PATH_DASHBOARD.wallet,
        key: 'wallet',
        label: <Link to={PATH_DASHBOARD.web3_wallet.list}>
          <SpanStyle label="Quản Lý Ví" />
        </Link>,
        icon: ICONS.wallet,
      },
      {
        link: PATH_DASHBOARD.task,
        key: 'task',
        label: <Link to={PATH_DASHBOARD.task.list}>
          <SpanStyle label="Quản Lý Công Việc" />
        </Link>,
        icon: ICONS.task,
      },
      // {
      //   key: 'account',
      //   label: <SpanStyle label='Tài khoản' />,
      //   icon: ICONS.account,
      //   children: [
      //     {
      //       key: 'customer',
      //       label:
      //         <Link to={DUONG_DAN_TRANG.khach_hang.danh_sach}>
      //           <SpanStyle label='Khách hàng' />
      //         </Link>
      //     },
      //     {
      //       key: 'employee',
      //       label:
      //         <Link to={DUONG_DAN_TRANG.nhan_vien.danh_sach}>
      //           <SpanStyle label='Nhân viên' />
      //         </Link>
      //     },
      //   ],
      // },
    ]
  },

  // {
  //   name: 'App',
  //   items: [
  //     {
  //       key: 'statistics',
  //       label: <Link to={DUONG_DAN_TRANG.thong_ke}>
  //         <SpanStyle label="Dashboard" />
  //       </Link>,
  //       icon: ICONS.statistics,
  //     },
  //     {
  //       key: 'bill',
  //       label: <Link to={DUONG_DAN_TRANG.san_pham.mau_sac}>
  //         <SpanStyle label="Task" />
  //       </Link>,
  //       icon: ICONS.bill,
  //     },
  //   ]
  // }
]
