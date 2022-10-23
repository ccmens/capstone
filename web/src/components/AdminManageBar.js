import './ManageBar.css'
import { NavLink } from 'react-router-dom'
import React from 'react'
import { Button } from 'antd'
export default function AdminManageBar({
    handleLogout
}) {
    const NavActive = ({ isActive }) => {
        return isActive ? 'manage-menu-item active' : 'manage-menu-item';
    }
    return (
        <div className='manage-bar'>
            <NavLink to='/userlist' className={NavActive}>User Management</NavLink>
            <NavLink to='/rolelist' className={NavActive}>Role Management</NavLink>
            <NavLink to='/items' className={NavActive}>Parts Management</NavLink>
            <NavLink to='/category' className={NavActive}>Products Management</NavLink>
            <NavLink to='/charts' className={NavActive}>Report</NavLink>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    )
}
