import './Navbar.css'
import { Link, NavLink } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import UserManageBar from './UserManageBar'
import AdminManageBar from './AdminManageBar'
import { DownOutlined, LogoutOutlined, UserOutlined, CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Avatar } from 'antd';

export default function Navbar({
  user,
  handleLogout
}) {

  const [isShowMenu, setIsShowMenu] = useState(false);

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <Link to='/profile'>
              Profile
            </Link>
          ),
          icon: <UserOutlined />
        },
        {
          key: '2',
          label: (
            <span onClick={handleLogout}>
              Logout
            </span>
          ),
          icon: <LogoutOutlined />,
        }
      ]}
    />
  );

  useEffect(() => {
    windowSizeChange();
  }, [])

  const NavActive = ({ isActive }) => {
    return isActive ? 'menu-link active' : 'menu-link';
  }

  const handleClick = () => {
    if (window.innerWidth > 960) {
      return;
    }
    setIsShowMenu(!isShowMenu)
  };
  const windowSizeChange = () => {
    if (window.innerWidth < 960) {
      setIsShowMenu(false)
    } else {
      setIsShowMenu(true)
    }
  };
  window.addEventListener('resize', windowSizeChange);
  const navStyle = isShowMenu ? { display: 'flex' } : { display: 'none' };

  return (
    <header>
      <nav>
        <div className="navbar">
          
          <div className='menu' style={navStyle}>
            <NavLink className={NavActive} to="/">HOME</NavLink>
            {!user && (
              <>
                <Link to='/login' className='btn-login'>Login</Link>
                <Link to='/register' className='btn-register'>Register</Link>
              </>
            )}
            {user && (
              <div className='userinfo'>
                <Avatar size={64} src={user?.avatar || '/images/default-profile.png'} />
                <Dropdown overlay={menu}>
                  <span onClick={e => e.preventDefault()}>
                    {user.first_name} {user.last_name} <DownOutlined />
                  </span>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
        <div className="nav-menu">
          {isShowMenu ? <CloseOutlined onClick={handleClick} /> : <MenuOutlined onClick={handleClick} />}
        </div>
      </nav>
      {user && user.role?.role_name === 'admin' && <AdminManageBar user={user} handleLogout={handleLogout} />}
      {user && user.role?.role_name === 'user' && <UserManageBar user={user} handleLogout={handleLogout} />}
    </header>
  )
}
