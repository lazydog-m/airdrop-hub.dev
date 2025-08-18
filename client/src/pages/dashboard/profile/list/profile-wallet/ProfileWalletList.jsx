import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus } from 'lucide-react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import { WalletStatus } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import ProfileWalletFilterSearch from './ProfileWalletFilterSearch';
import ProfileWalletDataTable from './ProfileWalletDataTable';
import ProfileWalletNewEditForm from '../../create/ProfileWalletNewEditForm';
import useMessage from '@/hooks/useMessage';
import useTable from '@/hooks/useTable';
import { delayApi } from '@/utils/commonUtil';

const ProfileWalletDataTableMemo = React.memo(ProfileWalletDataTable);

export default function ProfileWalletList({ id }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const { onOpen, onClose } = useSpinner();
  const { onError } = useMessage();

  const [search, setSearch] = useState('');

  const {
    onSelectRow,
    selected,
    setSelected,
    onSelectAllRows,
    page,
    onChangePage,
  } = useTable({});

  const fetchApi = async (dataTrigger = false, onTrigger = () => { }) => {
    const params = {
      id,
      search,
      page,
    }

    try {
      onOpen();
      const response = await apiGet("/profile-wallets", params);
      if (dataTrigger) {
        setData(response.data.data.data || []);
        setPagination(response.data.data.pagination || {});
        onTrigger();
      }
      else {
        delayApi(() => {
          setData(response.data.data.data || []);
          setPagination(response.data.data.pagination || {});
          onClose();
        })
      }
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const handleSelectAllRows = React.useCallback((checked) => {
    const selecteds = data.map((row) => row.id);
    onSelectAllRows(checked, selecteds);
  }, [data])

  const handleSelectRow = React.useCallback((id) => {
    onSelectRow(id);
  }, [selected])

  const handleUpdateData = useCallback((isEdit, profileWalletNew, onTrigger = () => { }) => {
    if (!isEdit) {
      fetchApi(true, onTrigger)
    }
    else {
      setData((prevData) =>
        prevData.map((profileWallet) =>
          profileWallet.id === profileWalletNew.id ? profileWalletNew : profileWallet
        )
      );
    }
  }, [search, page]);

  const handleDeleteData = useCallback((id, onTrigger = () => { }) => {
    fetchApi(true, () => {
      const newSelected = selected.filter(selected => selected !== id);
      setSelected(newSelected);
      onTrigger();
    })
  }, [search, page, selected]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSearch = (value) => {
    setSearch(value);
    onChangePage(1);
  }

  const handleClearAllSelectedItems = () => {
    setSearch('');
    onChangePage(1);
  }

  const handleChangePage = useCallback((newPage) => {
    onChangePage(newPage)
  }, [])

  useEffect(() => {
    fetchApi();
  }, [search, page])

  return (
    <div style={{ maxHeight: '600px', minHeight: '600px', minWidth: '1365px', maxWidth: '1365px', overflow: 'hidden', padding: '1px' }}>
      <ProfileWalletFilterSearch
        action={
          <ButtonPrimary
            icon={<CirclePlus />}
            title='Thêm mới'
            onClick={handleClickOpen}
          />
        }
        onClearAllSelectedItems={handleClearAllSelectedItems}
        onChangeSearch={handleChangeSearch}
        search={search}
      />

      <ProfileWalletDataTableMemo
        pagination={pagination}
        onChangePage={handleChangePage}

        data={data}
        onUpdateData={handleUpdateData}
        onDeleteData={handleDeleteData}

        selected={selected}
        onSelectAllRows={handleSelectAllRows}
        onSelectRow={handleSelectRow}
      />

      <Modal
        size='sm'
        isOpen={open}
        onClose={handleClose}
        title={"Thêm mới địa chỉ ví"}
        content={
          <ProfileWalletNewEditForm
            profileId={id}
            onCloseModal={handleClose}
            onUpdateData={handleUpdateData}
          />
        }
      />

    </div>
  )
}
