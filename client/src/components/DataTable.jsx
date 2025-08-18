import React, { useEffect, useState, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Checkbox } from './Checkbox';
import TablePagination from './TablePagination';

export default function DataTable({
  colunms,

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
              {colunms.map((item) => {
                return (
                  <TableCell
                    // width={item.width}
                    key={item.header}
                    align={item.align}
                  >
                    <span className='fw-bold font-inter' style={item.style}>
                      {item.header}
                    </span>
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0 ? data :
              <TableRow>
                <TableCell colSpan={8}>
                  <div className='font-inter color-white text-center' style={{ padding: '30px' }}>
                    Chưa có dữ liệu.
                  </div>
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

