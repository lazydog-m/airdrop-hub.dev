import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';
import Popover from '@/components/Popover';

const NotiItems = () => {
  return (
    <div className='noti-popover'>

      <div className='noti-header d-flex justify-content-between align-items-center'>
        <span className='font-inter fw-bold fs-13 color-white'>Notifications</span>
        <span className='font-inter fs-12 fw-bold color-white text-underline'>View all</span>
      </div>

      <div className='noti-menu'>

        <div className='noti-group-menu-item'>

          <Link>
            <div className='noti-item'>
              <div className='noti-info'>
                <span className='noti-name font-inter color-white fs-13 d-block'>Has notification from Saraha AI!</span>
                <div className='noti-message d-flex justify-content-between color-white fw-300 font-inter fs-12'>
                  <span className='text-ellipsis'>Please mint NTF today 123123!</span>
                  <Badge status="success" />
                </div>
                <span className='noti-date d-flex justify-content-end color-white font-inter fs-12'>2 day ago</span>
              </div>
            </div>
          </Link>

          <Link>
            <div className='noti-item'>
              <div className='noti-info'>
                <span className='noti-name font-inter color-white fs-13 d-block'>Has notification from Saraha AI!</span>
                <div className='noti-message d-flex justify-content-between color-white fw-300 font-inter fs-12'>
                  <span className='text-ellipsis'>Please mint NTF today 123123!</span>
                  <Badge status="success" />
                </div>
                <span className='noti-message d-flex justify-content-end color-white font-inter fs-12'>2 day ago</span>
              </div>
            </div>
          </Link>
          <Link>
            <div className='noti-item'>
              <div className='noti-info'>
                <span className='noti-name font-inter color-white fs-13 d-block'>Has notification from Saraha AI!</span>
                <div className='noti-message d-flex justify-content-between color-white fw-300 font-inter fs-12'>
                  <span className='text-ellipsis'>Please mint NTF today 123123!</span>
                  <Badge status="success" />
                </div>
                <span className='noti-message d-flex justify-content-end color-white font-inter fs-12'>2 day ago</span>
              </div>
            </div>
          </Link>
          <Link>
            <div className='noti-item'>
              <div className='noti-info'>
                <span className='noti-name font-inter color-white fs-13 d-block'>Has notification from Saraha AI!</span>
                <div className='noti-message d-flex justify-content-between color-white fw-300 font-inter fs-12'>
                  <span className='text-ellipsis'>Please mint NTF today 123123!</span>
                  <Badge status="success" />
                </div>
                <span className='noti-message d-flex justify-content-end color-white font-inter fs-12'>2 day ago</span>
              </div>
            </div>
          </Link>
          <Link>
            <div className='noti-item'>
              <div className='noti-info'>
                <span className='noti-name font-inter color-white fs-13 d-block'>Has notification from Saraha AI!</span>
                <div className='noti-message d-flex justify-content-between color-white fw-300 font-inter fs-12'>
                  <span className='text-ellipsis'>Please mint NTF today 123123!</span>
                  <Badge status="success" />
                </div>
                <span className='noti-message d-flex justify-content-end color-white font-inter fs-12'>2 day ago</span>
              </div>
            </div>
          </Link>
          <Link>
            <div className='noti-item'>
              <div className='noti-info'>
                <span className='noti-name font-inter color-white fs-13 d-block'>Has notification from Saraha AI!</span>
                <div className='noti-message d-flex justify-content-between color-white fw-300 font-inter fs-12'>
                  <span className='text-ellipsis'>Please mint NTF today 123123!</span>
                  <Badge status="success" />
                </div>
                <span className='noti-message d-flex justify-content-end color-white font-inter fs-12'>2 day ago</span>
              </div>
            </div>
          </Link>

        </div>

      </div>
    </div>
  )
}

export default function NotificationPopover({ badgeCount = 2 }) {
  return (

    <Popover
      trigger={
        <div className="relative noti-button">
          <Bell className='noti-icon bg-primary' size={19} />
          {badgeCount > 0 && (
            <div className="noti-badge font-inter fs-8">
              <span className='d-block ms-1'>
                {badgeCount}
              </span>
            </div>
          )}
        </div>
      }
      content={<NotiItems />}
    >
    </Popover>
  );
};
