export const ErrorMessage = ({ message, ...other }) => {
  return (
    <div {...other}>
      {message && <span className='font-inter color-red mt-3 d-block errorColor'>{message}</span>}
    </div>
  )
}
