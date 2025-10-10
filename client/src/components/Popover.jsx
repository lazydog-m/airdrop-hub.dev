import {
  Popover as PopoverUi,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Popover({
  trigger,
  content,
  side = 'bottom',
  align = 'start',
  mt = 'mt-1',
  modal = false,
  modalFilter = false,
  ...other
}) {

  if (modalFilter) {
    return (
      <PopoverUi>
        <PopoverTrigger asChild={modal}>
          <div>
            {trigger}
          </div>
        </PopoverTrigger>
        <PopoverContent
          {...other}
          portal={false}
          side={side}
          align={align}
          className={`bdr ${mt} bg-modal border-1`}
          style={{
            width: 'auto',
            boxShadow: 'none',
          }}
        >
          {content}
        </PopoverContent>
      </PopoverUi>
    )
  }

  if (modal) {
    return (
      <PopoverUi>
        <PopoverTrigger asChild={modal}>
          <div>
            {trigger}
          </div>
        </PopoverTrigger>
        <PopoverContent
          {...other}
          portal={false}
          side={side}
          align={align}
          className={`bdr ${mt} bg-modal border-1 PopoverContent p-0`}
          style={{
            boxShadow: 'none',
          }}
        >
          {content}
        </PopoverContent>
      </PopoverUi>
    )
  }

  return (
    <PopoverUi>
      <PopoverTrigger asChild={modal}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        {...other}
        side={side}
        align={align}
        className={`bdr ${mt} bg-color border-1`}
        style={{
          width: 'auto',
          boxShadow: 'none',
        }}
      >
        {content}
      </PopoverContent>
    </PopoverUi>
  )
}
