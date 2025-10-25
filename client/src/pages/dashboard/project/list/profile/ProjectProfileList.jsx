import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import { apiDelete, apiGet, apiPost } from '@/utils/axios';
import useSpinner from '@/hooks/useSpinner';
import useMessage from '@/hooks/useMessage';
import useTable from '@/hooks/useTable';
import { delayApi } from '@/utils/commonUtil';
import ProjectProfileFilterSearch from './ProjectProfileFilterSearch';
import ProjectProfileDataTable from './ProjectProfileDataTable';
import { ButtonDanger, ButtonInfo, ButtonOrange, ButtonOutlinePrimary, ButtonPrimary } from '@/components/Button';
import { ClipboardPlus, LogIn, LogOut, UserMinus, UserPlus, UserRoundMinus, UserRoundPlus } from 'lucide-react';
import { StatusCommon } from '@/enums/enum';
import useConfirm from '@/hooks/useConfirm';

const ProjectProfileDataTableMemo = React.memo(ProjectProfileDataTable);

export default function ProjectProfileList({ project = {} }) {
  const [open, setOpen] = useState(false); // modal
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const { onOpen, onClose } = useSpinner();
  const { showLoading, swalClose } = useConfirm();
  const { onSuccess, onError } = useMessage();

  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('joined');

  const isTabFree = selectedTab === 'free';

  const {
    onSelectRow,
    selected,
    setSelected,
    onSelectAllRows,
    page,
    onChangePage,
  } = useTable({});

  const fetchApiByProject = async (dataTrigger = false, onTrigger = () => { }) => {
    const params = {
      page,
      search,
      resources: project?.resources || [],
      selectedTab,
    }

    try {
      if (!dataTrigger) {
        onOpen();
      }

      const response = await apiGet(`/project-profiles/${project?.id}`, params);
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

  const fetchApiByResources = async (dataTrigger = false, onTrigger = () => { }) => {
    const params = {
      page,
      search,
      resources: project?.resources || [],
      projectId: project?.id,
    }

    try {
      if (!dataTrigger) {
        onOpen();
      }

      const response = await apiGet(`/project-profiles/resources`, params);
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

  const handleSelectAllData = React.useCallback(() => {

    const idsByProject = async () => {
      const params = {
        selectedTab,
      }

      try {
        onOpen();
        const response = await apiGet(`/project-profiles/ids/${project?.id}`, params);
        console.log(response.data.data)

        delayApi(() => {
          setSelected(response.data.data || []);
          onClose();
        })

      } catch (error) {
        console.error(error);
        onError(error.message);
        onClose();
      }
    }

    const idsByResources = async () => {
      const params = {
        resources: project?.resources,
        projectId: project?.id,
      }

      try {
        onOpen();
        const response = await apiGet(`/project-profiles/ids/resources`, params);
        console.log(response.data.data)

        delayApi(() => {
          setSelected(response.data.data || []);
          onClose();
        })

      } catch (error) {
        console.error(error);
        onError(error.message);
        onClose();
      }
    }

    if (isTabFree) {
      idsByResources();
    }
    else {
      idsByProject();
    }
  }, [selectedTab])

  useEffect(() => {
    console.log(selected)
  }, [selected])

  const joinProfiles = async () => {
    const params = {
      profile_ids: selected,
      project_id: project?.id,
    }

    try {
      showLoading();
      const response = await apiPost("/project-profiles/multiple", params);
      const data = response.data.data;
      fetchApiByResources(true, () => {
        const dataIds = data.map(item => item.profile_id);
        const newSelected = selected.filter(id => !dataIds?.includes(id));
        setSelected(newSelected);
        onSuccess(`Tham gia dự án thành công!`);
        swalClose();
      })
    } catch (error) {
      console.error(error);
      onError(error.message);
      swalClose();
    }
  }

  const outProfiles = async () => {
    const params = {
      profile_ids: selected,
    }

    try {
      showLoading();
      const response = await apiDelete("/project-profiles/multiple", params);
      const data = response.data.data;
      fetchApiByProject(true, () => {
        const newSelected = selected.filter(id => !data?.includes(id));
        setSelected(newSelected);
        onSuccess(`Rời dự án thành công!`);
        swalClose();
      })
    } catch (error) {
      console.error(error);
      onError(error.message);
      swalClose();
    }
  }

  const handleClearAllData = React.useCallback(() => {
    setSelected([]);
  }, [])

  const handleSelectAllRows = React.useCallback((checked) => {
    const selecteds = data.map((row) => row.id);
    onSelectAllRows(checked, selecteds);
  }, [data])

  const handleSelectRow = React.useCallback((id) => {
    onSelectRow(id);
  }, [selected])

  const handleUpdateData = useCallback((id, onTrigger = () => { }, isUpdateSelected = true) => {
    if (isTabFree) {
      fetchApiByResources(true, () => {
        if (isUpdateSelected) {
          const newSelected = selected.filter(selected => selected !== id);
          setSelected(newSelected);
        }
        onTrigger();
      })
    }
    else {
      fetchApiByProject(true, () => {
        if (isUpdateSelected) {
          const newSelected = selected.filter(selected => selected !== id);
          setSelected(newSelected);
        }
        onTrigger();
      })
    }
  }, [
    search,
    page,
    selectedTab,
    selected,
  ]);

  const handleDeleteData = useCallback((id, onTrigger = () => { }) => {
    if (isTabFree) {
      fetchApiByResources(true, () => {
        const newSelected = selected.filter(selected => selected !== id);
        setSelected(newSelected);
        onTrigger();
      })
    }
    else {
      fetchApiByProject(true, () => {
        const newSelected = selected.filter(selected => selected !== id);
        setSelected(newSelected);
        onTrigger();
      })
    }
  }, [
    search,
    page,
    selectedTab,
    selected,
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
    setSelected([]);
  };

  const handleClearAllSelectedItems = () => {
    setSearch('');
    onChangePage(1);
  }

  useEffect(() => {
    if (isTabFree) {
      fetchApiByResources();
    }
    else {
      fetchApiByProject();
    }
  }, [
    search,
    selectedTab,
    page,
  ])

  return (
    <div className='overflow-hidden'>
      <ProjectProfileFilterSearch
        action={selected?.length > 0 && (isTabFree ?
          <ButtonInfo
            icon={<LogIn />}
            title={`Join`}
            onClick={joinProfiles}
          /> :
          <ButtonOrange
            icon={<LogOut />}
            title={`Out`}
            onClick={outProfiles}
          />
        )
        }
        projectName={project?.name || ''}
        pagination={pagination || {}}

        onClearAllSelectedItems={handleClearAllSelectedItems}

        search={search}
        onChangeSearch={handleChangeSearch}

        onChangeSelectedTab={handleChangeSelectedTab}
        selectedTab={selectedTab}

      // selectedStatusItems={selectedStatusItems}
      // onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
      // onClearSelectedStatusItems={() => setSelectedStatusItems([])}
      />

      <ProjectProfileDataTableMemo
        pagination={pagination}
        onChangePage={handleChangePage}

        data={data}
        onUpdateData={handleUpdateData}
        onDeleteData={handleDeleteData}

        projectId={project?.id}
        resources={project?.resources || []}

        selected={selected}
        onSelectAllRows={handleSelectAllRows}
        onSelectRow={handleSelectRow}

        onSelectAllData={handleSelectAllData}
        onClearAllData={handleClearAllData}
      />
    </div>
  )
}
