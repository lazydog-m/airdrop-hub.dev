import { Checkbox as CheckboxAntd } from 'antd';
import { ButtonGhost } from './Button';
import { Color } from '@/enums/enum';
import { Check } from 'lucide-react';

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

export const DropdownCheckboxMenu = ({
  items = [],
  selectedItems = [],
  onChangeSelectedItems,
  onClearSelectedItems,
  count,
  minWidth = 180,
  convert,
  filterSelect,
  modal = false,
  ...other
}) => {

  const activeChildren = filterSelect?.items?.find(item => item?.header === filterSelect?.selected)?.children || [];

  return (
    <div className={`dropdown-menu${modal && '-modal'}`} style={{ minWidth }}>
      {!filterSelect && items.map((item, index) => {
        const isChecked = selectedItems.includes(item);
        return (
          <div
            key={index}
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
              checked={isChecked}
            />
            {count &&
              <span className='font-inter color-white fs-13'>{50}</span>
            }
          </div>
        )
      })}
      {filterSelect && filterSelect?.items?.map((item, index) => {
        const isActive = filterSelect?.selected === item?.header;
        return (
          <div
            key={index}
            className='pointer dropdown-menu-item d-flex align-items-center justify-content-between gap-25'
            onClick={() => filterSelect?.onChange(item?.header)}
            style={{ backgroundColor: isActive && '#323230' }}
          >
            <span className='text-capitalize fw-400 fs-13 d-flex align-items-center gap-10 font-inter'>
              {item?.icon}
              {item?.header}
            </span>
            {isActive &&
              <span>
                {isActive && <Check className='mb-2' size={'16px'} color='#a1a1a1' />}
              </span>
            }
          </div>
        )
      })
      }
      {activeChildren.length > 0 &&
        <>
          <div className='mt-5' style={{ borderBottom: '1px solid #404040' }}></div>
          <div className='children-container mt-5'>
            {activeChildren?.map((item, index) => {
              const isChecked = selectedItems.includes(item);
              return (
                <div
                  key={index}
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
                    checked={isChecked}
                  />
                </div>
              )
            })}
          </div>
        </>
      }
      {(selectedItems?.length > 0 || filterSelect?.selected) &&
        <ButtonGhost
          style={{ color: Color.ORANGE }}
          onClick={onClearSelectedItems}
          className='button-ghost bdr w-full mt-5 fw-400 font-inter pointer color-white h-35 fs-13 d-flex border-1'
          title='Clear'
        />
      }
    </div>
  )
}
