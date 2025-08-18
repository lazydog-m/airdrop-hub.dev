import { Tooltip } from 'antd';

export default function TooltipDefault({ title, children, ...other }) {

  return (
    <Tooltip
      title={title}
      arrow={false}
      {...other}
    >
      {children}
    </Tooltip>
  )

}
