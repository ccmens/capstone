import { Modal, Form, Input, Button, Select, message, Upload, InputNumber, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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
                category: [],
                price: currentRow?.price,
                stock: currentRow?.stock,
                //needed_qty: currentRow?.needed_qty,
                digikey_part_num: currentRow?.digikey_part_num,
                supplier_link: currentRow?.supplier_link,
            });
            setFileList(getPicture(currentRow?.image || ''));
        }
    }, [formRef, currentRow, categoryList]);

    console.log(categoryList);

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
                    //category: categoryList[0]?._id,
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
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter price!" }]}
                >
                    <InputNumber min={0.01} />
                </Form.Item>

                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[{ required: true, message: "Please enter Stock!" }]}
                >
                    <InputNumber min={1} />
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
                <Form.List name="category" >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <Space key={field.key} align="baseline">
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, curValues) =>
                                            prevValues.category !== curValues.category
                                        }
                                    >
                                        {() => (
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'category_name']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Missing Product',
                                                    },
                                                ]}
                                            >
                                                <Select

                                                    //value={getItemOptions(currentRow?.needed_part)}
                                                    placeholder="Select Related Product"
                                                    style={{
                                                        width: '200%',
                                                    }}
                                                    options={categoryList.map((category) => ({
                                                        value: category._id,
                                                        label: category.category_name,
                                                    }))}
                                                />
                                            </Form.Item>
                                        )}
                                    </Form.Item>


                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Space>
                            ))}

                            <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{
                                    width: '250%',
                                }}>
                                    Add Related Product
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
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