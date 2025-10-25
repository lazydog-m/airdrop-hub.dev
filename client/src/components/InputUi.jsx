import { Input } from "./ui/input";

export default function InputUi({ className, ...other }) {
  return (
    <Input
      {...other}
      className={`${className}
            font-inter custom-input
            focus-visible:outline-none
            focus-visible:ring-offset-1 focus-visible:ring-offset-background
            transition-all duration-200 ease-in-out
            focus-visible:ring-[1px]
            dark:focus-visible:ring-offset-neutral-500
      `}
    />
  )
}
