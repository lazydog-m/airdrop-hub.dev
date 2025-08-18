import PropTypes from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useResponsive from '../../hooks/useResponsive';
import { Layout, Menu, Drawer } from 'antd';
import './navbar-vertical-style.css'
import { Logo, LogoMobile } from '../../components/Logo';
import { PATH_DASHBOARD } from '../../routes/path';
import { CalendarCheck, CirclePlay, ChartPie, CircleUserRound, FolderDot, SquareCheck, StepForward, WalletIcon, Puzzle } from 'lucide-react';
import { Arrow } from '@radix-ui/react-popover';

NavbarVertical.propTypes = {
  isCollapse: PropTypes.bool,
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

const { Sider } = Layout;

const bgColor = '#1E1E1E';
const headerColor = '#9A9A9B';
const ff = "Inter, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

const NAVBAR_THEME = 'dark';
const NAVBAR_VERTICAL_WIDTH = 240;
const NAVBAR_VERTICAL_COLLAPSED_WIDTH = 58;

const DRAWER_WIDTH = 280;
const NAVBAR_VERTICAL_MOBILE_WIDTH = 280;

const menuStyle = {
  letterSpacing: '0.05em',
  border: 'none',
  backgroundColor: bgColor,
  fontFamily: ff,
};

const siderStyle = {
  height: '100%',
  position: 'fixed',
  padding: '0px 5px 0px 5px',
  backgroundColor: bgColor,
  zIndex: 1100,
  left: 0,
  top: 0,
};

const siderMobileStyle = {
  height: '100%',
  position: 'fixed',
  padding: '0px 5px 0px 5px',
  backgroundColor: bgColor,
  top: 0,
  left: 0
};

export default function NavbarVertical({ isCollapse, isOpenSidebar, onCloseSidebar }) {
  const { isMobile } = useResponsive();
  const { pathname } = useLocation();
  const [selectedKey, setSelectedKey] = useState('');
  const [openKeys, setOpenKeys] = useState([]);

  // useEffect(() => {
  //   if (isOpenSidebar) {
  //     document.body.style.overflowY = 'hidden';
  //   } else {
  //     document.body.style.overflowY = '';
  //   }
  // }, [isOpenSidebar])

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }

    document.body.style.overflowY = 'auto';

    if (pathname.includes('/project/list')) {
      setSelectedKey(['project']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/profile/list')) {
      setSelectedKey(['profile']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/wallet/list')) {
      setSelectedKey(['wallet']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/task')) {
      setSelectedKey(['task']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/app')) {
      setSelectedKey(['statistics']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/script')) {
      setSelectedKey(['script']);
      setOpenKeys([]);
    }
    else {
      setSelectedKey([]);
      setOpenKeys([]);
    }

  }, [pathname]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <>
      {!isMobile ?
        <Sider className={`nav-vertical`}
          trigger={null}
          collapsible
          theme={NAVBAR_THEME}
          collapsed={isCollapse}
          style={siderStyle}
          width={NAVBAR_VERTICAL_WIDTH}
          collapsedWidth={NAVBAR_VERTICAL_COLLAPSED_WIDTH}
        >
          {<Logo isCollapse={isCollapse} />}
          {group.map((item, index) => {
            return (
              <ListMenuItem
                key={item.name}
                item={item}
                index={index}
                selectedKey={selectedKey}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                isCollapse={isCollapse}
              />
            )
          })}
        </Sider>
        :
        <Drawer
          className='draw-nav-mobile'
          width={DRAWER_WIDTH}
          contentWrapperStyle={{ boxShadow: 'none' }}
          // getContainer={false}
          placement={'left'}
          closable={false}
          onClose={onCloseSidebar}
          open={isOpenSidebar}
          style={{ backgroundColor: bgColor }}
        >
          <Sider className='nav-vertical-mobile'
            trigger={null}
            collapsible
            theme={NAVBAR_THEME}
            width={NAVBAR_VERTICAL_MOBILE_WIDTH}
            style={siderMobileStyle}
          >
            <LogoMobile />
            {group.map((item, index) => {
              return (
                <ListMenuItem
                  key={item.name}
                  item={item}
                  index={index}
                  selectedKey={selectedKey}
                  openKeys={openKeys}
                  onOpenChange={handleOpenChange}
                  isCollapse={isCollapse}
                />
              )
            })}
          </Sider>
        </Drawer>
      }
    </>
  )
}

const ICONS = {
  statistics: <ChartPie size={17} />,
  project: <FolderDot size={17} />,
  profile: <CircleUserRound size={17} />,
  wallet: <WalletIcon size={17} />,
  task: <SquareCheck size={17} />,
  script: <CirclePlay size={17} />,
  extension: <Puzzle size={17} />,
}

const labelStyle = {
  fontSize: 14,
}

const SpanStyle = ({ label }) => (
  <span style={labelStyle}>{label}</span>
)

const ListMenuItem = ({ item, index, selectedKey, openKeys, onOpenChange, isCollapse }) => {
  return (
    <>
      {!isCollapse &&
        <span style={{
          marginLeft: '16px',
          display: 'block',
          marginTop: index > 0 ? '20px' : '0px',
          marginBottom: '5px',
          fontWeight: 'bold',
          // fontSize: '13.5px',
          color: headerColor,
          fontFamily: ff,
        }}
        >
          {item.name}
        </span>
      }
      <Menu style={menuStyle}
        theme="dark"
        mode="inline"
        selectedKeys={selectedKey}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={item.items}
      />
    </>
  )
}

const group = [
  {
    name: 'Menu',
    items: [
      {
        key: 'statistics',
        label: <Link to={PATH_DASHBOARD.app}>
          <SpanStyle label="Thống Kê" />
        </Link>,
        icon: ICONS.statistics,
      },
      {
        key: 'project',
        label: <Link to={PATH_DASHBOARD.project.list}>
          <SpanStyle label="Quản Lý Dự Án" />
        </Link>,
        icon: ICONS.project,
      },
      {
        key: 'profile',
        label: <Link to={PATH_DASHBOARD.profile.list}>
          <SpanStyle label="Quản Lý Hồ Sơ" />
        </Link>,
        icon: ICONS.profile,
      },
      {
        link: PATH_DASHBOARD.script,
        key: 'script',
        label: <Link to={PATH_DASHBOARD.script.list}>
          <SpanStyle label="Quản Lý Kịch Bản" />
        </Link>,
        icon: ICONS.script,
      },
      {
        key: 'wallet',
        label: <Link to={PATH_DASHBOARD.wallet.list}>
          <SpanStyle label="Quản Lý Ví" />
        </Link>,
        icon: ICONS.wallet,
      },
      {
        key: 'task',
        label: <Link to={PATH_DASHBOARD.task.list}>
          <SpanStyle label="Quản Lý Công Việc" />
        </Link>,
        icon: ICONS.task,
      },
      {
        key: 'extension',
        label: <Link to={PATH_DASHBOARD.extension.list}>
          <SpanStyle label="Quản Lý Tiện Ích" />
        </Link>,
        icon: ICONS.extension,
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

