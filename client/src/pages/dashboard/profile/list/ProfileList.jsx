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
import ProfileDataTable from './ProfileDataTable';
import ProfileNewEditForm from '../create/ProfileNewEditForm';
import ProfileFilterSearch from './ProfileFilterSearch';
import { convertEmailToEmailUsername } from '@/utils/convertUtil';
import useMessage from '@/hooks/useMessage';
import useTable from '@/hooks/useTable';
import { delayApi } from '@/utils/commonUtil';
import useSocket from '@/hooks/useSocket';

const ProfileDataTableMemo = React.memo(ProfileDataTable);

export default function ProfileList() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const { onOpen, onClose } = useSpinner();
  const { onError } = useMessage();
  const [openningIds, setOpenningIds] = useState(new Set());
  const [loadingIds, setLoadingIds] = React.useState(new Set());
  const socket = useSocket();

  const [selectedStatusItems, setSelectedStatusItems] = useState(['']);
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
      page,
      search,
    }

    try {
      onOpen();
      const response = await apiGet("/profiles", params);

      if (dataTrigger) {
        setData(response.data.data.data || []);
        setPagination(response.data.data.pagination || {});
        // setOpenningIds(new Set(response.data.data.browsers));
        onTrigger();
      }
      else {
        delayApi(() => {
          setData(response.data.data.data || []);
          setPagination(response.data.data.pagination || {});
          setOpenningIds(new Set(response.data.data.browsers));
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

  const handleUpdateData = useCallback((isEdit, profileNew, onTrigger = () => { }) => {
    if (!isEdit) {
      fetchApi(true, onTrigger)
    }
    else {
      setData((prevData) =>
        prevData.map((profile) =>
          profile.id === profileNew.id ? profileNew : profile
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

  const handleChangeSelectedStatusItems = (label, isChecked) => {
    setSelectedStatusItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    onChangePage(1);
  };

  const handleClearAllSelectedItems = () => {
    setSelectedStatusItems([]);
    setSearch('');
    onChangePage(1);
  }

  const handleChangePage = useCallback((newPage) => {
    onChangePage(newPage)
  }, [])

  const handleAddOpenningId = useCallback((id) => {
    setOpenningIds((prev) => new Set(prev).add(id));
  }, [])

  const handleAddOpenningIds = (ids = []) => {
    const updatedOpenningIds = new Set([...openningIds, ...ids]);
    setOpenningIds(updatedOpenningIds);
  };

  console.log(openningIds)

  const handleRemoveOpenningIds = (ids = []) => {
    const updatedOpenningIds = new Set(openningIds);
    ids?.forEach((id) => {
      updatedOpenningIds.delete(id);
    });
    setOpenningIds(updatedOpenningIds);
  };

  const handleRemoveOpenningId = useCallback((id) => {
    setOpenningIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, [])

  const handleAddLoadingId = useCallback((id) => {
    setLoadingIds((prev) => new Set(prev).add(id));
  }, [])

  const handleRemoveLoadingId = useCallback((id) => {
    setLoadingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, [])

  useEffect(() => {
    fetchApi();
  }, [search, page])

  useEffect(() => {
    socket.on('profileIdClosed', (data) => {
      handleRemoveOpenningId(data.id);
      console.log(data.id)
    });

    return () => {
      socket.off('profileIdClosed');
    };
  }, [socket]);

  return (
    <Page title='Quản lý hồ sơ - AirdropHub'>
      <Container>
        <HeaderAction
          heading='Danh sách hồ sơ'
          action={
            <ButtonPrimary
              icon={<CirclePlus />}
              title='Thêm mới'
              onClick={handleClickOpen}
            />
          }
        />

        <ProfileFilterSearch
          // selectedStatusItems={selectedStatusItems}
          // onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
          // onClearSelectedStatusItems={() => setSelectedStatusItems([])}
          onClearAllSelectedItems={handleClearAllSelectedItems}
          search={search}
          onChangeSearch={handleChangeSearch}
          selected={selected}
          onAddOpenningIds={handleAddOpenningIds}
          onRemoveOpenningIds={handleRemoveOpenningIds}
          loadingIds={loadingIds}
          openningIds={openningIds}
        />

        <ProfileDataTableMemo
          pagination={pagination}
          onChangePage={handleChangePage}

          data={data}
          onUpdateData={handleUpdateData}
          onDeleteData={handleDeleteData}

          selected={selected}
          onSelectAllRows={handleSelectAllRows}
          onSelectRow={handleSelectRow}

          openningIds={openningIds}
          onAddOpenningId={handleAddOpenningId}
          onRemoveOpenningId={handleRemoveOpenningId}

          loadingIds={loadingIds}
          onAddLoadingId={handleAddLoadingId}
          onRemoveLoadingId={handleRemoveLoadingId}
        />

        <Modal
          isOpen={open}
          onClose={handleClose}
          title={"Thêm mới hồ sơ"}
          content={
            <ProfileNewEditForm
              onCloseModal={handleClose}
              onUpdateData={handleUpdateData}
            />
          }
        />

      </Container>
    </Page>
  )
}
