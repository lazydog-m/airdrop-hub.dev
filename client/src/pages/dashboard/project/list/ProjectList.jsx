import React, { useState, useEffect, useCallback } from 'react';
import { ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus } from 'lucide-react';
import ProjectFilterSearch from "./ProjectFilterSearch";
import ProjectDataTable from './ProjectDataTable';
import Modal from '@/components/Modal';
import ProjectNewEditForm from '../create/ProjectNewEditForm';
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

  const [search, setSearch] = useState('');
  const [selectedStatusItems, setSelectedStatusItems] = useState([ProjectStatus.DOING]);
  const [selectedTypeItems, setSelectedTypeItems] = useState([]);
  const [selectedCostItems, setSelectedCostItems] = useState([]);
  const [selectedOtherItems, setSelectedOtherItems] = useState([]);

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
      selectedCostItems,
      selectedTypeItems,
      selectedOtherItems,
      selectedStatusItems,
      page,
      search,
    }

    try {
      onOpen();
      const response = await apiGet("/projects", params);

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

  const handleUpdateData = useCallback((isEdit, projectNew, onTrigger = () => { }) => {
    if (!isEdit) {
      fetchApi(true, onTrigger)
    }
    else {
      setData((prevData) =>
        prevData.map((project) =>
          project.id === projectNew.id ? projectNew : project
        )
      );
    }
  }, [selectedStatusItems, selectedOtherItems, selectedTypeItems, selectedCostItems, search, page]);

  const handleDeleteData = useCallback((id, onTrigger = () => { }) => {
    fetchApi(true, () => {
      const newSelected = selected.filter(selected => selected !== id);
      setSelected(newSelected);
      onTrigger();
    })
  }, [selectedStatusItems, selectedOtherItems, selectedTypeItems, selectedCostItems, search, page, selected]);

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

  const handleChangeSelectedCostItems = (label, isChecked) => {
    setSelectedCostItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    onChangePage(1);
  };

  const handleChangeSelectedOtherItems = (label, isChecked) => {
    setSelectedOtherItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    onChangePage(1);
  };

  const handleClearAllSelectedItems = () => {
    setSelectedTypeItems([]);
    setSelectedStatusItems([]);
    setSelectedCostItems([]);
    setSelectedOtherItems([]);
    setSearch('');
    onChangePage(1);
  }

  useEffect(() => {
    fetchApi();
  }, [selectedStatusItems, selectedOtherItems, selectedTypeItems, selectedCostItems, search, page])

  return (
    <Page title='Quản lý dự án - AirdropHub'>
      <Container>

        <HeaderAction
          heading='Danh sách dự án'
          action={
            <ButtonPrimary
              icon={<CirclePlus />}
              title='Thêm mới'
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

          selectedCostItems={selectedCostItems}
          onChangeSelectedCostItems={handleChangeSelectedCostItems}
          onClearSelectedCostItems={() => setSelectedCostItems([])}

          selectedOtherItems={selectedOtherItems}
          onChangeSelectedOtherItems={handleChangeSelectedOtherItems}
          onClearSelectedOtherItems={() => setSelectedOtherItems([])}

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
