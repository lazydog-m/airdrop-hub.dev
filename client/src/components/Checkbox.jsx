import React, { useState } from 'react';
import { Checkbox as CheckboxAntd } from 'antd';
import { ButtonOutline } from './Button';
import { toString } from 'lodash';
import { Color } from '@/enums/enum';

export const Checkbox = ({ label, checked, onChange = () => { }, ...other }) => {
  return (
    <CheckboxAntd
      className='checkbox-default'
      {...other}
      id={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    >
      {label &&
        <span className='color-white fs-13 fw-400 font-inter'>{label}</span>
      }
    </CheckboxAntd>
  );
}

export const CheckboxItems = ({
  items = [],
  selectedItems,
  onChangeSelectedItems,
  onClearSelectedItems,
  count,
  minWidth = 170,
  convert,
  ...other
}) => {

  return (
    <div className='dropdown-menu' style={{ minWidth }}>
      {items.map((item) => {
        const isChecked = selectedItems.includes(item);
        return (
          <div
            className='pointer dropdown-menu-item d-flex align-items-center justify-content-between'
            onClick={() => onChangeSelectedItems(item, !isChecked)}
          >
            <Checkbox
              {...other}
              className='checkbox-dropdown'
              label={
                <span className='text-capitalize ms-4 fw-400 fs-13'>
                  {convert ? convert(item) : item}
                </span>
              }
              checked={selectedItems.includes(item)}
            />
            {count &&
              <span className='font-inter color-white fs-13'>{50}</span>
            }
          </div>
        )
      })}
      {selectedItems?.length > 0 &&
        <ButtonOutline
          style={{ color: Color.ORANGE, borderColor: '#505050' }}
          onClick={onClearSelectedItems}
          className='button-outlined w-full mt-5 fw-500 font-inter pointer color-white h-35 fs-13 d-flex'
          title='Làm mới'
        />
      }
    </div>
  )
}
