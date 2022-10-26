import './Navbar.css'
import { Link, NavLink } from 'react-router-dom'
import React from 'react'
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import AdminManageBar from "./AdminManageBar";
import UserManageBar from "./UserManageBar";

const Navbar = ({ user, handleLogout }) => {
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

    const UserMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link to='/profile'>Profile</Link>
                    ),
                    icon: <UserOutlined />
                },
                {
                    key: '2',
                    label: (
                        <Link to='/items'>Parts Management</Link>
                    ),
                    icon: <LogoutOutlined />,
                },
                {
                    key: '3',
                    label: (
                        <Link to='/profile'>
                            Profile
                        </Link>
                    ),
                    icon: <UserOutlined />
                },
                {
                    key: '4',
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
    const adminMenu = (

        //

        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link to='/userlist'>User Management</Link>
                    ),
                    icon: <UserOutlined />
                },
                {
                    key: '2',
                    label: (
                        <Link to='/rolelist'>Role Management</Link>
                    ),
                    icon: <LogoutOutlined />,
                },
                {
                    key: '3',
                    label: (
                        <Link to='/items'>Parts Management</Link>

                    ),
                    icon: <LogoutOutlined />,
                },
                {
                    key: '4',
                    label: (
                        <Link to='/category'>Products Management</Link>
                    ),
                    icon: <LogoutOutlined />,
                },
                {
                    key: '5',
                    label: (
                        <Link to='/profile'>
                            Profile
                        </Link>
                    ),
                    icon: <UserOutlined />
                },
                {
                    key: '6',
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

    return (
        <header>
            <nav>
                <div className="navbar">
                    <div className='menu'>
                        <div className="flex-item">
                            <NavLink to="/"><img src="/images/logo.jpg" width={100} /></NavLink>
                            <NavLink className="home" to="/"></NavLink>
                        </div>
                        {!user && (
                            <div className="flex-item">
                                <Link to='/login' className='btn'>Login</Link>
                                <Link to='/register' className='btn'>Register</Link>
                            </div>
                        )}
                        {user && (
                            <div className='userinfo flex-item'>
                                {user && user.role?.role_name === 'admin' && <AdminManageBar user={user} />}
                                {user && user.role?.role_name === 'user' && <UserManageBar user={user} />}
                                <Avatar size={50} src={user?.avatar || '/images/default-profile.png'} />
                                <Dropdown overlay={menu} className="dropdown">
                                    <span onClick={e => e.preventDefault()}>
                                        {user.first_name} {user.last_name} <DownOutlined />
                                    </span>
                                </Dropdown>
                            </div>

                        )}
                        <div className="drop-menu">
                            {user && user.role?.role_name === 'admin' &&
                                <Dropdown overlay={adminMenu} className="dropdown">
                                    <img src="/images/dropdown.png" width={50} />
                                </Dropdown>}

                            {user && user.role?.role_name === 'user' &&
                                <Dropdown overlay={UserMenu} className="dropdown">
                                    <img src="/images/dropdown.png" width={50} />
                                </Dropdown>}

                            {!user && <Dropdown overlay={UserMenu} className="dropdown">
                                <img src="/images/dropdown.png" width={50} />
                            </Dropdown>}

                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
