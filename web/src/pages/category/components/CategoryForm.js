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
                category_qty: currentRow?.category_qty,
                category_price: currentRow?.category_price,
                category_hrs: currentRow?.category_hrs,
            });
        }
    }, [formRef, currentRow]);

    return (
        <Modal title={currentRow ? 'Edit Products' : 'Add Products'} footer={null} visible={isFormVisible} onCancel={() => setIsFormVisible(false)}>
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
                    label="Product Name"
                    name="category_name"
                    rules={[{ required: true, message: 'Please enter product name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Product Stock"
                    name="category_qty"
                    rules={[{ required: true, message: 'Please enter product stock amount!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Product Price"
                    name="category_price"
                    rules={[{ required: true, message: 'Please enter product product price!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Build Hours"
                    name="category_hrs"
                    rules={[{ required: true, message: 'Please enter product building hours!' }]}
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