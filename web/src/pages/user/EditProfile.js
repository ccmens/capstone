import React, { useState, useEffect } from 'react'
import "./Profile.css"
import { message, Button, Form, Input } from 'antd';
import ConfirmComponent from '@components/ConfirmComponent';
import { useNavigate } from 'react-router-dom';

export default function EditProfile({
    user,
    handleAction
}) {

    const [formRef, setFormRef] = React.useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (formRef) {
            formRef.setFieldsValue({
                first_name: user?.first_name,
                last_name: user?.last_name,
            });
        }
    }, [formRef, user]);

    const onFinish = async (values) => {
        console.log('onFinish:', values);
        if (values.password && values.password !== values.confirm_password) {
            message.error('Password and Confirm Password are not same');
            return;
        }
        const result = await handleAction('profile', user?._id, values);
        if (result) {
            message.success('Profile updated successfully');
            navigate("/profile");
            // A quick fix to updating the page after editing the profile
            window.location.reload();
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleInactive = () => {
        ConfirmComponent(async () => {
            await handleAction('inactive', user?._id);
        }, 'Are you sure to inactive your account?', 'if you inactive your account, you will not be able to login again');
    }

    return (
        <div className='profile-wrap'>
            <h3>Edit Profile</h3>
            <div className='profile-form'>
                <div className='profile-avatar'>
                    <img src={user?.avatar || '/images/default-profile.png'} width="80" alt={user?.email} />
                    <Button onClick={() => {
                        message.info('Coming soon');
                    }}>
                        Change Picture
                    </Button>
                </div>
                <Form
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    ref={setFormRef}
                >
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ min: 6, message: 'Password at least 6 characters' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirm_password"
                        rules={[{ min: 6, message: 'Confirm Password at least 6 characters' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="last_name"
                        rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="danger" onClick={handleInactive}>
                            Deactive Account
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
