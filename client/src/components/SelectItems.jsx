import { Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const SelectItems = ({
  items,
  width,
  ...other
}) => {

  return (
    <div className='dropdown-menu' {...other}>
      {items.map((item) => {
        return (
          item?.url ?
            <Link to={item?.url} target='_blank' rel="noopener noreferrer">
              <div
                className={`pointer color-white font-inter fs-13 dropdown-menu-item d-flex align-items-center justify-content-between gap-10`}
                style={{ minWidth: width }}
              >
                <span className='font-inter fw-400 color-white'>{item?.title}</span>
              </div>
            </Link>
            : item?.actions ?
              item?.actions?.map((action) => {
                return (
                  <div
                    onClick={action.onClick}
                    className={`pointer color-white font-inter fs-13 dropdown-menu-item d-flex align-items-center justify-content-between gap-10`}
                    style={{ pointerEvents: action?.disabled && 'none', opacity: action?.disabled && '0.5' }}
                  >
                    {action.title}
                  </div>
                )
              })
              : item?.title ?
                <div
                  onClick={item.onClick}
                  className={`pointer color-white font-inter fs-13 dropdown-menu-item d-flex align-items-center justify-content-between gap-10`}
                  style={{ minWidth: width }}
                >
                  <span className='font-inter fw-bold color-white'>{item?.title}</span>
                </div>
                :
                null
        )
      })}
    </div>
  )
}
