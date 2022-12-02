import { Modal, Form, Space, Input, Button, Select, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';

const CategoryForm = ({
  handleSubmit,
  currentRow,
  isFormVisible,
  setIsFormVisible,
  itemList,
}) => {


  const [formRef, setFormRef] = React.useState(null);

  React.useEffect(() => {
    if (formRef) {
      formRef.setFieldsValue({
        category_name: currentRow?.category_name,
        category_qty: currentRow?.category_qty,
        category_price: currentRow?.category_price,
        category_hrs: currentRow?.category_hrs,
        /*needed_part: {
            part:currentRow?.needed_part?.part|| itemList[0]?._id,
            needed_qty:currentRow?.needed_part.needed_qty,
        },*/
        needed_part: []
      });
    }
  }, [formRef, currentRow, itemList]);
  /*
      const getItemOptions = (ids) => {
          if (!ids || ids.length === 0) {
              return [];
          }
          const options = [];
          const findList = itemList.filter((item) => ids.includes(item._id));
          findList.forEach((item) => {
              options.push({
                  label: item.item_name,
                  value: item._id,
              });
          });
          return options;
      }
  */
  const formItemLayout = {

    wrapperCol: {
      xs: { span: 54, offset: 0 },
      sm: { span: 30, offset: 4 },
    },
  };

  return (
    <Modal title={currentRow ? 'Edit Products' : 'Add Products'} footer={null} visible={isFormVisible} onCancel={() => setIsFormVisible(false)} {...formItemLayout}>
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
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label="Product Price"
          name="category_price"
          rules={[{ required: true, message: 'Please enter product product price!' }]}
        >
          <InputNumber min={0.00} />
        </Form.Item>

        <Form.Item
          label="Build Hours"
          name="category_hrs"
          rules={[{ required: true, message: 'Please enter product building hours!' }]}
        >
          <Input />
        </Form.Item>


        {/** 
                    <Form.Item label="needed_part">
            <Input.Group compact>
                
                <Form.Item
                  name={ ['needed_part','part']}

                  rules={[
                    {
                      message: 'Please choose a need part',
                    },
                  ]}
                >
                 <Select
                        
                        //value={getItemOptions(currentRow?.needed_part)}

                        placeholder="Select needed part"
                        width="250%"
                        options={itemList.map((item) => ({
                            value: item._id,
                            label: item.item_name,
                        }))}
                    />

                </Form.Item>

                <Form.Item
                  name={['needed_part','needed_qty'] }

                  rules={[
                    {
                        type: 'number', min: 0,
                    },
                  ]}
                >
                  <InputNumber placeholder="Enter Needed Qty"/>
                </Form.Item>

</Input.Group>
</Form.Item>


                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 12,
                    }}
                >
                    **/}
        <Form.List name="needed_part" >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.needed_part !== curValues.needed_part
                    }
                  >
                    {() => (
                      <Form.Item
                        {...field}
                        //label="Part Name"
                        name={[field.name, 'part']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing part',
                          },
                        ]}
                      >
                        {/**

                     <Select
                        disabled={!form.getFieldValue('area')}
                        style={{
                          width: 130,
                        }}
                      >
                        {(sights[form.getFieldValue('area')] || []).map((item) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
 */}
                        <Select

                          //value={getItemOptions(currentRow?.needed_part)}

                          placeholder="Select needed part"
                          style={{
                            width: '200%',
                          }}
                          options={itemList.map((item) => ({
                            value: item._id,
                            label: item.item_name,
                          }))}
                        />
                      </Form.Item>
                    )}
                  </Form.Item>
                  <Form.Item
                    {...field}
                    //label="Needed QTY"
                    name={[field.name, 'needed_qty']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing needed_qty',
                      },
                    ]}
                  >
                    <InputNumber placeholder="Enter Needed Qty" />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}

              <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{
                  width: '250%',
                }}>
                  Add needed Part
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
};

export default CategoryForm;