import { Modal, Form, Input, Button, Select, message, Upload, InputNumber } from "antd";
import React, { useState, useEffect } from 'react';


const SalesForm = ({
    handleSubmit,
    currentRow,
    isFormVisible,
    setIsFormVisible,
    categoryList,
}) => {
    const [formRef, setFormRef] = useState(null);;
    
  

    useEffect(() => {
        if (formRef) {
            formRef.setFieldsValue({
                category: currentRow?.category?._id || categoryList[0]?._id,
                //price: currentRow?.price,
                sales_qty: currentRow?.sales_qty,
                //stock: currentRow?.category?.category_qty - sales.qty;
            });
        }
    }, [formRef, currentRow, categoryList]);


    const getItemOptions = (ids) => {
        if (!ids || ids.length === 0) {
            return [];
        }
        const options = [];
        const findList = categoryList.filter((item) => ids.includes(item._id));
        findList.forEach((item) => {
            options.push({
                label: item.category_qty,
                value: item._id,
            });
        });
        return options;
    }

    return (
        <Modal
            title={currentRow ? "Edit Sales" : "Add Sales"}
            footer={null}
            visible={isFormVisible}
            onCancel={() => {
                formRef.setFieldsValue({
                    
                    category: categoryList[0]?._id,
                    sales_qty: null,
                });
                setIsFormVisible(false);
            }}
        >
            <Form
                name="item form"
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
                    label="Product"
                    name="category"
                    rules={[{ required: true, message: "Please select a product!" }]}
                >
                    <Select
                        options={categoryList.map((item) => ({
                            value: item._id,
                            label: item.category_name,
                        }))}
                    />
                </Form.Item>
                {/** 
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter price!" }]}
                >
                    <Input type="number" />
                </Form.Item>
                */}
                <Form.Item
                    label="Sales Quantity"
                    name="sales_qty"
                    rules={[{ required: true, message: "Please enter price!",  }]}
                >
                     <InputNumber min={1}/>
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
}

export default SalesForm;