import './AdminManageBar.css'
import {NavLink} from 'react-router-dom'
import React from 'react'

const AdminManageBar = () => {

    return (
        <div className='manage-bar'>
            <NavLink to='/userlist' className="btn">Users</NavLink>
            <NavLink to='/rolelist' className="btn">Roles</NavLink>
            <NavLink to='/items' className="btn">Parts</NavLink>
            <NavLink to='/category' className="btn">Products</NavLink>
            <NavLink to='/report' className="btn">Report</NavLink>
            <NavLink to='/sales' className="btn">Sales</NavLink>
        </div>
    )
}

export default AdminManageBar;