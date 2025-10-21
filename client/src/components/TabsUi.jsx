import { useState, useEffect } from 'react';
import { Color } from '@/enums/enum';
import useDebounce from '@/hooks/useDebounce';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function TabsUi({
  tabs = [],
  selectedTab = '',
  onChangeTab = () => { },
}) {

  return (
    <Tabs
      defaultValue={selectedTab}
      value={selectedTab}
      onValueChange={onChangeTab}
    >
      <TabsList className='h-40 bdr border-1 p-4 bg-color-light'>
        {tabs?.map((tab) => {
          return (
            <TabsTrigger
              key={tab?.value}
              className={`
                  color-white font-inter fw-500 pointer select-none bdr !shadow-none fs-13 h-7.5 border-1
                  data-[state=active]:!bg-[#404040]
                  `}
              value={tab?.value}
              style={{
                borderColor: selectedTab === tab?.value ? '#585858' : '#323230'
              }}
            >
              <span className='gap-6 d-flex text-capitalize'>
                {tab?.icon}
                {tab?.name}
              </span>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
