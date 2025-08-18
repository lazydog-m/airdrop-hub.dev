import logo from '../assets/img/logo.png'
import logoCollapse from '../assets/img/airdrop_hub_logo_collapsed.png'
import { Link } from 'react-router-dom'
import { PATH_DASHBOARD } from '../routes/path'

export const Logo = ({ isCollapse }) => {
  return (
    <Link to={PATH_DASHBOARD.app} className='select-none'>
      {!isCollapse ? <img src={logo} style={{ width: "225px", transition: "width 0.3s ease" }} />
        : <img src={logoCollapse} style={{ width: "100%", marginTop: '8px', marginBottom: '7px', userSelect: 'none' }} />}
    </Link>
  )
}

export const LogoMobile = () => {
  return (
    <Link to={PATH_DASHBOARD.app} className='select-none'>
      <img src={logo} style={{ width: "100%", userSelect: 'none' }} />
    </Link>
  )

}

export const LogoCollapse = () => {
  return (
    <Link to={PATH_DASHBOARD.app} className='select-none'>
      <img src={logoCollapse} style={{ width: "100%", marginTop: '5px', marginBottom: '7px', userSelect: 'none' }} />
    </Link>
  )

}
