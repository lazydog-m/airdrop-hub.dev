import PropTypes from 'prop-types';
import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"
import { Search } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { group } from '../navbar/navConfig';
import { Link } from 'react-router-dom';

export default function SearchCommand({ }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <div
        className="sidebar-toggle"
      >
        <Search className='collapse-icon' size={19} onClick={() => setOpen(!open)} />
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Nhập lệnh hoặc tìm kiếm..." />
          <CommandList className={'p-7 font-inter'}>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            {group.map((item) => {
              return (
                <CommandGroup heading={item.name}>
                  {item.items.map((child) => {
                    return (
                      <CommandItem className={'pointer d-flex'}>
                        {child.icon}
                        {child.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )
            })}
          </CommandList>
        </CommandDialog>
      </div>
    </>
  )
}

