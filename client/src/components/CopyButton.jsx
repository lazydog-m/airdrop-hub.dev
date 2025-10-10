import { Copy, CopyCheck } from 'lucide-react';
import { Badge } from './ui/badge';

export default function CopyButton({
  text = '',
  textTooLong,
  copied,
  onCopy,
  ...other
}) {
  return (
    <Badge
      onClick={onCopy}
      className='badge-default copy'
      {...other}
    >
      <span className={`font-inter fw-400 ${textTooLong && 'text-too-long-auto'}`}>
        {text}
      </span>
      <span className='ms-4 font-inter'>
        {copied ? <CopyCheck size={'14px'} /> : <Copy size={'14px'} />}
      </span>
    </Badge>
  );
}
