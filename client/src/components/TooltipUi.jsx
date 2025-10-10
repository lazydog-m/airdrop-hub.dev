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
  ...other
}) {

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip {...other}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          arrow={true}
          side={side}
          className='font-inter fw-400'
          style={{
            borderRadius: '4px',
            backgroundColor: '#585858',
            color: 'white',
            fontSize: '12px'
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
