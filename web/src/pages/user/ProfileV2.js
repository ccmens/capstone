import React, { useState, useEffect } from 'react'
import "./Profile.css"
import { Button, Descriptions } from 'antd';
import ConfirmComponent from '@components/ConfirmComponent';
import { useNavigate } from 'react-router-dom';

export default function ProfileV2({
    user,
    handleAction
}) {
    // useEffect(() => {
    //     console.log(user)
    // })

    // Quick fix for updating profile info after editing
    // useEffect(() => {
    //     for (var i = 0; i <1; i++) {
    //         window.location.reload(false);
    //     }
    // })

    const navigate = useNavigate();

    const handleInactive = () => {
        ConfirmComponent(async () => {
            await handleAction('inactive', user?._id);
        }, 'Are you sure to inactive your account?', 'if you inactive your account, you will not be able to login again');
    }

    return (
        <div className='profile-wrap'>
            <h3>Profile</h3>
            
            <div className='profile-avatar'>
                <img src={user?.avatar || '/images/default-profile.png'} width="80" alt={user?.email} />
            </div>
            <Descriptions title="User Info">
                <Descriptions.Item label="First Name">{user?.first_name}</Descriptions.Item>
                <Descriptions.Item label="Last Name">{user?.last_name}</Descriptions.Item>
                <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
            </Descriptions>

            <Button type="primary" onClick={()=>navigate("/profile/edit")}>
                            Edit Info
                        </Button>
            <Button type="danger" onClick={handleInactive}>
                            Deactive Account
                        </Button>
        </div>
    )
}
