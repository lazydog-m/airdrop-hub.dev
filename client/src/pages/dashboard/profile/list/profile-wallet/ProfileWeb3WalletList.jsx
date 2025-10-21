import React, { useState, useEffect, useCallback } from 'react';
import { ButtonPrimary } from "@/components/Button";
import { CirclePlus, Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import useSpinner from '@/hooks/useSpinner';
import ProfileWeb3WalletFilterSearch from './ProfileWeb3WalletFilterSearch';
import ProfileWeb3WalletDataTable from './ProfileWeb3WalletDataTable';
import ProfileWeb3WalletNewEditForm from '../../new-edit/ProfileWeb3WalletNewEditForm';
import useMessage from '@/hooks/useMessage';
import useTable from '@/hooks/useTable';
import { delayApi } from '@/utils/commonUtil';

const ProfileWeb3WalletDataTableMemo = React.memo(ProfileWeb3WalletDataTable);

export default function ProfileWeb3WalletList({ profileId = '' }) {
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
      search,
      page,
    }

    try {
      if (!dataTrigger) {
        onOpen();
      }

      const response = await apiGet(`/profile-web3-wallets/${profileId}`, params);

      if (dataTrigger) {
        delayApi(() => {
          setData(response.data.data.data || []);
          setPagination(response.data.data.pagination || {});
          onTrigger();
        })
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

  const handleUpdateData = useCallback((onTrigger = () => { }) => {
    fetchApi(true, onTrigger)
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
    <div>
      <ProfileWeb3WalletFilterSearch
        action={
          <ButtonPrimary
            icon={<Plus strokeWidth={2.5} />}
            title='Thêm ví Web3'
            onClick={handleClickOpen}
          />
        }
        onClearAllSelectedItems={handleClearAllSelectedItems}
        onChangeSearch={handleChangeSearch}
        search={search}
      />

      <ProfileWeb3WalletDataTableMemo
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
        size='md'
        width={'700px'}
        isOpen={open}
        onClose={handleClose}
        title={"Thêm ví Web3 vào profile"}
        content={
          <ProfileWeb3WalletNewEditForm
            profileId={profileId}
            onCloseModal={handleClose}
            onUpdateData={handleUpdateData}
          />
        }
      />

    </div>
  )
}
