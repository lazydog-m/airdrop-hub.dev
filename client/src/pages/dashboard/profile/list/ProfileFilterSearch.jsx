import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { CirclePause, CirclePlay, CirclePlus, Grip, ListFilter, Pause, Play } from 'lucide-react';
import Popover from "@/components/Popover";
import { ButtonGhost, ButtonOutline, ButtonOutlinePrimary, ButtonOutlineTags, ButtonPrimary } from '@/components/Button';
import { Color, StatusCommon } from '@/enums/enum';
import { Badge } from '@/components/ui/badge';
import useDebounce from '@/hooks/useDebounce';
import useSpinner from '@/hooks/useSpinner';
import { apiGet } from '@/utils/axios';
import useMessage from '@/hooks/useMessage';
import { convertStatusCommonEnumToColorHex, convertStatusCommonEnumToText, darkenColor, lightenColor } from '@/utils/convertUtil';
import { DropdownCheckboxMenu } from '@/components/Checkbox';

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
          placeholder='Tìm kiếm profiles ...'
          style={{ width: '250px' }}
          className='custom-input'
          value={filterSearch}
          onChange={(event) => setFilterSearch(event.target.value)}
        />

        {selected.length > 0 &&
          <>
            <ButtonPrimary
              style={{
                opacity: loadingIds.size > 0 ? '0.5' : '1',
                pointerEvents: loadingIds.size > 0 ? 'none' : '',
              }}
              onClick={handleOpenProfiles}
              icon={<Play />}
              title={'Mở'}
            />

            <ButtonOutlinePrimary
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

        <div className="filters-button d-flex gap-10">
          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={statusFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                selected={selectedStatusItems}
                tags={
                  <Tags
                    selectedItems={selectedStatusItems}
                    style={convertStatusCommonEnumToColorHex}
                    convert={convertStatusCommonEnumToText}
                  />

                }
              />
            }
            content={
              <DropdownCheckboxMenu
                convert={convertStatusCommonEnumToText}
                items={statusFilters.items}
                selectedItems={selectedStatusItems}
                onChangeSelectedItems={onChangeSelectedStatusItems}
                onClearSelectedItems={onClearSelectedStatusItems}
              />
            }
          />

          {(selectedStatusItems.length > 0 || search) &&
            <ButtonGhost
              icon={<ListFilter color={Color.ORANGE} />}
              onClick={clearAll}
            />
          }

        </div>


      </div>
    </div>
  )
}

const statusFilters = {
  name: 'Trạng thái',
  items: [
    StatusCommon.IN_ACTIVE, StatusCommon.UN_ACTIVE
  ],
};

const Tags = ({ selectedItems, style = () => { }, convert }) => {
  return (
    selectedItems.map((item) => {
      return (
        <Badge
          style={{
            backgroundColor: darkenColor(style(item)),
            borderColor: lightenColor(style(item)),
            color: 'white'
          }}
          className='text-capitalize fw-400 fs-12 bdr'
        >
          {convert ? convert(item) : item}
        </Badge>
      )
    })
  )
}
