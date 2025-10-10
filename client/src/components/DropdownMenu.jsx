import { Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const DropdownMenu = ({ // Dropdown
  items = [],
  minW = '150px',
  ...other
}) => {

  return (
    <div
      className='dropdown-menu'
      {...other}
      style={{ minWidth: minW }}
    >
      {items.map((item) => {
        return (
          item?.actions ? item?.actions?.map((action, index) => {
            return (
              <div
                key={index}
                onClick={action?.onClick}
                className={`pointer color-white font-inter dropdown-menu-item d-flex align-items-center`}
                style={{ pointerEvents: action?.disabled && 'none', opacity: action?.disabled && '0.5' }}
              >
                {action.title}
              </div>
            )
          })
            // another item ...
            : item?.title ?
              <div
                onClick={item?.onClick}
                className={`pointer fs-13 dropdown-menu-item d-flex align-items-center justify-content-between`}
                style={{ backgroundColor: item?.active && '#323230' }}
              >
                <span className='font-inter color-white'>{item?.title}</span>
              </div>
              :
              null
        )
      })}
    </div>
  )
}
