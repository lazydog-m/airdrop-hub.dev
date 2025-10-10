import React, { useState, useEffect, useCallback } from 'react';
import { ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus, FolderPlus } from 'lucide-react';
import ProjectFilterSearch from "./ProjectFilterSearch";
import ProjectDataTable from './ProjectDataTable';
import Modal from '@/components/Modal';
import ProjectNewEditForm from '../new-edit/ProjectNewEditForm';
import { apiGet } from '@/utils/axios';
import { ProjectStatus } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import useMessage from '@/hooks/useMessage';
import useTable from '@/hooks/useTable';
import { delayApi } from '@/utils/commonUtil';

const ProjectDataTableMemo = React.memo(ProjectDataTable);

export default function ProjectList() {
  const [open, setOpen] = useState(false); // modal
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const { onOpen, onClose } = useSpinner();
  const { onError } = useMessage();
  const sortDate = 'Ngày Làm DESC';

  const [search, setSearch] = useState('');
  const [selectedStatusItems, setSelectedStatusItems] = useState([ProjectStatus.DOING]);
  const [selectedTypeItems, setSelectedTypeItems] = useState([]);
  const [selectedCheatItems, setSelectedCheatItems] = useState([]);
  const [selectedTaskItems, setSelectedTaskItems] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedSortDate, setSelectedSortDate] = useState(sortDate);

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
      selectedTypeItems,
      selectedStatusItems,
      selectedTask,
      selectedTaskItems,
      selectedSortDate,
      page,
      search,
    }

    try {
      onOpen();
      const response = await apiGet("/projects", params);
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

  const handleSelectAllRows = React.useCallback((checked) => {
    const selecteds = data.map((row) => row.id);
    onSelectAllRows(checked, selecteds);
  }, [data])

  const handleSelectRow = React.useCallback((id) => {
    onSelectRow(id);
  }, [selected])

  const handleUpdateData = useCallback((onTrigger = () => { }) => {
    fetchApi(true, onTrigger);
    // setData((prevData) =>
    //   prevData.map((project) =>
    //     project.id === projectNew.id ? projectNew : project
    //   )
    // );
  }, [
    selectedStatusItems,
    selectedTypeItems,
    selectedSortDate,
    selectedTaskItems,
    selectedTask,
    search,
    page,
  ]);

  const handleDeleteData = useCallback((id, onTrigger = () => { }) => {
    fetchApi(true, () => {
      const newSelected = selected.filter(selected => selected !== id);
      setSelected(newSelected);
      onTrigger();
    })
  }, [
    selectedStatusItems,
    selectedTypeItems,
    selectedSortDate,
    selectedTaskItems,
    selectedTask,
    search,
    page,
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

  const handleChangeSelectedTypeItems = (label, isChecked) => {
    setSelectedTypeItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    onChangePage(1);
  };

  const handleChangeSelectedTaskItems = (label, isChecked) => {
    setSelectedTaskItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    onChangePage(1);
  };

  const handleChangeSelectedCheatItems = (label, isChecked) => {
    setSelectedCheatItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    onChangePage(1);
  };

  const handleChangeSelectedSortDate = React.useCallback((selected) => {
    setSelectedSortDate(selected);
  }, []);

  const handleChangeSelectedTask = (selected) => {
    if (selected !== selectedTask) {
      setSelectedTask(selected);
      setSelectedTaskItems([]);
      onChangePage(1);
    }
  };

  const handleClearAllSelectedItems = () => {
    setSelectedTypeItems([]);
    setSelectedStatusItems([]);
    setSelectedTask(null);
    setSelectedTaskItems([]);
    setSelectedSortDate(sortDate);
    setSearch('');
    onChangePage(1);
  }

  useEffect(() => {
    fetchApi();
  }, [
    selectedStatusItems,
    selectedTypeItems,
    selectedSortDate,
    selectedTaskItems,
    selectedTask,
    search,
    page,
  ])

  return (
    <Page title='Dự án'>
      <Container>

        <HeaderAction
          heading='Danh sách dự án'
          action={
            <ButtonPrimary
              icon={<FolderPlus />}
              title='Thêm dự án'
              onClick={handleClickOpen}
            />
          }
        />

        <ProjectFilterSearch
          selectedStatusItems={selectedStatusItems}
          onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
          onClearSelectedStatusItems={() => setSelectedStatusItems([])}

          selectedTypeItems={selectedTypeItems}
          onChangeSelectedTypeItems={handleChangeSelectedTypeItems}
          onClearSelectedTypeItems={() => setSelectedTypeItems([])}

          selectedTaskItems={selectedTaskItems}
          onChangeSelectedTaskItems={handleChangeSelectedTaskItems}
          onClearSelectedTaskItems={() => setSelectedTaskItems([])}

          selectedCheatItems={selectedCheatItems}
          onChangeSelectedCheatItems={handleChangeSelectedCheatItems}
          onClearSelectedCheatItems={() => setSelectedCheatItems([])}

          selectedTask={selectedTask}
          onChangeSelectedTask={handleChangeSelectedTask}
          onClearSelectedTask={() => setSelectedTask(null)}

          onClearAllSelectedItems={handleClearAllSelectedItems}
          search={search}
          onChangeSearch={handleChangeSearch}
        />

        <ProjectDataTableMemo
          pagination={pagination}
          onChangePage={handleChangePage}

          data={data}
          onUpdateData={handleUpdateData}
          onDeleteData={handleDeleteData}

          selected={selected}
          onSelectAllRows={handleSelectAllRows}
          onSelectRow={handleSelectRow}

          selectedSortDate={selectedSortDate}
          onChangeSelectedSortDate={handleChangeSelectedSortDate}
        />

        <Modal
          isOpen={open}
          onClose={handleClose}
          title={"Thêm mới dự án"}
          content={
            <ProjectNewEditForm
              onCloseModal={handleClose}
              onUpdateData={handleUpdateData}
            />
          }
        />

      </Container>
    </Page>
  )
}
