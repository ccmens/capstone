import { Modal, Form, Input, Button } from 'antd';
import React from 'react';

const CategoryForm = ({
    handleSubmit,
    currentRow,
    isFormVisible,
    setIsFormVisible,
}) => {

    const [formRef, setFormRef] = React.useState(null);

    React.useEffect(() => {
        if (formRef) {
            formRef.setFieldsValue({
                category_name: currentRow?.category_name,
            });
        }
    }, [formRef, currentRow]);

    return (
        <Modal title={currentRow ? 'Edit Category' : 'Add Category'} footer={null} visible={isFormVisible} onCancel={() => setIsFormVisible(false)}>
            <Form
                name="category form"
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
                    label="Category Name"
                    name="category_name"
                    rules={[{ required: true, message: 'Please enter category name!' }]}
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

export default CategoryForm;