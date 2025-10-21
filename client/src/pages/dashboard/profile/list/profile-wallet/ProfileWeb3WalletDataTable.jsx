import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { shortenAddress } from '@/utils/convertUtil';
import { PencilLine, Trash2 } from 'lucide-react';
import { Color } from '@/enums/enum';
import Modal from '@/components/Modal';
import ProfileWeb3WalletNewEditForm from '../../new-edit/ProfileWeb3WalletNewEditForm';
import CopyButton from '@/components/CopyButton';
import useCopy from '@/hooks/useCopy';
import { Checkbox } from '@/components/Checkbox';
import { ResourceIcon } from '@/commons/Resources';
import useConfirm from '@/hooks/useConfirm';
import useMessage from '@/hooks/useMessage';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete } from '@/utils/axios';

const columns = [
  { header: 'Tên Ví', align: 'left' },
  { header: 'Địa Chỉ Ví', align: 'left' },
  { header: 'Mật Khẩu Ví', align: 'left' },
  { header: 'Secret Phrase', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function ProfileWeb3WalletDataTable({
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
  const [profileWeb3Wallet, setProfileWeb3Wallet] = React.useState({});
  const { showConfirm, onCloseLoader } = useConfirm();
  const { onOpen, onClose } = useSpinner();
  const { onSuccess, onError } = useMessage();
  const { copied, handleCopy } = useCopy();
  const isEdit = true;

  const handleCopyText = (id, text, type) => {
    handleCopy(id, type, text);
  }

  const handleClickOpen = (item) => {
    setOpen(true);
    setProfileWeb3Wallet(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id, name) => {
    showConfirm(`Xác nhận xóa ví Web3 '${name}' của profile?`, () => remove(id));
  }

  const triggerRemove = () => {
    onCloseLoader();
    onSuccess("Xóa thành công!")
  }

  const remove = async (id) => {
    try {
      const response = await apiDelete(`/profile-web3-wallets/${id}`);
      onDeleteData(response.data.data, triggerRemove);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onCloseLoader();
    }
  }

  const rows = React.useMemo(() => {
    return data.map((row) => (
      <TableRow
        className='table-row'
        key={row.id}
        selected={selected.includes(row?.id)}
      >
        <TableCell align="left">
          <Checkbox
            checked={selected.includes(row?.id)}
            onClick={() => onSelectRow(row?.id)}
          />
        </TableCell>
        <TableCell align="left">
          <span className='font-inter d-flex color-white fw-500 items-center gap-8'>
            {row?.resource_id &&
              <ResourceIcon id={row?.resource_id} className='mb-0.5' />
            }
            {row?.name}
          </span>
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={shortenAddress(row?.wallet_address)}
            copied={copied.id === row?.id && copied.type === WALLET_ADDRESS_TYPE}
            onCopy={(copied.id !== row?.id || copied.type !== WALLET_ADDRESS_TYPE) ? () => handleCopyText(row?.id, row?.wallet_address, WALLET_ADDRESS_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row?.password}
            textTooLong
            copied={copied.id === row?.id && copied.type === PASSWORD_TYPE}
            onCopy={(copied.id !== row?.id || copied.type !== PASSWORD_TYPE) ? () => handleCopyText(row?.id, row?.password, PASSWORD_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row?.secret_phrase}
            textTooLong
            copied={copied.id === row?.id && copied.type === SECRET_PHRASE_TYPE}
            onCopy={(copied.id !== row?.id || copied.type !== SECRET_PHRASE_TYPE) ? () => handleCopyText(row?.id, row?.secret_phrase, SECRET_PHRASE_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <ButtonIcon
            onClick={() => handleClickOpen(row)}
            variant='ghost'
            icon={<PencilLine color={Color.WARNING} />}
          />
          <ButtonIcon
            onClick={() => handleDelete(row?.id, row?.name)}
            variant='ghost'
            icon={<Trash2 color={Color.DANGER} />}
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
        size='md'
        width={'700px'}
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật ví Web3 của profile"}
        content={
          <ProfileWeb3WalletNewEditForm
            onCloseModal={handleClose}
            currentProfileWeb3Wallet={profileWeb3Wallet}
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
