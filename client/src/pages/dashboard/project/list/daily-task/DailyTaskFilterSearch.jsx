import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ListFilter } from 'lucide-react';
import { ButtonGhost } from '@/components/Button';
import { Color } from '@/enums/enum';
import useDebounce from '@/hooks/useDebounce';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function DailyTaskFilterSearch({
  selectedStatus = '',
  onChangeSelectedStatus = () => { },

  onClearAllSelectedItems = () => { },
  onChangeSearch = () => { },
  search = '',

  action = {},
}) {

  const [filterSearch, setFilterSearch] = useState('');
  const [status, setStatus] = useState('all');

  const debounceValue = useDebounce(filterSearch, 500);

  useEffect(() => {
    onChangeSearch(debounceValue);
  }, [debounceValue]);

  const debounce = useDebounce(status, 50);

  useEffect(() => {
    onChangeSelectedStatus(debounce);
  }, [debounce]);

  const clearAll = () => {
    onClearAllSelectedItems();
    setStatus('all');
    setFilterSearch('');
  }

  return (
    <div className="d-flex justify-content-between align-items-center gap-20">
      <div className="filter-search d-flex gap-10">
        <Tabs
          defaultValue={status}
          value={status}
          onValueChange={(value) => setStatus(value)}
        >
          <TabsList className='h-40 bdr border-1 p-4 bg-color'>
            {tabs?.map((tab) => {
              return (
                <TabsTrigger
                  key={tab?.value}
                  className='
                  color-white font-inter fw-400 pointer select-none bdr !shadow-none fs-13 h-7.5
                  data-[state=active]:!bg-[#404040]
                  '
                  value={tab?.value}
                // style={{
                //   fontSize: '13.5px',
                // }}
                >
                  {tab?.name}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>

      <div className='d-flex items-center gap-10'>
        {(selectedStatus !== 'all' || search) &&
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
    name: "Tất Cả",
    value: "all",
  },
  {
    name: "Chưa Hoàn Thành",
    value: "in_complete",
  },
  {
    name: "Đã Hoàn Thành",
    value: "completed",
  },
  {
    name: "Đã Ẩn",
    value: "un_active",
  },
];
