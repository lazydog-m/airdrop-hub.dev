import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ListFilter, UserPlus, UserRoundCheck, UserRoundX } from 'lucide-react';
import { ButtonGhost } from '@/components/Button';
import { Color } from '@/enums/enum';
import useDebounce from '@/hooks/useDebounce';
import TabsUi from '@/components/TabsUi';
import { ResourceIcon, RESOURCES } from '@/commons/Resources';
import { IconX } from '@/components/IconUi';
import TooltipUi from '@/components/TooltipUi';
import { BadgePrimaryOutline } from '@/components/Badge';

export default function ProjectProfileFilterSearch({
  selectedTab,
  onChangeSelectedTab = () => { },

  onClearAllSelectedItems = () => { },

  onChangeSearch = () => { },
  search = '',

  action = {},
  pagination = {},
  projectName = '',
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

  const tabs = [
    {
      name: `Đã tham gia (${pagination?.totalItemsJoined || 0})`,
      value: "joined",
      icon: <UserRoundCheck size={17} />
    },
    {
      name: `Chưa tham gia (${pagination?.totalItemsFree || 0})`,
      value: "free",
      icon: <UserRoundX size={17} />
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between items-center">
        <div className="d-flex gap-10 items-center">
          <TabsUi
            tabs={tabs}
            selectedTab={filterTab}
            onChangeTab={(value) => setFilterTab(value)}
          />
        </div>
        <div className='d-flex items-center gap-10'>
          {search &&
            <ButtonGhost
              icon={<ListFilter color={Color.ORANGE} />}
              onClick={clearAll}
            />
          }
          <Input
            placeholder='Tìm kiếm profiles ...'
            style={{ width: '250px' }}
            className='custom-input'
            value={filterSearch}
            onChange={(event) => setFilterSearch(event.target.value)}
          />
          <TooltipUi
            modal
            content={`Total Points ${projectName}`}
          >
            <div
              className='items-center inline-flex select-none gap-0 h-40 border-primary bg-color-light pdi-15'
            >
              <span className='fs-13 fw-500 flex items-center'>
                {`100,000 Points`}
              </span>
            </div>
          </TooltipUi>
          {action}
        </div>
      </div>

    </>
  )
}
