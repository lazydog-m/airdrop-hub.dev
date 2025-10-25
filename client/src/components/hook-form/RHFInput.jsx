import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../ui/input';
// antd
RHFInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  textarea: PropTypes.bool,
};

export default function RHFInput({ name, label, required, ...other }) {

  const { control } = useFormContext();

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
          <Input
            className='
            mt-10 font-inter custom-input
            focus-visible:outline-none
            focus-visible:ring-offset-1 focus-visible:ring-offset-background
            transition-all duration-200 ease-in-out
            focus-visible:ring-[1px]
            dark:focus-visible:ring-offset-neutral-500
            '
            autoComplete='off'
            {...field}
            {...other}
          />
          {error && <span className={`font-inter color-red mt-3 d-block errorColor`}>{error?.message}</span>}
        </>
      )}

    />
  )

}
