import PropTypes from 'prop-types';


Container.propTypes = {
  children: PropTypes.node.isRequired,
}

const containerStyle = {
  // backgroundColor: '#09090B',
  // borderRadius: '5px',
  // boxShadow: '0 2px 5px rgba(90, 89, 89, 0.255)',
  padding: '20px',
  // minHeight: '100vh',
}

export default function Container({ children, style, ...other }) {

  return (
    <>
      <div {...other} className='bg-color' style={{ ...style, ...containerStyle }}>
        {children}
      </div>
    </>
  )

}
