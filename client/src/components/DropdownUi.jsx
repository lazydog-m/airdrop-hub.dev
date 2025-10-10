import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DropdownUi({
  trigger,
  group = [],
  header,
  footer,
  align = "end",
  minW = '160px',
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='bg-color bdr border-1 font-inter z-[9999]'
        align={align}
        style={{
          minWidth: minW,
          transition: 'none !important',
        }}
      >
        {header &&
          <>
            <DropdownMenuGroup className="dropdown-menu-group">
              <DropdownMenuItem
                className='dropdown-menu-item bdr pointer transition-none'
              >
                {header}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className='dropdown-menu-sepa' />
          </>
        }
        <DropdownMenuGroup className="dropdown-menu-group">
          {group.map((item, index) => {
            return (
              <DropdownMenuItem
                className='dropdown-menu-item bdr pointer transition-none'
                key={index}
                onClick={item.onClick}
              >
                {item.title}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className='dropdown-menu-sepa' />
        <DropdownMenuGroup className="dropdown-menu-group-footer">
          <DropdownMenuItem
            className={`dropdown-menu-item bdr pointer transition-none`}
            onClick={footer.onClick}
          >
            {footer.title}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

