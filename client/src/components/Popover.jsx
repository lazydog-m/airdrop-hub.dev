import { Popover as PopoverAntd } from 'antd';

export default function Popover({ trigger, content, ...other }) {

  return (
    <PopoverAntd
      arrow={false}
      color={'#09090B'}
      content={content}
      trigger='click'
      placement='bottomLeft'
      {...other}
    >
      {trigger}
    </PopoverAntd>
  )

}
