import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { CirclePlus, Grip, ListFilter, Pause, Play } from 'lucide-react';
import { CheckboxItems } from '@/components/Checkbox';
import Popover from "@/components/Popover";
import { ButtonGhost, ButtonOutline, ButtonOutlineDanger, ButtonOutlinePrimary, ButtonOutlineTags } from '@/components/Button';
import { Color, WalletStatus } from '@/enums/enum';
import { Badge } from '@/components/ui/badge';
import { convertWalletStatusEnumToColorHex, convertWalletStatusEnumToText } from '@/utils/convertUtil';
import useDebounce from '@/hooks/useDebounce';
import useSpinner from '@/hooks/useSpinner';
import { apiGet } from '@/utils/axios';
import useMessage from '@/hooks/useMessage';

export default function ProfileFilterSearch({
  selectedStatusItems,
  onChangeSelectedStatusItems,
  onClearSelectedStatusItems,
  onClearAllSelectedItems,
  search,
  onChangeSearch,
  selected = [],
  onAddOpenningIds,
  onRemoveOpenningIds,
  loadingIds = new Set(),
  openningIds = new Set(),
}) {

  const { onOpen, onClose } = useSpinner();
  const { onSuccess, onError } = useMessage();
  const [filterSearch, setFilterSearch] = useState('');

  const debounceValue = useDebounce(filterSearch, 500);

  useEffect(() => {
    onChangeSearch(debounceValue);
  }, [debounceValue]);

  const clearAll = () => {
    onClearAllSelectedItems();
    setFilterSearch('');
  }

  const openProfiles = async () => {
    const params = {
      ids: selected,
    }

    try {
      onOpen();
      const response = await apiGet("/profiles/open-multiple", params);
      const ids = response.data.data;
      onAddOpenningIds(ids);
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const closeProfiles = async () => {
    const params = {
      ids: selected,
    }

    try {
      onOpen();
      const response = await apiGet("/profiles/close-multiple", params);
      const ids = response.data.data;
      onRemoveOpenningIds(ids);
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const sortProfileLayouts = async () => {
    const params = {
      // ids: selected,
    }

    try {
      onOpen();
      const response = await apiGet("/profiles/sort-layout", params);
      // const ids = response.data.data;
      // onRemoveOpenningIds(ids);
      onClose();
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const handleOpenProfiles = () => {
    if (selected.length > 0) {
      openProfiles();
    }
  }

  const handleCloseProfiles = () => {
    if (selected.length > 0) {
      closeProfiles();
    }
  }

  const handleSortProfileLayout = () => {
    if (openningIds.size > 0) {
      sortProfileLayouts();
    }
  }

  return (
    <div className="mt-20 justify-content-between align-items-center">
      <div className="filter-search d-flex gap-10">
        <Input
          placeholder='Tìm kiếm hồ sơ ...'
          style={{ width: '220px' }}
          className='custom-input'
          value={filterSearch}
          onChange={(event) => setFilterSearch(event.target.value)}
        />

        {selected.length > 0 &&
          <>
            <ButtonOutlinePrimary
              style={{
                opacity: loadingIds.size > 0 ? '0.5' : '1',
                pointerEvents: loadingIds.size > 0 ? 'none' : '',
              }}
              onClick={handleOpenProfiles}
              icon={<Play color={Color.PRIMARY} />}
              title={'Mở'}
            />

            <ButtonOutlineDanger
              style={{
                opacity: loadingIds.size > 0 ? '0.5' : '1',
                pointerEvents: loadingIds.size > 0 ? 'none' : '',
              }}
              onClick={handleCloseProfiles}
              icon={<Pause />}
              title={'Đóng'}
            />

          </>
        }

        {openningIds.size > 0 &&
          <ButtonOutline
            style={{
              opacity: loadingIds.size > 0 ? '0.5' : '1',
              pointerEvents: loadingIds.size > 0 ? 'none' : '',
            }}
            onClick={handleSortProfileLayout}
            icon={<Grip />}
            title={'Sắp xếp'}
          />
        }

        {search &&
          <ButtonGhost
            icon={<ListFilter color={Color.ORANGE} />}
            onClick={clearAll}
          // title={
          //   <span style={{ color: Color.ORANGE }}>Làm mới</span>
          // }
          />
        }

        {/*
        <div className="filters-button d-flex gap-10">
          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={statusFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                selected={selectedStatusItems}
                tags={
                  <Tags selectedItems={selectedStatusItems} style={convertWalletStatusEnumToColorHex} convert={convertWalletStatusEnumToText} />

                }
              />
            }
            content={
              <CheckboxItems
                convert={convertWalletStatusEnumToText}
                items={statusFilters.items}
                selectedItems={selectedStatusItems}
                onChangeSelectedItems={onChangeSelectedStatusItems}
                onClearSelectedItems={onClearSelectedStatusItems}
              />
            }
          />

        </div>
*/}
      </div>
    </div>
  )
}

const statusFilters = {
  name: 'Trạng thái',
  items: [
    WalletStatus.IN_ACTIVE, WalletStatus.UN_ACTIVE
  ],
};

const Tags = ({ selectedItems, style = () => { }, convert }) => {
  return (
    selectedItems.map((item) => {
      return (
        <Badge
          style={{ backgroundColor: style(item) }}
          className='text-capitalize font-inter fw-400 fs-12'
        >
          {convert ? convert(item) : item}
        </Badge>
      )
    })
  )
}
