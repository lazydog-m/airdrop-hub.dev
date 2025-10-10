import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { shortenAddress } from '@/utils/convertUtil';
import { PencilLine } from 'lucide-react';
import { Color } from '@/enums/enum';
import Modal from '@/components/Modal';
import ProfileWalletNewEditForm from '../../new-edit/ProfileWalletNewEditForm';
import CopyButton from '@/components/CopyButton';
import useCopy from '@/hooks/useCopy';
import { Checkbox } from '@/components/Checkbox';

const columns = [
  { header: 'Tên Ví', align: 'left' },
  { header: 'Địa Chỉ Ví', align: 'left' },
  { header: 'Mật Khẩu Ví', align: 'left' },
  { header: 'Secret Phrase', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function ProfileWalletDataTable({
  data = [],
  onUpdateData,
  onChangePage,
  pagination,
  onSelectAllRows,
  onSelectRow,
  selected = []
}) {
  const [open, setOpen] = React.useState(false);
  const [profileWallet, setProfileWallet] = React.useState({});
  const { copied, handleCopy } = useCopy();
  const isEdit = true;

  const handleCopyText = (id, text, type) => {
    handleCopy(id, type, text);
  }

  const handleClickOpen = (item) => {
    setOpen(true);
    setProfileWallet(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const rows = React.useMemo(() => {
    return data.map((row) => (
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
            textTooLong
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
            icon={<PencilLine color={Color.WARNING} />}
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
        columns={columns}
        data={rows}
        pagination={pagination}

        selected={selected}
        isCheckedAll={data.length > 0 && data?.every(row => selected?.includes(row.id))}
        isIndeterminate={selected.length > 0 && data?.some(row => selected.includes(row.id)) && !data.every(row => selected.includes(row.id))}

        onSelectAllRows={onSelectAllRows}
        onChangePage={onChangePage}

        selectedObjText={'ví'}
      />

      <Modal
        size='sm'
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật ví Web3 của hồ sơ"}
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
