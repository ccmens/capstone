import React, {useState, useEffect} from 'react'
import "./Profile.css"
import {message, Button, Form, Input, Upload} from 'antd';
import ConfirmComponent from '@components/ConfirmComponent';
import {upload} from '@services/api.service';

const Profile = ({user, handleAction}) => {

    const [formRef, setFormRef] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleUpload = async (file) => {
        const hide = message.loading('Uploading...');
        try {
            console.log('handleUpload', file);
            const result = await upload(file);
            hide();
            return result;
        } catch (error) {
            hide();
            message.error('Upload failed: ' + error.data?.message || 'Please try again!');
            return false;
        }
    };

    useEffect(() => {
        if (formRef) {
            formRef.setFieldsValue({
                first_name: user?.first_name,
                last_name: user?.last_name,
            });
            setFileList(getPicture(user?.avatar || '/images/default-profile.png'));
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
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleInactive = () => {
        ConfirmComponent(async () => {
            await handleAction('inactive', user?._id);
        }, 'Are you sure to inactivate your account?', 'if you inactivate your account, you will not be able to login again');
    }

    const handleChange = (res) => {
        if (!res.file || !res.file.status) {
            return;
        }
        if (res.file) {
            res.file.status = 'done';
        }
        setFileList(res.fileList);
    };

    const getPicture = (picture) => {
        if (!picture) {
            return [];
        }
        const extname = picture.split('.').pop();
        const filename = picture.split('/').pop();
        return [
            {
                uid: filename.split('.').shift(),
                name: filename,
                status: 'done',
                size: 0,
                type: 'image/' + extname,
                url: picture,
            },
        ];
    };

    return (
        <div className='profile-wrap'>
            <h3>Edit Profile</h3>
            <div className='profile-form'>
                <div className='profile-avatar'>
                    <Upload
                        title="Upload Picture"
                        name="image"
                        action={handleUpload}
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        customRequest={() => {
                        }}
                    >
                        {fileList.length < 1 && '+ Upload'}
                    </Upload>
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
                        rules={[{min: 6, message: 'Password at least 6 characters'}]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirm_password"
                        rules={[{min: 6, message: 'Confirm Password at least 6 characters'}]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[{required: true, message: 'Please input your first name!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="last_name"
                        rules={[{required: true, message: 'Please input your last name!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="danger" onClick={handleInactive}>
                            Deactivate Account
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

export default Profile;
