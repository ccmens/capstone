import './AdminManageBar.css'
import {NavLink} from 'react-router-dom'
import React from 'react'
import {Button} from 'antd'

const UserManageBar = () => {
    const NavActive = ({isActive}) => {
        return isActive ? 'manage-menu-item active' : 'manage-menu-item';
    }

    return (
        <div className='manage-bar'>
            <NavLink className={NavActive} to='/profile'>Profile</NavLink>
            <NavLink className={NavActive} to='/items'>Parts Management</NavLink>
        </div>
    )
}
export default UserManageBar;
