import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import useSpinner from '@/hooks/useSpinner';
import useMessage from '@/hooks/useMessage';
import useTable from '@/hooks/useTable';
import { delayApi } from '@/utils/commonUtil';
import DailyTaskFilterSearch from './DailyTaskFilterSearch';
import DailyTaskDataTable from './DailyTaskDataTable';
import { ButtonPrimary } from '@/components/Button';
import { ClipboardPlus } from 'lucide-react';
import DailyTaskNewEditForm from '../../new-edit/DailyTaskNewEditForm';

const DailyTaskDataTableMemo = React.memo(DailyTaskDataTable);

export default function DailyTaskList({ projectName = '', projectId = '' }) {
  const [open, setOpen] = useState(false); // modal
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const { onOpen, onClose } = useSpinner();
  const { onError } = useMessage();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const {
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
      const response = await apiGet(`/tasks/${projectId}`, params);
      console.log(response.data.data)

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

  const handleUpdateData = useCallback((onTrigger = () => { }) => {
    fetchApi(true, onTrigger)
  }, [
    search,
    page,
  ]);

  const handleDeleteData = useCallback((onTrigger = () => { }) => {
    fetchApi(true, () => {
      onTrigger();
    })
  }, [
    search,
    page,
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = useCallback((newPage) => {
    onChangePage(newPage)
  }, [])

  const handleChangeSearch = (value) => {
    setSearch(value);
    onChangePage(1);
  }

  const handleChangeSelectedStatus = (selected) => {
    setSelectedStatus(selected);
  };

  const handleClearAllSelectedItems = () => {
    setSearch('');
    setSelectedStatus('all');
    onChangePage(1);
  }

  useEffect(() => {
    fetchApi();
  }, [
    search,
    selectedStatus,
    page,
  ])

  return (
    <div className='overflow-hidden'>
      <DailyTaskFilterSearch
        action={
          <ButtonPrimary
            icon={<ClipboardPlus />}
            title='Thêm task'
            onClick={handleClickOpen}
          />
        }
        onClearAllSelectedItems={handleClearAllSelectedItems}
        search={search}
        onChangeSearch={handleChangeSearch}
        onChangeSelectedStatus={handleChangeSelectedStatus}
        selectedStatus={selectedStatus}
      />
      <DailyTaskDataTableMemo
        pagination={pagination}
        onChangePage={handleChangePage}

        data={data}
        onUpdateData={handleUpdateData}
        onDeleteData={handleDeleteData}

        projectName={projectName}
        projectId={projectId}
      />

      <Modal
        isOpen={open}
        onClose={handleClose}
        title={"Thêm mới task hằng ngày"}
        content={
          <DailyTaskNewEditForm
            projectName={projectName}
            projectId={projectId}
            onCloseModal={handleClose}
            onUpdateData={handleUpdateData}
          />
        }
      />
    </div>
  )
}
