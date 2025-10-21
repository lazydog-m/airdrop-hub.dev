import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useResponsive from '../../hooks/useResponsive';
import { Layout, Menu, Drawer } from 'antd';
import './navbar-vertical-style.css'
import { PATH_DASHBOARD } from '../../routes/path';
import { CirclePlay, ChartPie, CircleUserRound, FolderDot, SquareCheck, Puzzle, Cat, Trash2, Panda, Ghost, Rabbit } from 'lucide-react';
import logo from '../../assets/img/playwright.png'
import { BASE_NAME } from '@/config';

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

const HeaderNavbar = ({ isCollapse }) => {
  if (!isCollapse) {
    return (
      <div className='d-flex align-items-center p-11 mb-16 mt-4'>
        <Link to={PATH_DASHBOARD.app} className='d-flex align-items-center gap-10 select-none'>
          <img src={logo} style={{ width: "40px", backgroundColor: '#323230', borderRadius: '8px', padding: '2px' }} />
          <span className='font-inter color-white fw-600 fs-23'>{BASE_NAME}</span>
        </Link>
      </div>
    )
  }

  return (
    <div className='d-flex align-items-center p-6 mb-5 mt-8'>
      <Link to={PATH_DASHBOARD.app}>
        <div className='select-none'>
          <img src={logo} style={{ width: "100%", backgroundColor: '#323230', borderRadius: '8px', padding: '2px' }} />
        </div>
      </Link>
    </div>
  )
}

export default function NavbarVertical({ isCollapse, isOpenSidebar, onCloseSidebar }) {
  const { isMobile } = useResponsive();
  const { pathname } = useLocation();
  const [selectedKey, setSelectedKey] = useState('');
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }

    if (pathname.includes('/project/list')) {
      setSelectedKey(['project']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/profile/list')) {
      setSelectedKey(['profile']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/web3-wallet/list')) {
      setSelectedKey(['web3-wallet']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/extension/list')) {
      setSelectedKey(['extension']);
      setOpenKeys([]);
    }
    // else if (pathname.includes('/task')) {
    //   setSelectedKey(['task']);
    //   setOpenKeys([]);
    // }
    else if (pathname.includes('/app')) {
      setSelectedKey(['statistics']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/script')) {
      setSelectedKey(['script']);
      setOpenKeys([]);
    }
    else if (pathname.includes('/trash')) {
      setSelectedKey(['trash']);
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
          {<HeaderNavbar isCollapse={isCollapse} />}
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
            {<HeaderNavbar isCollapse={false} />}
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
  statistics: <ChartPie size={18} />,
  project: <FolderDot size={18} />,
  profile: <CircleUserRound size={18} />,
  wallet: <Panda size={18} />,
  task: <SquareCheck size={17} />,
  script: <CirclePlay size={18} />,
  extension: <Puzzle size={18} />,
  trash: <Trash2 size={18} style={{ marginTop: '-3px' }} />,
  web3_wallet: <Rabbit size={18} />,
}

const labelStyle = {
  fontSize: 14,
}

const SpanStyle = ({ label, ...other }) => (
  <span style={labelStyle} {...other}>{label}</span>
)

const ListMenuItem = ({ item, index, selectedKey, openKeys, onOpenChange, isCollapse }) => {
  return (
    <>
      {!isCollapse &&
        <span style={{
          marginLeft: '15px',
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
          <SpanStyle label="Dự Án" />
        </Link>,
        icon: ICONS.project,
      },
      {
        key: 'profile',
        label: <Link to={PATH_DASHBOARD.profile.list}>
          <SpanStyle label="Profiles" />
        </Link>,
        icon: ICONS.profile,
      },
      {
        link: PATH_DASHBOARD.script,
        key: 'script',
        label: <Link to={PATH_DASHBOARD.script.list}>
          <SpanStyle label="Scripts" />
        </Link>,
        icon: ICONS.script,
      },
      {
        key: 'web3-wallet',
        label: <Link to={PATH_DASHBOARD.web3_wallet.list}>
          <SpanStyle className='d-block' label="Ví Web3" />
        </Link>,
        icon: ICONS.web3_wallet,
      },
      {
        key: 'extension',
        label: <Link to={PATH_DASHBOARD.extension.list}>
          <SpanStyle label="Extensions" />
        </Link>,
        icon: ICONS.extension,
      },
      {
        key: 'trash',
        label: <Link to={PATH_DASHBOARD.extension.list}>
          <SpanStyle label="Thùng rác" />
        </Link>,
        icon: ICONS.trash,
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

