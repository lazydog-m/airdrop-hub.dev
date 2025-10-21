import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { CirclePlus, ClipboardCheck, ClipboardList, ClipboardMinus, ClipboardX, List, ListFilter, NotepadText } from 'lucide-react';
import { ButtonGhost, ButtonOutlineTags } from '@/components/Button';
import { Color, StatusCommon } from '@/enums/enum';
import useDebounce from '@/hooks/useDebounce';
import TabsUi from '@/components/TabsUi';
import { DropdownCheckboxMenu } from '@/components/Checkbox';
import { convertStatusCommonEnumToColorHex, convertStatusCommonEnumToText, darkenColor, lightenColor } from '@/utils/convertUtil';
import { Badge } from '@/components/ui/badge';
import Popover from '@/components/Popover';

export default function ProjectTaskFilterSearch({
  selectedTab,
  onChangeSelectedTab = () => { },

  onClearAllSelectedItems = () => { },

  onChangeSearch = () => { },
  search = '',

  action = {},

  selectedStatusItems,
  onChangeSelectedStatusItems,
  onClearSelectedStatusItems,
}) {

  const [filterSearch, setFilterSearch] = useState('');

  const debounceValue = useDebounce(filterSearch, 500);

  useEffect(() => {
    onChangeSearch(debounceValue);
  }, [debounceValue]);

  const [filterTab, setFilterTab] = useState(selectedTab);

  const debounce = useDebounce(filterTab, 50);

  useEffect(() => {
    onChangeSelectedTab(debounce);
  }, [debounce]);

  const clearAll = () => {
    onClearAllSelectedItems();
    setFilterSearch('');
  }

  return (
    <div className="d-flex justify-content-between align-items-center gap-20">
      <div className="filter-search d-flex gap-10 items-center">
        <TabsUi
          tabs={tabs}
          selectedTab={filterTab}
          onChangeTab={(value) => setFilterTab(value)}
        />
        {/* <div className="filters-button d-flex gap-10"> */}
        {/*   <Popover className='button-dropdown-filter-checkbox' */}
        {/*     modalFilter */}
        {/*     trigger={ */}
        {/*       <ButtonOutlineTags */}
        {/*         title={statusFilters.name} */}
        {/*         icon={<CirclePlus />} */}
        {/*         className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex' */}
        {/*         selected={selectedStatusItems} */}
        {/*         tags={ */}
        {/*           <Tags */}
        {/*             selectedItems={selectedStatusItems} */}
        {/*             style={convertStatusCommonEnumToColorHex} */}
        {/*             convert={convertStatusCommonEnumToText} */}
        {/*           /> */}
        {/**/}
        {/*         } */}
        {/*       /> */}
        {/*     } */}
        {/*     content={ */}
        {/*       <DropdownCheckboxMenu */}
        {/*         convert={convertStatusCommonEnumToText} */}
        {/*         items={statusFilters.items} */}
        {/*         selectedItems={selectedStatusItems} */}
        {/*         onChangeSelectedItems={onChangeSelectedStatusItems} */}
        {/*         onClearSelectedItems={onClearSelectedStatusItems} */}
        {/*       /> */}
        {/*     } */}
        {/*   /> */}
        {/**/}
        {/* </div> */}
      </div>

      <div className="filter-search d-flex gap-10 items-center">
        {search &&
          <ButtonGhost
            icon={<ListFilter color={Color.ORANGE} />}
            onClick={clearAll}
          />
        }
        <Input
          placeholder='Tìm kiếm task ...'
          style={{ width: '250px' }}
          className='custom-input'
          value={filterSearch}
          onChange={(event) => setFilterSearch(event.target.value)}
        />
        {action}
      </div>
    </div>
  )
}

const tabs = [
  {
    name: "Tất Cả (10)",
    value: "all",
    icon: <List size={17.5} className='mt-0' />
  },
  {
    name: "Chưa hoàn thành (10)",
    value: "in_complete",
    icon: <ClipboardMinus size={17} />
  },
  {
    name: "Đã hoàn thành (0)",
    value: "completed",
    icon: <ClipboardCheck size={17} />
  },
  {
    name: "Ngừng hoạt động (0)",
    value: "un_active",
    icon: <ClipboardX size={17} />
  },
];

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
