import {
  Select as SelectMain,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Select({
  placeholder,
  onValueChange,
  value,
  items = [],
  disabled,
  convertItem,
  mainClassName = 'select-main',
  form = true,
  ...other
}) {
  return (
    <SelectMain
      onValueChange={onValueChange}
      value={value}
      {...other}
    >
      <SelectTrigger className={`${form && 'mt-10'} select-none color-white font-inter fs-14 pointer bdr ${mainClassName}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent style={{ zIndex: 99999 }} className='select-content bdr mt-1' >
        <SelectGroup style={{ padding: '3px' }}>
          {items.map((item) => {
            return (
              <SelectItem disabled={disabled} value={item} className='pointer bdr select-item' style={{ height: '35px' }}>
                <span className="text-capitalize font-inter">
                  {convertItem ? convertItem(item) : item}
                </span>
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </SelectMain>
  )
} 
