import React, { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { LogOut, Settings, CircleUser } from 'lucide-react';
import { Link } from 'react-router-dom';
import Popover from '@/components/Popover';

const AccountMenu = () => {
  return (

    <div className='account-popover'>

      <div className='account-header d-flex align-items-center gap-9'>
        <Avatar style={{ width: '32px', height: '32px' }}>
          <AvatarImage src={'https://github.com/shadcn.png'} alt="@shadcn" />
          <AvatarFallback className='color-white'>AC</AvatarFallback>
        </Avatar>
        <div className='account-info'>
          <span className='account-name fw-bold font-inter color-white fs-13'>AirdropHub</span>
          <span className='account-email d-block font-inter fw-500 fs-12' style={{ color: 'gray' }}>airdrophub</span>
        </div>
      </div>

      <div className='account-menu'>

        <div className='account-group-menu-item'>

          <Link>
            <div className='menu-item menu-item-profile d-flex align-items-center gap-8'>
              <CircleUser size={15} color='white' />
              <span className='font-inter fs-14  color-white'>Profile</span>
            </div>
          </Link>

          <Link>
            <div className='menu-item menu-item-setting d-flex align-items-center gap-8'>
              <Settings size={15} color='white' />
              <span className='font-inter fs-14 color-white'>Settings</span>
            </div>
          </Link>

        </div>

        <div className='account-menu-item'>

          <Link>
            <div className='menu-item menu-item-logout d-flex align-items-center gap-8'>
              <LogOut size={15} color='white' />
              <span className='font-inter fs-14 color-white'>Log out</span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default function AccountPopover({ imageUrl = 'https://github.com/shadcn.png' }) {
  return (
    <Popover
      trigger={
        <Avatar style={{ width: '30px', height: '30px', cursor: 'pointer', userSelect: 'none' }}>
          <AvatarImage src={imageUrl} alt="@shadcn" />
          <AvatarFallback className='color-white'>AC</AvatarFallback>
        </Avatar>
      }
      content={<AccountMenu />}
    >
    </Popover>
  )
}
