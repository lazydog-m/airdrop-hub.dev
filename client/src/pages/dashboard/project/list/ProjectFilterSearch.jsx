import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { CirclePlus, ListFilter } from 'lucide-react';
import { DropdownCheckboxMenu } from '@/components/Checkbox';
import Popover from "@/components/Popover";
import { ButtonGhost, ButtonOutlineTags } from '@/components/Button';
import { Color, DAILY_TASK_TEXT, PROJECT_STATUS_ARR, PROJECT_TYPE_ARR } from '@/enums/enum';
import { Badge } from '@/components/ui/badge';
import { convertProjectStatusEnumToColorHex, convertProjectStatusEnumToText, convertProjectTaskItemsToColorHex, convertProjectTypeEnumToColorHex, darkenColor, lightenColor } from '@/utils/convertUtil';
import useDebounce from '@/hooks/useDebounce';
import { RiTodoLine } from 'react-icons/ri';
import InputUi from '@/components/InputUi';

export default function ProjectFilterSearch({
  selectedStatusItems = [],
  onChangeSelectedStatusItems,
  onClearSelectedStatusItems,

  selectedTypeItems = [],
  onChangeSelectedTypeItems,
  onClearSelectedTypeItems,

  selectedTaskItems = [],
  onChangeSelectedTaskItems,
  onClearSelectedTaskItems,

  selectedCheatItems = [],
  onChangeSelectedCheatItems,
  onClearSelectedCheatItems,

  selectedTask,
  onChangeSelectedTask,
  onClearSelectedTask,

  onClearAllSelectedItems,
  onChangeSearch,
  search,
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

  const taskFilters = {
    onChange: onChangeSelectedTask,
    selected: selectedTask,
    items: [
      {
        header: DAILY_TASK_TEXT,
        icon: <RiTodoLine size={'16px'} />,
        children: [
          'UTC+0',
          'CD-24',
          'Chưa Hoàn Thành',
          // 'Todo > 0',
        ]
      },
      {
        header: 'Task dự án',
        icon: <RiTodoLine size={'16px'} />,
        children: [
          'Đến Hạn',
          'Chưa Làm',
        ]
      }
    ]
  };


  return (
    <div className="d-flex mt-20 justify-content-between align-items-center gap-20">
      <div className="filter-search d-flex gap-10">
        <InputUi
          placeholder='Tìm kiếm dự án ...'
          style={{ width: '250px' }}
          className='custom-input'
          value={filterSearch}
          onChange={(event) => setFilterSearch(event.target.value)}
        />

        <Popover className='button-dropdown-filter-checkbox'
          trigger={
            <ButtonOutlineTags
              title={typeFilters.name}
              icon={<CirclePlus />}
              className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
              selected={selectedTypeItems}
              tags={
                <Tags
                  selectedItems={selectedTypeItems}
                  style={convertProjectTypeEnumToColorHex}
                />
              }
            />
          }
          content={
            <DropdownCheckboxMenu
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
              title={statusFilters.name}
              icon={<CirclePlus />}
              className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
              selected={selectedStatusItems}
              tags={
                <Tags
                  selectedItems={selectedStatusItems}
                  style={convertProjectStatusEnumToColorHex}
                  convert={convertProjectStatusEnumToText}
                />

              }
            />
          }
          content={
            <DropdownCheckboxMenu
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
              title={profileFilters.name}
              icon={<CirclePlus />}
              className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
              // selected={selectedStatusItems}
              tags={
                <Tags
                // selectedItems={selectedStatusItems}
                // style={convertProjectStatusEnumToColorHex}
                // convert={convertProjectStatusEnumToText}
                />

              }
            />
          }
          content={
            <DropdownCheckboxMenu
              // convert={convertProjectStatusEnumToText}
              items={profileFilters.items}
            // selectedItems={selectedStatusItems}
            // onChangeSelectedItems={onChangeSelectedStatusItems}
            // onClearSelectedItems={onClearSelectedStatusItems}
            />
          }
        />

        <Popover className='button-dropdown-filter-checkbox'
          trigger={
            <ButtonOutlineTags
              title={selectedTask || 'Task'}
              icon={<CirclePlus />}
              // showTagOne
              className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
              selected={selectedTaskItems}
              tags={
                <Tags
                  selectedItems={selectedTaskItems}
                  style={convertProjectTaskItemsToColorHex}
                />

              }
            />
          }
          content={
            <DropdownCheckboxMenu
              tag
              minWidth={selectedTask ? '202px' : '180px'}
              filterSelect={taskFilters}
              selectedItems={selectedTaskItems}
              onChangeSelectedItems={onChangeSelectedTaskItems}
              onClearSelectedItems={() => {
                onClearSelectedTask();
                onClearSelectedTaskItems();
              }}
            />
          }
        />

        {(selectedStatusItems.length > 0 || selectedTypeItems.length > 0 || selectedTask || search) &&
          <ButtonGhost
            icon={<ListFilter color={Color.ORANGE} />}
            onClick={clearAll}
          />
        }

      </div>
    </div>
  )
}

const statusFilters = {
  name: 'Trạng thái',
  items: [
    ...PROJECT_STATUS_ARR
  ],
};

const typeFilters = {
  name: 'Mảng',
  items: [
    ...PROJECT_TYPE_ARR
  ],
};


const profileFilters = {
  name: 'Profiles',
  items: [
    'Chưa Join',
    'Chưa Reg',
  ],
};

const Tags = ({ selectedItems, style = () => { }, convert }) => {
  return (
    selectedItems.map((item, index) => {
      return (
        <Badge
          key={index}
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

