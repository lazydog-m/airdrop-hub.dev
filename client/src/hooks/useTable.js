import { useState } from 'react';

// ----------------------------------------------------------------------

export default function useTable(props) {

  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'createdAt');

  const [order, setOrder] = useState(props?.defaultOrder || 'desc');

  const [page, setPage] = useState(props?.defaultCurrentPage ?? 1);

  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 10);

  const [selected, setSelected] = useState(props?.defaultSelected || []);

  const onChangePage = (newPage) => {
    setPage(newPage);
  };

  const onChangeRowsPerPage = (perPage) => {
    setRowsPerPage(perPage);
    // setPage(0);
  };

  const onSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const onSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);

    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    }
    else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    }
    else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const onSelectAllRows = (checked, selecteds = []) => {
    setSelected((prev) => {
      if (checked) {
        return [...prev, ...selecteds?.filter((id) => !prev.includes(id))];
      }
      else {
        return prev.filter(id => !selecteds.includes(id))
      }
    })
  };

  // filter

  return {
    order,
    page,
    setPage,
    orderBy,
    rowsPerPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  };
}

// ----------------------------------------------------------------------

// sort createdAt ??
export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
