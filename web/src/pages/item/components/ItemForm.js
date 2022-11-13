import { Modal, Form, Input, Button, Select, message, Upload, InputNumber } from "antd";
import React, { useState, useEffect } from "react";
import { itemUpload } from '@services/api.service';

const ItemForm = ({
    handleSubmit,
    currentRow,
    isFormVisible,
    setIsFormVisible,
    categoryList,
}) => {
    const [formRef, setFormRef] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleUpload = async (file) => {
        const hide = message.loading('Uploading...');
        try {
            console.log('handleUpload', file);
            const result = await itemUpload(file);
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
                item_name: currentRow?.item_name,
                category: currentRow?.category?._id || categoryList[0]?._id,
                price: currentRow?.price,
                stock: currentRow?.stock,
                needed_qty: currentRow?.needed_qty,
            });
            setFileList(getPicture(currentRow?.image || ''));
        }
    }, [formRef, currentRow, categoryList]);


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
        <Modal
            title={currentRow ? "Edit Item" : "Add Item"}
            footer={null}
            visible={isFormVisible}
            onCancel={() => {
                formRef.setFieldsValue({
                    item_name: "",
                    category: categoryList[0]?._id,
                    price: null,
                });
                setIsFormVisible(false);
            }}
        >
            <Form
                name="item form"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 12 }}
                onFinish={(values) => {
                    let picture = {};
                    if (fileList.length > 0) {
                        picture = {
                            uid: fileList[0].uid,
                            name: fileList[0].name,
                            type: fileList[0].type,
                            size: fileList[0].size,
                            extname: fileList[0].name.split('.').pop(),
                        }
                    }
                    const formData = {
                        ...values,
                        picture: picture,
                    };
                    if (formData.image) {
                        delete formData.image;
                    }
                    console.log("formData", formData);
                    handleSubmit(formData);
                }}
                onFinishFailed={() => {
                    console.log("onFinishFailed");
                }}
                autoComplete="off"
                ref={setFormRef}
            >
                <Form.Item
                    label="Item Name"
                    name="item_name"
                    rules={[{ required: true, message: "Please enter item name!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Product"
                    name="needed"
                    rules={[{ required: true, message: "Please select a product!" }]}
                >
                    <Select
                        mode="multiple"
                        options={categoryList.map((item) => ({
                            value: item._id,
                            label: item.category_name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter price!" }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="Needed QTY"
                    name="needed_qty"
                    rules={[{ required: true, message: "Please enter price!" }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[{ required: true, message: "Please enter Stock!" }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    label="Digikey Part #"
                    name="digikey_part_num"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Supplier Link"
                    name="supplier_link"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Picture"
                // name="image"
                >
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

export default ItemForm;