import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { CirclePlus, ListFilter } from 'lucide-react';
import { CheckboxItems } from '@/components/Checkbox';
import Popover from "@/components/Popover";
import { ButtonGhost, ButtonOutlineTags } from '@/components/Button';
import { Color, WalletStatus } from '@/enums/enum';
import { Badge } from '@/components/ui/badge';
import { convertWalletStatusEnumToColorHex, convertWalletStatusEnumToText } from '@/utils/convertUtil';
import useDebounce from '@/hooks/useDebounce';

export default function ProfileWalletFilterSearch({
  selectedStatusItems,
  onChangeSelectedStatusItems,
  onClearSelectedStatusItems,
  onClearAllSelectedItems,
  search,
  onChangeSearch,
  action
}) {

  const [filterSearch, setFilterSearch] = useState('');

  const debounceValue = useDebounce(filterSearch, 500);

  useEffect(() => {
    onChangeSearch(debounceValue);
  }, [debounceValue]);

  const clearAll = () => {
    onClearAllSelectedItems();
    setFilterSearch('');
  }

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="filter-search d-flex gap-10">
        <Input
          placeholder='Tìm kiếm địa chỉ ví ...'
          style={{ width: '200px' }}
          className='custom-input'
          value={filterSearch}
          onChange={(event) => setFilterSearch(event.target.value)}
        />

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

      {action}
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
