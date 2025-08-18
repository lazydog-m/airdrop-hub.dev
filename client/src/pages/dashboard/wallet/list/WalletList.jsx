import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonDanger, ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus, DatabaseZap, Trash2Icon } from 'lucide-react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import { CURRENT_DATA_TYPE, TRASH_DATA_TYPE, WalletStatus } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import WalletNewEditForm from '../create/WalletNewEditForm';
import WalletDataTable from './WalletDataTable';
import WalletFilterSearch from './WalletFilterSearch';
import useMessage from '@/hooks/useMessage';
import useTable from '@/hooks/useTable';
import { delayApi } from '@/utils/commonUtil';

const WalletDataTableMemo = React.memo(WalletDataTable);

export default function WalletList() {
  // const [dataType, setDataType] = useState(CURRENT_DATA_TYPE);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const { onOpen, onClose } = useSpinner();
  const { onError } = useMessage();

  const [selectedStatusItems, setSelectedStatusItems] = useState([WalletStatus.IN_ACTIVE]);
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
      // dataType,
      page,
      search,
    }

    try {
      onOpen();
      const response = await apiGet("/wallets", params);

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
        setTimeout(() => {
        }, 100)
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

  const handleUpdateData = useCallback((isEdit, walletNew, onTrigger = () => { }) => {
    if (!isEdit) {
      fetchApi(true, onTrigger)
    }
    else {
      setData((prevData) =>
        prevData.map((wallet) =>
          wallet.id === walletNew.id ? walletNew : wallet
        )
      );
    }
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
  }, [selectedStatusItems,/*  dataType, */ search, page])

  return (
    <Page title='Quản lý ví - AirdropHub'>
      <Container>

        <HeaderAction
          heading='Danh sách ví'
          action={
            <ButtonPrimary
              icon={<CirclePlus />}
              title='Thêm mới'
              onClick={handleClickOpen}
            />
          }
        />

        <WalletFilterSearch
          selectedStatusItems={selectedStatusItems}
          onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
          onClearSelectedStatusItems={() => setSelectedStatusItems([])}
          onClearAllSelectedItems={handleClearAllSelectedItems}
          onChangeSearch={handleChangeSearch}
          search={search}
        />

        <WalletDataTableMemo
          // dataType={dataType}
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
          title={"Thêm mới ví"}
          content={
            <WalletNewEditForm
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
