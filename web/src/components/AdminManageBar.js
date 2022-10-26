import './AdminManageBar.css'
import {NavLink} from 'react-router-dom'
import React from 'react'

const AdminManageBar = () => {

    return (
        <div className='manage-bar'>
            <NavLink to='/userlist' className="btn">User Management</NavLink>
            <NavLink to='/rolelist' className="btn">Role Management</NavLink>
            <NavLink to='/items' className="btn">Parts Management</NavLink>
            <NavLink to='/category' className="btn">Products Management</NavLink>
        </div>
    )
}

export default AdminManageBar;