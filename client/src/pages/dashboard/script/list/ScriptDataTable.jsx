import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { PencilLine, Trash2 } from 'lucide-react';
import { Color } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete, apiPut } from '@/utils/axios';
import useConfirm from '@/hooks/useConfirm';
import useMessage from '@/hooks/useMessage';
import { Checkbox } from '@/components/Checkbox';
import { Link } from 'react-router-dom';
import { PATH_DASHBOARD } from '@/routes/path';
import SwitchStyle from '@/components/Switch';

const columns = [
  { header: 'Tên Script', align: 'left' },
  { header: 'Trạng thái', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function ScriptDataTable({
  data = [],
  onDeleteData,
  onChangePage,
  onSelectAllRows,
  onSelectRow,
  pagination,
  selected = []
}) {
  const { onOpen, onClose } = useSpinner();
  const { showConfirm, showSaved } = useConfirm();
  const { onSuccess, onError } = useMessage();

  const handleDelete = (fileName) => {
    showConfirm(`Xác nhận xóa script '${fileName}'?`, () => remove(fileName));
  }

  const triggerRemove = () => {
    onClose();
    onSuccess("Xóa script thành công!")
  }

  const remove = async (fileName) => {
    try {
      onOpen();
      const response = await apiDelete(`/scripts/${fileName}`);
      onDeleteData(response.data.data, triggerRemove);
    } catch (error) {
      console.error(error);
      onError(error.message);
      onClose();
    }
  }

  const rows = React.useMemo(() => {
    return data.map((row) => (
      <TableRow
        className='table-row'
        key={row.id}
        selected={selected.includes(row.id)}
      >
        <TableCell align="left">
          <Checkbox
            checked={selected.includes(row.id)}
            onClick={() => onSelectRow(row.id)}
          />
        </TableCell>
        <TableCell align="left">
          <span className='font-inter d-flex color-white fw-500'>
            {row.fileName}
          </span>
        </TableCell>
        <TableCell align="left">
          <SwitchStyle checked={true} />
        </TableCell>
        <TableCell align="left">
          <Link to={PATH_DASHBOARD.script.edit(row.fileName)}>
            <ButtonIcon
              variant='ghost'
              icon={<PencilLine color={Color.WARNING} />}
            />
          </Link>
          {/* <ButtonIcon */}
          {/*   onClick={() => handleDelete(row.fileName)} */}
          {/*   variant='ghost' */}
          {/*   icon={<Trash2 color={Color.DANGER} />} */}
          {/* /> */}
        </TableCell>
      </TableRow >
    ))
  }, [data, selected]);

  return (
    <>
      <DataTableMemo
        className='mt-20'
        columns={columns}
        data={rows}
        pagination={pagination}

        selected={selected}
        isCheckedAll={data.length > 0 && data?.every(row => selected?.includes(row.id))}
        isIndeterminate={selected.length > 0 && data?.some(row => selected.includes(row.id)) && !data.every(row => selected.includes(row.id))}

        onSelectAllRows={onSelectAllRows}
        onChangePage={onChangePage}

        selectedObjText={'script'}
      />
    </>
  );
}

