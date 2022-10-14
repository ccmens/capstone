import React from "react";
import "./User.css";
import { Button, Checkbox, Form, Input, message, Space, Alert } from "antd";
import BannerSection from "@components/BannerSection";

export default function LoginV2({ handleAction }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("Success:", values);
    const result = await handleAction("login", null, values);
    if (result) {
      message.success("Login success");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      <BannerSection title="Login" background="/images/login-hero.jpg" />

      <div className="login-wrap">
        {/* <h3>Login</h3> */}
        <div className="login-form">
          <Form
            name="basic"
            form={form}
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  min: 6,
                  message:
                    "Please input your password, it at least 6 characters!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
          <Alert
            message="Test Accounts"
            description={`
                            admin123@gmail.com,password (admin);
                            admin456@gmail.com,password (admin);
                            user123@gmail.com,password (user);
                            user456@gmail.com,password (user)`}
            type="info"
            showIcon
          />
        </div>
      </div>
    </>
  );
}
