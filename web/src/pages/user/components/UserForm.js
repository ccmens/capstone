import { Modal, Form, Input, Button, Select, Switch } from 'antd';
import React from 'react';

export default function UserForm({
    handleSubmit,
    currentRow,
    isFormVisible,
    setIsFormVisible,
    roleList
}) {

    const [formRef, setFormRef] = React.useState(null);

    React.useEffect(() => {
        if (formRef) {
            formRef.setFieldsValue({
                role: currentRow?.role?._id || roleList[0]?._id,
                email: currentRow?.email,
                first_name: currentRow?.first_name,
                last_name: currentRow?.last_name,
                active: currentRow?.active || false,
            });
        }
    }, [formRef, currentRow]);

    return (
        <Modal title={currentRow ? 'Edit User' : 'Add User'} footer={null} visible={isFormVisible} onCancel={() => setIsFormVisible(false)}>
            <Form
                name="user form"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
                onFinish={(values) => {
                    console.log('onFinish', values);
                    handleSubmit(values);
                }}
                onFinishFailed={() => {
                    console.log('onFinishFailed');
                }}
                autoComplete="off"
                ref={setFormRef}
            >
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please select a role!' }]}
                >
                    <Select options={roleList.map(item => ({ value: item._id, label: item.role_name }))} />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please enter email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirm_password"
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="First Name"
                    name="first_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="last_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Active"
                    name="active"
                    valuePropName='checked'
                >
                    <Switch />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 12,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};