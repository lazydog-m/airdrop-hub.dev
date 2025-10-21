import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import * as TooltipPrimitives from '@radix-ui/react-tooltip';
import { Color } from "@/enums/enum"

export default function TooltipUi({
  content,
  children,
  side = 'top',
  modal = false,
  ...other
}) {

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip {...other}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          portal={modal ? false : true}
          side={side}
          className='font-inter fw-500'
          style={{
            borderRadius: '6px',
            backgroundColor: '#585858',
            color: 'white',
            fontSize: '13px'
          }}
        >
          <span className="ms-0">
            {content}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
