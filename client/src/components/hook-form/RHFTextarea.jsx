import PropTypes from 'prop-types';
import { useRef } from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
// antd
RHFTextarea.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
};

export default function RHFTextarea({ name, label, required, placeholder, ...other }) {

  const { control } = useFormContext();
  const textareaRef = useRef(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          {label &&
            <label className='d-block font-inter fw-500 fs-14'>
              {label}
              <span className={required && 'required'}></span>
            </label>
          }
          <Textarea
            ref={textareaRef}
            className='mt-10 font-inter custom-input'
            autoComplete='off'
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // e.preventDefault(); // Ngăn chặn hành vi mặc định

                // Lấy vị trí con trỏ
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;

                // Cập nhật giá trị với ký tự xuống dòng tại vị trí con trỏ
                const newValue = field.value.substring(0, start) + '\n' + field.value.substring(end);
                field.onChange(newValue); // Cập nhật giá trị mới

                // // Đặt lại vị trí con trỏ
                setTimeout(() => {
                  e.target.selectionStart = e.target.selectionEnd = start + 1;

                  // Tính toán vị trí cuộn
                  const lineHeight = parseInt(getComputedStyle(e.target).lineHeight) || 20;
                  const textBeforeCursor = newValue.substring(0, start + 1);
                  const lineCount = textBeforeCursor.split('\n').length;

                  // Cuộn đến dòng chứa con trỏ
                  e.target.scrollTop = (lineCount - 1) * lineHeight;
                }, 0);
              }
            }}
            style={{ minHeight: '120px', maxHeight: '120px' }}
            {...field}
            {...other}
          />
          {error && <span className='font-inter color-red mt-3 d-block errorColor'>{error?.message}</span>}
        </>
      )}

    />
  )

}
