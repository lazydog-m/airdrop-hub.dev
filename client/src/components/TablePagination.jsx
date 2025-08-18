import React from 'react';
import { ButtonOutline } from './Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function TablePagination({
  onChangePage = () => { },
  pagination = {},
  selected = [],
  selectedObjText = '',
  ...other
}) {

  const { page, totalItems, totalPages, hasPre, hasNext } = pagination;

  return (
    <div className='pagination d-flex justify-content-between mt-20 color-white font-inter' {...other}>

      <div className='align-items-center justify-content-center d-flex fs-14 fw-400'>
        {`Đã chọn ${selected.length || 0} trong tổng số ${totalItems || 0} ${selectedObjText}.`}
      </div>
      <div className='align-items-center justify-content-center d-flex fs-14 fw-400'>
        {`Trang ${page || 0}/${totalPages || 0}`}
      </div>

      <div className='d-flex gap-15'>
        <ButtonOutline
          disabled={!hasPre}
          onClick={() => onChangePage(1)}
          icon={
            <ChevronsLeft />
          }
        />
        <ButtonOutline
          disabled={!hasPre}
          onClick={() => onChangePage(page - 1)}
          icon={
            <ChevronLeft />
          }
        />

        <ButtonOutline
          disabled={!hasNext}
          onClick={() => onChangePage(page + 1)}
          isReverse
          icon={
            <ChevronRight />
          }
        />

        <ButtonOutline
          disabled={!hasNext}
          onClick={() => onChangePage(totalPages)}
          icon={
            <ChevronsRight />
          }
        />
      </div>

    </div>
  );
}

