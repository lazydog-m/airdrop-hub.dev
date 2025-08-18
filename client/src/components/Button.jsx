import { Button } from "./ui/button";
import { Badge } from '@/components/ui/badge'
import { Separator } from "./ui/separator";
import { reverse } from "lodash";
import { lightenColor } from "@/utils/convertUtil";

export const ButtonPrimary = ({ icon, title, ...other }) => {
  return (
    <Button className='button-primary select-none font-inter pointer color-white h-40 fs-13 d-flex' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonOutlinePrimary = ({ icon, title, ...other }) => {
  return (
    <Button className='button-outline-primary select-none font-inter pointer h-40 fs-13 d-flex' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonOutlineDanger = ({ icon, title, ...other }) => {
  return (
    <Button className='button-outline-danger select-none font-inter pointer h-40 fs-13 d-flex' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonDanger = ({ icon, title, ...other }) => {
  return (
    <Button variant={'destructive'} className='font-inter pointer color-white h-40 fs-13 d-flex' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonOutline = ({ icon, title, isReverse, ...other }) => {

  if (isReverse) {
    return (
      <Button className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex align-items-center justify-content-center select-none' {...other}>
        {title} {icon}
      </Button>
    )
  }

  return (
    <Button className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex  align-items-center justify-content-center  select-none' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonIcon = ({ icon, variant = 'outline', ...other }) => {
  return (
    <Button
      className="pointer button-icon select-none bdr"
      variant={variant}
      size='icon'
      {...other}
    >
      {icon}
    </Button>
  )
}

export const ButtonGhost = ({ icon, title, isReverse, ...other }) => {
  if (isReverse) {
    return (
      <Button
        variant='ghost'
        className={`color-white font-inter pointer fs-13 h-40 d-flex align-items-center button-ghost bdr`}
        {...other}
      >
        {icon} {title}
      </Button>
    )
  }

  return (
    <Button
      variant='ghost'
      className={`color-white font-inter pointer fs-13 h-40 d-flex align-items-center bdr button-ghost`}
      {...other}
    >
      {title} {icon}
    </Button>
  )
}

export const ButtonOutlineTags = ({ icon, title, selected = [], tags, showTagOne = false, ...other }) => {
  return (
    <Button {...other}>

      <div className={`d-flex align-items-center gap-8 ${selected.length > 0 && 'pe-8'}`}>
        {icon} {title}
      </div>

      {selected.length > 0 &&
        <Separator orientation="vertical" className='h-4 sepa' />
      }

      {(selected.length > 0 && selected.length < 3 && !showTagOne) ?
        <div className="d-flex align-items-center gap-1 ps-8">
          {tags}
        </div>
        : selected.length > 2 && !showTagOne ?
          <div className="d-flex align-items-center gap-1 ps-8">
            <Badge className='font-inter bdr fw-400 fs-12 bg-color' style={{ borderColor: lightenColor('#606060', 0.05), color: 'white' }}>{`${selected.length} lựa chọn`}</Badge>
          </div>
          : null
      }

      {(selected.length > 0 && selected.length < 2 && showTagOne) ?
        <div className="d-flex align-items-center gap-1 ps-8">
          {tags}
        </div>
        : selected.length > 1 && showTagOne ?
          <div className="d-flex align-items-center gap-1 ps-8">
            <Badge className='font-inter bdr fw-400 fs-12 bg-color' style={{ borderColor: lightenColor('#606060', 0.05), color: 'white' }}>{`${selected.length} lựa chọn`}</Badge>
          </div>
          : null
      }

    </Button>
  )
}

