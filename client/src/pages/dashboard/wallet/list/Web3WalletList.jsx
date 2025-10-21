import React, { useState, useEffect, useCallback } from 'react';
import { ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import { StatusCommon } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import Web3WalletNewEditForm from '../new-edit/Web3WalletNewEditForm';
import Web3WalletDataTable from './Web3WalletDataTable';
import Web3WalletFilterSearch from './Web3WalletFilterSearch';
import useMessage from '@/hooks/useMessage';
import useTable from '@/hooks/useTable';
import { delayApi } from '@/utils/commonUtil';

const Web3WalletDataTableMemo = React.memo(Web3WalletDataTable);

export default function Web3WalletList() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const { onOpen, onClose } = useSpinner();
  const { onError } = useMessage();

  const [selectedStatusItems, setSelectedStatusItems] = useState([StatusCommon.IN_ACTIVE]);
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
      selectedStatusItems,
      page,
      search,
    }

    try {
      if (!dataTrigger) {
        onOpen();
      }
      const response = await apiGet("/web3-wallets", params);

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
  }, [search, page, selectedStatusItems]);

  const handleDeleteData = useCallback((id, onTrigger = () => { }) => {
    fetchApi(true, () => {
      const newSelected = selected.filter(selected => selected !== id);
      setSelected(newSelected);
      onTrigger();
    })
  }, [search, page, selectedStatusItems, selected]);

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

  useEffect(() => {
    fetchApi();
  }, [selectedStatusItems, search, page])

  return (
    <Page title='Ví Web3'>
      <Container>

        <HeaderAction
          heading='Danh sách ví Web3'
          action={
            <ButtonPrimary
              icon={<Plus strokeWidth={2.5} />}
              title='Thêm ví Web3'
              onClick={handleClickOpen}
            />
          }
        />

        <Web3WalletFilterSearch
          selectedStatusItems={selectedStatusItems}
          onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
          onClearSelectedStatusItems={() => setSelectedStatusItems([])}

          onClearAllSelectedItems={handleClearAllSelectedItems}

          onChangeSearch={handleChangeSearch}
          search={search}
        />

        <Web3WalletDataTableMemo
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
          width={800}
          size='md'
          isOpen={open}
          onClose={handleClose}
          title={"Thêm mới ví Web3"}
          content={
            <Web3WalletNewEditForm
              onCloseModal={handleClose}
              onUpdateData={handleUpdateData}
            />
          }
        />

      </Container>
    </Page>
  )
}
{/*
            <div className='d-flex gap-10'>
              <ButtonDanger
                icon={dataType === TRASH_DATA_TYPE ? <DatabaseZap /> : <Trash2Icon />}
                title={dataType === TRASH_DATA_TYPE ? 'Data hiện tại' : 'Thùng rác'}
                onClick={() => setDataType((prev) => prev === TRASH_DATA_TYPE ? CURRENT_DATA_TYPE : TRASH_DATA_TYPE)}
              />
            </div>
*/}
