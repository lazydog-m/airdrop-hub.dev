import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { convertWalletStatusEnumToReverse, convertWalletStatusEnumToTextReverse, shortenAddress } from '@/utils/convertUtil';
import { Copy, SquarePen, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Color, NOT_AVAILABLE, WalletStatus } from '@/enums/enum';
import Modal from '@/components/Modal';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete, apiPut } from '@/utils/axios';
import useConfirm from '@/hooks/useConfirm';
import useNotification from '@/hooks/useNotification';
import SwitchStyle from '@/components/Switch';
import ProfileWalletNewEditForm from '../../create/ProfileWalletNewEditForm';
import CopyButton from '@/components/CopyButton';
import useCopy from '@/hooks/useCopy';
import useMessage from '@/hooks/useMessage';
import { Checkbox } from '@/components/Checkbox';

const colunms = [
  { header: 'Ví', align: 'left' },
  { header: 'Địa Chỉ Ví', align: 'left' },
  { header: 'Mật Khẩu Ví', align: 'left' },
  { header: 'Cụm Từ Bí Mật', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function ProfileWalletDataTable({
  data = [],
  onUpdateData,
  onDeleteData,
  onChangePage,
  pagination,
  onSelectAllRows,
  onSelectRow,
  selected = []
}) {
  const [open, setOpen] = React.useState(false);
  const [profileWallet, setProfileWallet] = React.useState({});
  const { onOpen, onClose } = useSpinner();
  const { showConfirm } = useConfirm();
  const { copied, handleCopy } = useCopy();
  const { onSuccess, onError } = useMessage();
  const isEdit = true;

  const handleCopyText = (id, text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      handleCopy(id, type);
      onSuccess('Đã copy!');
    });
  }

  const handleClickOpen = (item) => {
    setOpen(true);
    setProfileWallet(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const rows = React.useMemo(() => {
    return data.map((row, index) => (
      <TableRow
        className='table-row'
        key={row.id}
        selected={selected.includes(row.id)}
      >
        <TableCell align="left">
          <Checkbox
            checked={selected.includes(row.id)}
            onClick={() => onSelectRow(row.id)}
          />
        </TableCell>
        <TableCell align="left">
          {row.name}
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={shortenAddress(row.wallet_address)}
            copied={copied.id === row.id && copied.type === WALLET_ADDRESS_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== WALLET_ADDRESS_TYPE) ? () => handleCopyText(row.id, row.wallet_address, WALLET_ADDRESS_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.password}
            copied={copied.id === row.id && copied.type === PASSWORD_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== PASSWORD_TYPE) ? () => handleCopyText(row.id, row.password, PASSWORD_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.secret_phrase}
            textTooLong
            copied={copied.id === row.id && copied.type === SECRET_PHRASE_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== SECRET_PHRASE_TYPE) ? () => handleCopyText(row.id, row.secret_phrase, SECRET_PHRASE_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <ButtonIcon
            onClick={() => handleClickOpen(row)}
            variant='ghost'
            icon={<SquarePen color={Color.WARNING} />}
          />
        </TableCell>
      </TableRow >
    ))
  }, [data, copied, selected]);

  return (
    <>
      <DataTableMemo
        maxHeight={499}
        className='mt-20'
        colunms={colunms}
        data={rows}
        pagination={pagination}

        selected={selected}
        isCheckedAll={data.length > 0 && data?.every(row => selected?.includes(row.id))}
        isIndeterminate={selected.length > 0 && data?.some(row => selected.includes(row.id)) && !data.every(row => selected.includes(row.id))}

        onSelectAllRows={onSelectAllRows}
        onChangePage={onChangePage}

        selectedObjText={'hồ sơ'}
      />

      <Modal
        size='sm'
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật địa chỉ ví"}
        content={
          <ProfileWalletNewEditForm
            onCloseModal={handleClose}
            currentProfileWallet={profileWallet}
            isEdit={isEdit}
            onUpdateData={onUpdateData}
          />
        }
      />
    </>
  );
}

const WALLET_ADDRESS_TYPE = 'WALLET_ADDRESS_TYPE';
const PASSWORD_TYPE = 'PASSWORD_TYPE';
const SECRET_PHRASE_TYPE = 'SECRET_PHRASE_TYPE';
