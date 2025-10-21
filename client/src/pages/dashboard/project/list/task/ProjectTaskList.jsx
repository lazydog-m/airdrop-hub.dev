import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import useSpinner from '@/hooks/useSpinner';
import useMessage from '@/hooks/useMessage';
import useTable from '@/hooks/useTable';
import { delayApi } from '@/utils/commonUtil';
import ProjectTaskFilterSearch from './ProjectTaskFilterSearch';
import ProjectTaskDataTable from './ProjectTaskDataTable';
import { ButtonPrimary } from '@/components/Button';
import { ClipboardPlus } from 'lucide-react';
import ProjectTaskNewEditForm from '../../new-edit/ProjectTaskNewEditForm';
import { StatusCommon } from '@/enums/enum';

const ProjectTaskDataTableMemo = React.memo(ProjectTaskDataTable);

export default function ProjectTaskList({ project = {} }) {
  const [open, setOpen] = useState(false); // modal
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const { onOpen, onClose } = useSpinner();
  const { onError } = useMessage();

  const [search, setSearch] = useState('');
  const [selectedStatusItems, setSelectedStatusItems] = useState([StatusCommon.IN_ACTIVE]);
  const [selectedTab, setSelectedTab] = useState('all');

  const {
    page,
    onChangePage,
  } = useTable({});

  const fetchApi = async (dataTrigger = false, onTrigger = () => { }) => {
    const params = {
      page,
      search,
      selectedTab,
      selectedStatusItems,
    }

    try {
      if (!dataTrigger) {
        onOpen();
      }

      const response = await apiGet(`/tasks/${project?.id}`, params);
      console.log(response.data.data)

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

  const handleUpdateData = useCallback((onTrigger = () => { }) => {
    fetchApi(true, onTrigger)
  }, [
    search,
    page,
    selectedStatusItems,
    selectedTab,
  ]);

  const handleDeleteData = useCallback((onTrigger = () => { }) => {
    fetchApi(true, () => {
      onTrigger();
    })
  }, [
    search,
    page,
    selectedStatusItems,
    selectedTab,
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

  const handleChangeSelectedTab = (selected) => {
    setSelectedTab(selected);
    onChangePage(1);
  };

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

  useEffect(() => {
    fetchApi();
  }, [
    search,
    selectedTab,
    page,
    selectedStatusItems,
    selectedTab,
  ])

  return (
    <div className=''>
      <ProjectTaskFilterSearch
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

        onChangeSelectedTab={handleChangeSelectedTab}
        selectedTab={selectedTab}

        selectedStatusItems={selectedStatusItems}
        onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
        onClearSelectedStatusItems={() => setSelectedStatusItems([])}
      />
      <ProjectTaskDataTableMemo
        pagination={pagination}
        onChangePage={handleChangePage}

        data={data}
        onUpdateData={handleUpdateData}
        onDeleteData={handleDeleteData}

        projectName={project?.name}
        projectId={project?.id}
        projectDailyTaskRefresh={project?.daily_tasks_refresh}
      />

      <Modal
        isOpen={open}
        onClose={handleClose}
        title={"Thêm mới task hằng ngày"}
        content={
          <ProjectTaskNewEditForm
            projectName={project?.name}
            projectId={project?.id}
            onCloseModal={handleClose}
            onUpdateData={handleUpdateData}
          />
        }
      />
    </div>
  )
}
