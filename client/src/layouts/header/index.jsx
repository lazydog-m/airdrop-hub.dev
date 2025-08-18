import PropTypes from 'prop-types';
import CollapseButton from './CollapseButton';
import { Layout } from 'antd';
import './header-style.css'
import useCollapse from '../../hooks/useCollapse';
import NotificationPopover from './NotificationPopover';
import AccountPopover from './AccountPopover';
import SearchCommand from './SearchCommand';

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
}

const { Header } = Layout;

export default function DashboardHeader({ onOpenSidebar, isCollapse }) {
  const { onToggleCollapse } = useCollapse();

  return (
    <Header
      className='header-container bg-color d-flex justify-content-between p-0 align-items-center'
      style={{ width: '100%' }}
    >
      <div className='header-left d-flex align-items-center'>
        <CollapseButton
          isCollapse={isCollapse}
          onToggleCollapse={onToggleCollapse}
          onOpenSidebar={onOpenSidebar}
        />
        {/*
        <SearchCommand />
*/}
      </div>
      <div className='header-right d-flex pe-18 gap-22'>
        <NotificationPopover />
        <AccountPopover />
      </div>
    </Header>
  )
}

