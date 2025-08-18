import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AlertDialogConfirm({ trigger, onOk = () => { }, title = '', desc = '', ...other }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className='ms-17 mt-15'>
          <AlertDialogTitle className='me-auto font-inter color-white'>{title}</AlertDialogTitle>
          <AlertDialogDescription className='font-inter'>
            {desc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={'mb-15'}>
          <AlertDialogCancel className='cancel-dialog font-inter bg-color color-white pointer'>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction className='font-inter pointer' onClick={onOk}>Đồng ý</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
