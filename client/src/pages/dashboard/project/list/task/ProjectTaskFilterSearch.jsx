import { useState, useEffect } from 'react';
import { Award, CalendarClock, CalendarDays, CircleUserRound, ClipboardCheck, ClipboardMinus, ClipboardX, Gift, ListFilter, Twitter } from 'lucide-react';
import { ButtonGhost } from '@/components/Button';
import { Color, StatusCommon } from '@/enums/enum';
import useDebounce from '@/hooks/useDebounce';
import { TabsUi1, TabsUi } from '@/components/TabsUi';
import { darkenColor, lightenColor } from '@/utils/convertUtil';
import { Badge } from '@/components/ui/badge';
import InputUi from '@/components/InputUi';

export default function ProjectTaskFilterSearch({
  selectedStatusTab,
  onChangeSelectedStatusTab = () => { },

  selectedTaskTab,
  onChangeSelectedTaskTab = () => { },

  onClearAllSelectedItems = () => { },

  onChangeSearch = () => { },
  search = '',

  action = {},
  daily,

  selectedStatusItems,
  onChangeSelectedStatusItems,
  onClearSelectedStatusItems,
}) {

  const [filterSearch, setFilterSearch] = useState('');

  const debounceValue = useDebounce(filterSearch, 500);

  useEffect(() => {
    onChangeSearch(debounceValue);
  }, [debounceValue]);

  const [filterStatusTab, setFilterStatusTab] = useState(selectedStatusTab);
  const [filterTaskTab, setFilterTaskTab] = useState(selectedTaskTab);

  const debounceStatusTab = useDebounce(filterStatusTab, 50);
  const debounceTaskTab = useDebounce(filterTaskTab, 50);

  useEffect(() => {
    onChangeSelectedTaskTab(debounceTaskTab);
  }, [debounceTaskTab]);

  useEffect(() => {
    onChangeSelectedStatusTab(debounceStatusTab);
  }, [debounceStatusTab]);

  const clearAll = () => {
    onClearAllSelectedItems();
    setFilterSearch('');
  }

  return (
    <>
      <div className="filter-search d-flex gap-10 items-center justify-between mt-2">
        <TabsUi
          tabs={taskTabs}
          selectedTab={filterTaskTab}
          onChangeTab={(value) => setFilterTaskTab(value)}
        />
        <div className="filter-search d-flex gap-10 items-center">
          {search &&
            <ButtonGhost
              icon={<ListFilter color={Color.ORANGE} />}
              onClick={clearAll}
            />
          }
          <InputUi
            placeholder='Tìm kiếm task ...'
            style={{ width: '250px' }}
            className='custom-input'
            value={filterSearch}
            onChange={(event) => setFilterSearch(event.target.value)}
          />
          {action}
        </div>
      </div>
      {selectedTaskTab !== 'reg' &&
        <div className="d-flex justify-content-between align-items-center gap-20 mt-0.5">
          <div className="filter-search d-flex gap-10 items-center">
            <TabsUi1
              tabs={statusTabs}
              selectedTab={filterStatusTab}
              onChangeTab={(value) => setFilterStatusTab(value)}
            />
          </div>
        </div>
      }
    </>
  )
}

const statusTabs = [
  {
    name: "Chưa hoàn thành",
    value: "in_complete",
    // total: pagination?.totalItemsFree || 0,
    icon: <ClipboardMinus size={17} />
  },
  {
    name: "Đã hoàn thành",
    value: "completed",
    // total: pagination?.totalItemsFree || 0,
    icon: <ClipboardCheck size={17} />
  },
  {
    name: "Ngừng hoạt động",
    value: "un_active",
    // total: pagination?.totalItemsFree || 0,
    icon: <ClipboardX size={17} />
  },
];

const taskTabs = [
  {
    name: "Reg/Login",
    value: "reg",
    // total: pagination?.totalItemsFree || 0,
    icon: <CircleUserRound size={17.5} className='mt-0' />
  },
  {
    name: "Daily",
    value: "daily",
    // total: pagination?.totalItemsFree || 0,
    icon: <CalendarClock size={17.5} className='mt-0' />
  },
  {
    name: "Points/Connect",
    value: "points",
    // total: pagination?.totalItemsFree || 0,
    icon: <Twitter size={17.5} className='mt-0' />
  },
  {
    name: "Off-chain",
    value: "off_chain",
    // total: pagination?.totalItemsFree || 0,
    icon: <Award size={17.5} className='mt-0' />
  },
  {
    name: "Airdrop",
    value: "airdrop",
    // total: pagination?.totalItemsFree || 0,
    icon: <Gift size={18} className='mt-0' />
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
{/* <div className="filters-button d-flex gap-10"> */ }
{/*   <Popover className='button-dropdown-filter-checkbox' */ }
{/*     modalFilter */ }
{/*     trigger={ */ }
{/*       <ButtonOutlineTags */ }
{/*         title={statusFilters.name} */ }
{/*         icon={<CirclePlus />} */ }
{/*         className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex' */ }
{/*         selected={selectedStatusItems} */ }
{/*         tags={ */ }
{/*           <Tags */ }
{/*             selectedItems={selectedStatusItems} */ }
{/*             style={convertStatusCommonEnumToColorHex} */ }
{/*             convert={convertStatusCommonEnumToText} */ }
{/*           /> */ }
{/**/ }
{/*         } */ }
{/*       /> */ }
{/*     } */ }
{/*     content={ */ }
{/*       <DropdownCheckboxMenu */ }
{/*         convert={convertStatusCommonEnumToText} */ }
{/*         items={statusFilters.items} */ }
{/*         selectedItems={selectedStatusItems} */ }
{/*         onChangeSelectedItems={onChangeSelectedStatusItems} */ }
{/*         onClearSelectedItems={onClearSelectedStatusItems} */ }
{/*       /> */ }
{/*     } */ }
{/*   /> */ }
{/**/ }
{/* </div> */ }
