import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Checkbox } from './Checkbox';
import TablePagination from './TablePagination';
import Popover from './Popover';
import { DropdownMenu } from './DropdownMenu';
import { Check, ChevronsUpDown, Inbox } from 'lucide-react';
import EmptyData from './EmptyData';

export default function DataTable({
  columns = [],

  data = [],
  pagination = {},
  selected = [],

  isCheckedAll,
  isIndeterminate,

  onChangePage = () => { },
  onSelectAllRows = () => { },

  selectedObjText = '',
  ...other
}) {

  return (

    < div {...other}>
      <TableContainer
        component={Paper}
        className='custom-table'
      >
        <Table
          stickyHeader
          className='table-default'
        >
          <TableHead>
            <TableRow>
              <TableCell
                key='checkbox-all'
                align='left'
              >
                <Checkbox
                  defaultChecked={false}
                  checked={isCheckedAll}
                  onChange={(checked) => onSelectAllRows(checked)}
                  indeterminate={isIndeterminate}
                />
              </TableCell>
              {columns?.map((item) => {
                return (
                  <TableCell
                    // width={item.width}
                    key={item.header}
                    align={item.align}
                  >
                    {item.selected ?
                      <Popover
                        mt='mt-7'
                        trigger={
                          <span className='pointer d-flex align-items-center gap-6 fw-bold font-inter text-capitalize table-header-action'>
                            {item.header}
                            <ChevronsUpDown size={'17px'} />
                          </span>
                        }
                        content={
                          <DropdownMenu
                            minW={item.minW}
                            items={item?.options?.map((option, index) => {
                              return {
                                active: option.name === item.selected,
                                onClick: () => item.onChange(option.name),
                                title: <span
                                  key={index}
                                  className='fw-400 fs-13 d-flex gap-25'
                                >
                                  <span className='d-flex gap-10'>
                                    {option.icon}
                                    {option.name}
                                  </span>
                                  <span>
                                    {option.name === item.selected && <Check size={'16px'} color='#a1a1a1' />}
                                  </span>
                                </span>
                              }
                            })}
                          />
                        }
                      />
                      :
                      <span className='fw-bold font-inter text-capitalize'>
                        {item.header}
                      </span>
                    }
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0 ? data :
              <TableRow>
                <TableCell colSpan={columns?.length + 1}>
                  <EmptyData />
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        pagination={pagination}
        onChangePage={onChangePage}
        selected={selected}
        selectedObjText={selectedObjText}
      />
    </div >
  );
}

