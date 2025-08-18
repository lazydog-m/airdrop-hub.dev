import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { CirclePlus, ListFilter } from 'lucide-react';
import { CheckboxItems } from '@/components/Checkbox';
import Popover from "@/components/Popover";
import { ButtonGhost, ButtonOutlineTags } from '@/components/Button';
import { Color, ProjectCost, ProjectStatus, ProjectType } from '@/enums/enum';
import { Badge } from '@/components/ui/badge';
import { convertProjectCostTypeEnumToColorHex, convertProjectFilterOtherToColorHex, convertProjectStatusEnumToColorHex, convertProjectStatusEnumToText, convertProjectTypeEnumToColorHex, darkenColor, lightenColor } from '@/utils/convertUtil';
import useDebounce from '@/hooks/useDebounce';
import { Tooltip } from 'antd';
import TooltipDefault from '@/components/TooltipDefault';

export default function ProjectFilterSearch({
  selectedStatusItems,
  onChangeSelectedStatusItems,
  onClearSelectedStatusItems,

  selectedTypeItems,
  onChangeSelectedTypeItems,
  onClearSelectedTypeItems,

  selectedCostItems,
  onChangeSelectedCostItems,
  onClearSelectedCostItems,

  selectedOtherItems,
  onChangeSelectedOtherItems,
  onClearSelectedOtherItems,

  onClearAllSelectedItems,
  onChangeSearch,
  search,
}) {

  // alert(darkenColor("#fd5c63"))

  // const [openSort, setOpenSort] = useState(false);

  // const handleChangeSelectedSort = (selected) => {
  //   onChangeSelectedSort(selected);
  //
  //   setTimeout(() => {
  //     setOpenSort(false);
  //   }, 50);
  // }

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
    <div className="d-flex mt-20 justify-content-between align-items-center">
      <div className="filter-search d-flex gap-10">
        <Input
          placeholder='Tìm kiếm dự án ...'
          style={{ width: '220px' }}
          className='custom-input'
          value={filterSearch}
          onChange={(event) => setFilterSearch(event.target.value)}
        />

        <div className="filters-button d-flex gap-10">
          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={typeFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                selected={selectedTypeItems}
                tags={
                  <Tags selectedItems={selectedTypeItems} style={convertProjectTypeEnumToColorHex} />
                }
              />
            }
            content={
              <CheckboxItems
                minWidth={180}
                items={typeFilters.items}
                selectedItems={selectedTypeItems}
                onChangeSelectedItems={onChangeSelectedTypeItems}
                onClearSelectedItems={onClearSelectedTypeItems}
              />
            }
          />

          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={costFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                selected={selectedCostItems}
                tags={
                  <Tags selectedItems={selectedCostItems} style={convertProjectCostTypeEnumToColorHex} />

                }
              />
            }
            content={
              <CheckboxItems
                minWidth={150}
                items={costFilters.items}
                selectedItems={selectedCostItems}
                onChangeSelectedItems={onChangeSelectedCostItems}
                onClearSelectedItems={onClearSelectedCostItems}
              />
            }
          />

          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={statusFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                selected={selectedStatusItems}
                tags={
                  <Tags selectedItems={selectedStatusItems} style={convertProjectStatusEnumToColorHex} convert={convertProjectStatusEnumToText} />

                }
              />
            }
            content={
              <CheckboxItems
                convert={convertProjectStatusEnumToText}
                items={statusFilters.items}
                selectedItems={selectedStatusItems}
                onChangeSelectedItems={onChangeSelectedStatusItems}
                onClearSelectedItems={onClearSelectedStatusItems}
              />
            }
          />

          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                showTagOne={true}
                title={otherFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                selected={selectedOtherItems}
                tags={
                  <Tags selectedItems={selectedOtherItems} style={convertProjectFilterOtherToColorHex} />
                }
              />
            }
            content={
              <CheckboxItems
                items={otherFilters.items}
                selectedItems={selectedOtherItems}
                onChangeSelectedItems={onChangeSelectedOtherItems}
                onClearSelectedItems={onClearSelectedOtherItems}
              />
            }
          />

          {(selectedStatusItems.length > 0 || selectedTypeItems.length > 0 || selectedCostItems.length > 0 || selectedOtherItems.length > 0 || search) &&
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
    ProjectStatus.DOING,
    ProjectStatus.END_PENDING_UPDATE,
    ProjectStatus.SNAPSHOT,
    ProjectStatus.TGE,
    ProjectStatus.END_AIRDROP
  ],
};

const otherFilters = {
  name: 'Khác',
  items: [
    'Làm Hằng Ngày',
    'Làm Mới 7 Giờ Sáng',
    'Chưa Làm Hôm Nay',
    'Cheat',
  ],
};

const typeFilters = {
  name: 'Mảng',
  items: [ProjectType.WEB, ProjectType.TESTNET, ProjectType.DEPIN, ProjectType.RETROACTIVE, ProjectType.GAME, ProjectType.GALXE],
};

const costFilters = {
  name: 'Chi phí',
  items: [ProjectCost.FREE, ProjectCost.FEE, ProjectCost.HOLD],
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
