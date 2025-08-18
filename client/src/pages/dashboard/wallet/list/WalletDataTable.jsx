import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { convertWalletStatusEnumToReverse, convertWalletStatusEnumToTextReverse } from '@/utils/convertUtil';
import { SquarePen, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Color, NOT_AVAILABLE, WalletStatus } from '@/enums/enum';
import Modal from '@/components/Modal';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete, apiPut } from '@/utils/axios';
import useConfirm from '@/hooks/useConfirm';
import useNotification from '@/hooks/useNotification';
import WalletNewEditForm from '../create/WalletNewEditForm';
import SwitchStyle from '@/components/Switch';
import useMessage from '@/hooks/useMessage';
import useCopy from '@/hooks/useCopy';
import CopyButton from '@/components/CopyButton';
import { Checkbox } from '@/components/Checkbox';

const colunms = [
  { header: 'Tên Ví', align: 'left' },
  { header: 'Mật Khẩu Ví', align: 'left' },
  { header: 'Trạng Thái', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function WalletDataTable({
  data = [],
  onUpdateData,
  onDeleteData,
  onChangePage,
  onSelectAllRows,
  onSelectRow,
  pagination,
  dataType,
  selected = []
}) {
  const [open, setOpen] = React.useState(false);
  const [wallet, setWallet] = React.useState({});
  const { onOpen, onClose } = useSpinner();
  const { showConfirm } = useConfirm();
  const { onSuccess, onError } = useMessage();
  const isEdit = true;

  const { copied, handleCopy } = useCopy();

  const handleCopyText = (id, text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      handleCopy(id, type);
      onSuccess('Đã copy!');
    });
  }

  const handleClickOpen = (item) => {
    setOpen(true);
    setWallet(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateWalletStatus = (id, status) => {
    const statusToTextReverse = convertWalletStatusEnumToTextReverse(status);
    const body = {
      id,
      status: convertWalletStatusEnumToReverse(status),
    };
    showConfirm(`Xác nhận cập nhật trạng thái của ví thành '${statusToTextReverse?.toUpperCase()}'?`, () => putStatus(body));
  }

  const putStatus = async (body) => {
    try {
      onOpen();
      const response = await apiPut(`/wallets/status`, body);
      onUpdateData(true, response.data.data);
      onSuccess("Cập nhật trạng thái của ví thành công!");
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const handleDelete = (id) => {
    showConfirm("Xác nhận xóa ví?", () => remove(id));
  }

  const triggerRemove = () => {
    onSuccess("Xóa ví thành công!")
    onClose();
  }

  const remove = async (id) => {
    try {
      onOpen();
      const response = await apiDelete(`/wallets/${id}`);
      onDeleteData(response.data.data, triggerRemove);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

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
          <span className='font-inter d-flex color-white fw-bold'>
            {row.name}
          </span>
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.password}
            copied={copied.id === row.id}
            onCopy={copied.id !== row.id ? () => handleCopyText(row.id, row.password) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <SwitchStyle checked={row.status === WalletStatus.IN_ACTIVE} onClick={() => handleUpdateWalletStatus(row.id, row.status)} />
        </TableCell>
        <TableCell align="left">
          <ButtonIcon
            onClick={() => handleClickOpen(row)}
            variant='ghost'
            icon={<SquarePen color={Color.WARNING} />}
          />
          {!row.wallet_id &&
            <ButtonIcon
              onClick={() => handleDelete(row.id)}
              variant='ghost'
              icon={<Trash2 color={Color.DANGER} />}
            />
          }
        </TableCell>
      </TableRow >
    ))
  }, [data, copied, selected]);

  return (
    <>
      <DataTableMemo
        className='mt-20'
        colunms={colunms}
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
        title={"Cập nhật ví"}
        content={
          <WalletNewEditForm
            onCloseModal={handleClose}
            currentWallet={wallet}
            isEdit={isEdit}
            onUpdateData={onUpdateData}
          />
        }
      />
    </>
  );
}

