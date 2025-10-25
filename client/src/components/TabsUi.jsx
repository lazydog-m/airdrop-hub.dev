import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Color } from "@/enums/enum"
import { Badge } from "./ui/badge"

export const TabsUi = ({
  tabs = [],
  selectedTab = '',
  onChangeTab = () => { },
}) => {

  return (
    <>
      <Tabs
        className='gap-4'
        defaultValue={selectedTab}
        value={selectedTab}
        onValueChange={onChangeTab}
      >
        <TabsList className='p-0 bdr h-40'>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='pointer font-inter fw-500 select-none
              h-full bdr border-b-3
              transition-all duration-200 ease-in-out
              '
              style={{
                borderColor: selectedTab === tab?.value ? '#ffffff' : '#323230',
                backgroundColor: selectedTab === tab?.value ? '#404040' : '#202020'
              }}
            >
              <span className="flex gap-10 items-center">
                <span className='gap-7 d-flex text-capitalize items-center'>
                  {tab?.icon}
                  {tab?.name}
                </span>
                <Badge
                  className='h-5 border-none !shadow-none min-w-5.5 rounded-full px-1 flex justify-center tabular-nums'
                // style={{ backgroundColor: Color.PRIMARY }}
                >
                  {tab?.total || 0}
                </Badge>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  )
}

export const TabsUi1 = ({
  tabs = [],
  selectedTab = '',
  onChangeTab = () => { },
}) => {

  return (
    <>
      <Tabs
        defaultValue={selectedTab}
        value={selectedTab}
        onValueChange={onChangeTab}
      >
        <TabsList className='h-40 bdr border-none bg-color-light p-0'>
          {tabs?.map((tab) => {
            return (
              <TabsTrigger
                key={tab?.value}
                className={`
                  font-inter fw-500 pointer select-none bdr h-full border-none color-white
                  transition-all duration-200 ease-in-out
                  `}
                value={tab?.value}
                style={{
                  backgroundColor: selectedTab === tab?.value ? '#505050' : '#323230',
                }}
              >
                <span className="flex gap-6 items-center">
                  <span className='gap-6 d-flex text-capitalize'>
                    <span className="mt-1">
                      {tab?.icon}
                    </span>
                    {tab?.name}
                  </span>
                  (10)
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </>
  )
}
