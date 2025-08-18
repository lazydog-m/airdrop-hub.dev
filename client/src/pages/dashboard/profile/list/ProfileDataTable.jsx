import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon, ButtonOutline, ButtonPrimary } from '@/components/Button';
import { Chrome, EllipsisVertical, Loader, SquarePen, Trash2, WalletIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Color, NOT_AVAILABLE } from '@/enums/enum';
import Modal from '@/components/Modal';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete, apiGet, apiPost, apiPut } from '@/utils/axios';
import useConfirm from '@/hooks/useConfirm';
import useNotification from '@/hooks/useNotification';
import SwitchStyle from '@/components/Switch';
import ProfileNewEditForm from '../create/ProfileNewEditForm';
import { convertEmailToEmailUsername, getMasked } from '@/utils/convertUtil';
import ProfileWalletList from './profile-wallet/ProfileWalletList';
import useCopy from '@/hooks/useCopy';
import CopyButton from '@/components/CopyButton';
import useMessage from '@/hooks/useMessage';
import { Checkbox } from '@/components/Checkbox';
import { Button } from '@/components/ui/button';

const colunms = [
  { header: 'Tên Hồ Sơ', align: 'left' },
  // { header: 'Email', align: 'left' },
  // { header: 'Mật Khẩu Email', align: 'left' },
  { header: 'Tài Khoản - Ví', align: 'left' },
  // { header: 'Mật Khẩu Discord', align: 'left' },
  // { header: 'SĐT Telegram', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function ProfileDataTable({
  data = [],
  onUpdateData,
  onDeleteData,
  onChangePage,
  pagination,
  onSelectAllRows,
  onSelectRow,
  openningIds = new Set(),
  onAddOpenningId,
  onRemoveOpenningId,
  selected = [],
  loadingIds = new Set(),
  onAddLoadingId,
  onRemoveLoadingId,
}) {

  const [open, setOpen] = React.useState(false);
  const [openProfileWallet, setOpenProfileWallet] = React.useState(false);
  const [profile, setProfile] = React.useState({});
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
    setProfile(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenProfileWallet = (item) => {
    setOpenProfileWallet(true);
    setProfile(item);
  };

  const handleCloseProfileWallet = () => {
    setOpenProfileWallet(false);
  };


  const handleDelete = (id) => {
    showConfirm("Xác nhận xóa hồ sơ?", () => remove(id));
  }

  const triggerRemove = () => {
    onSuccess("Xóa hồ sơ thành công!")
    onClose();
  }

  const remove = async (id) => {
    try {
      onOpen();
      const response = await apiDelete(`/profiles/${id}`);
      onDeleteData(response.data.data, triggerRemove);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const handleOpenProfile = (id) => {
    openProfile(id);
  }

  const handleCloseProfile = (id) => {
    closeProfile(id);
  }

  const openProfile = async (id) => {
    try {
      onAddLoadingId(id);
      const response = await apiGet(`/profiles/${id}/open`);
      const profileId = response.data.data;
      // onSuccess("Mở thành công!");
      onAddOpenningId(profileId);
      onRemoveLoadingId(profileId);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onRemoveLoadingId(id);
    }
  }

  const closeProfile = async (id) => {
    try {
      onAddLoadingId(id);
      const response = await apiGet(`/profiles/${id}/close`);
      const profileId = response.data.data;
      // onSuccess("Đóng thành công!");
      onRemoveOpenningId(profileId);
      onRemoveLoadingId(profileId);
    } catch (error) {
      console.error(error);
      // onError(error.message);
      onRemoveLoadingId(id);
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
          <span>
            {row.email}
          </span>
        </TableCell>
        {/*
        <TableCell align="left">
          <CopyButton
            text={row.email}
            copied={copied.id === row.id && copied.type === EMAIL_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== EMAIL_TYPE) ? () => handleCopyText(row.id, row.email, EMAIL_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={!row.email_password ? NOT_AVAILABLE : (copied.id === row.id && copied.type === EMAIL_PASSWORD_TYPE) ? row.email_password : getMasked(row.email_password)}
            copied={copied.id === row.id && copied.type === EMAIL_PASSWORD_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== EMAIL_PASSWORD_TYPE) ? () => handleCopyText(row.id, row.email_password, EMAIL_PASSWORD_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.x_username || NOT_AVAILABLE}
            copied={copied.id === row.id && copied.type === USERNAME_X_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== USERNAME_X_TYPE) ? () => handleCopyText(row.id, row.x_username, USERNAME_X_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.discord_username || NOT_AVAILABLE}
            copied={copied.id === row.id && copied.type === USERNAME_DISCORD_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== USERNAME_DISCORD_TYPE) ? () => handleCopyText(row.id, row.discord_username, USERNAME_DISCORD_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={!row.discord_password ? NOT_AVAILABLE : (copied.id === row.id && copied.type === DISCORD_PASSWORD_TYPE) ? row.discord_password : getMasked(row.discord_password)}
            copied={copied.id === row.id && copied.type === DISCORD_PASSWORD_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== DISCORD_PASSWORD_TYPE) ? () => handleCopyText(row.id, row.discord_password, DISCORD_PASSWORD_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.telegram_phone || NOT_AVAILABLE}
            copied={copied.id === row.id && copied.type === TELEGRAM_PHONE_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== TELEGRAM_PHONE_TYPE) ? () => handleCopyText(row.id, row.telegram_phone, TELEGRAM_PHONE_TYPE) : () => { }}
          />
        </TableCell>
*/}
        {/*
              <TableCell align="left">
                <SwitchStyle checked={row.status === WalletStatus.IN_ACTIVE} onClick={() => handleUpdateWalletStatus(row.id, row.status)} />
              </TableCell>
*/}
        <TableCell align="left">
          <ButtonIcon
            onClick={() => handleClickOpen(row)}
            variant='ghost'
            icon={<SquarePen color={Color.WARNING} />}
          />
          <ButtonIcon
            onClick={() => handleClickOpenProfileWallet(row)}
            variant='ghost'
            icon={<WalletIcon color={Color.SECONDARY} />}
          />
        </TableCell>

        <TableCell align="left" style={{ userSelect: '-moz-none' }}>
          <div className='d-flex'>
            {openningIds.has(row.id) ?
              <ButtonOutline
                onClick={() => handleCloseProfile(row.id)}
                style={{
                  // width: '80px',
                  opacity: loadingIds.has(row.id) ? '0.5' : '1',
                  pointerEvents: loadingIds.has(row.id) ? 'none' : '',
                  height: '36.5px',
                }}
                icon={loadingIds.has(row.id) ? <Loader className="animate-spin" /> : <Chrome />}
                title='Đóng'
              />
              :
              <ButtonPrimary
                onClick={() => handleOpenProfile(row.id)}
                style={{
                  // width: '60px',
                  opacity: loadingIds.has(row.id) ? '0.5' : '1',
                  pointerEvents: loadingIds.has(row.id) ? 'none' : '',
                  height: '36.5px',
                }}
                icon={loadingIds.has(row.id) ? <Loader className="animate-spin" /> : <Chrome />}
                title='Mở'
              />
            }
          </div>

          {/*
          <ButtonIcon
            onClick={() => handleClickOpen(row)}
            variant='ghost'
            icon={<SquarePen color={Color.WARNING} />}
          />

          <ButtonIcon
            onClick={() => handleDelete(row.id)}
            variant='ghost'
            icon={<Trash2 color={Color.DANGER} />}
          />
*/}
        </TableCell>
      </TableRow >
    ))
  }, [data, copied, selected, loadingIds, openningIds]);

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

        selectedObjText={'hồ sơ'}
      />

      <Modal
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật ví"}
        content={
          <ProfileNewEditForm
            onCloseModal={handleClose}
            currentProfile={profile}
            isEdit={isEdit}
            onUpdateData={onUpdateData}
          />
        }
      />

      <Modal
        // minH={'500px'}
        size='xl'
        isOpen={openProfileWallet}
        onClose={handleCloseProfileWallet}
        title={"Danh sách địa chỉ ví"}
        content={
          <ProfileWalletList id={profile.id} />
        }
      />

    </>
  );
}

const EMAIL_TYPE = 'EMAIL_TYPE';
const EMAIL_PASSWORD_TYPE = 'EMAIL_PASSWORD_TYPE';
const USERNAME_X_TYPE = 'USERNAME_X_TYPE';
const USERNAME_DISCORD_TYPE = 'USERNAME_DISCORD_TYPE';
const DISCORD_PASSWORD_TYPE = 'DISCORD_PASSWORD_TYPE';
const TELEGRAM_PHONE_TYPE = 'TELEGRAM_PHONE_TYPE';
