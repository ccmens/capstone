import { Modal, Form, Input, Button, Select } from 'antd';
import React from 'react';
import RoleData from '../data/RoleData';

const RoleForm = ({
    handleSubmit,
    currentRow,
    isFormVisible,
    setIsFormVisible,
}) => {

    const [formRef, setFormRef] = React.useState(null);

    React.useEffect(() => {
        if (formRef) {
            formRef.setFieldsValue({
                role_name: currentRow?.role_name || RoleData.RoleType[0],
                title: currentRow?.title,
            });
        }
    }, [formRef, currentRow]);

    return (
        <Modal title={currentRow ? 'Edit Role' : 'Add Role'} footer={null} visible={isFormVisible} onCancel={() => setIsFormVisible(false)}>
            <Form
                name="role form"
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
                    label="Role Type"
                    name="role_name"
                    rules={[{ required: true, message: 'Please select role type!' }]}
                >
                    <Select options={RoleData.RoleType.map(item => ({ value: item, label: item }))} />
                </Form.Item>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter title!' }]}
                >
                    <Input />
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

export default RoleForm;