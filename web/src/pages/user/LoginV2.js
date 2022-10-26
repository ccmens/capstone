import React from "react";
import "./User.css";
import { Alert, Button, Checkbox, Form, Input, message, Space } from "antd";
import "./Login.css";
import styled from "styled-components";
import { Link } from "react-router-dom";

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
    const EMAIL = styled(Input)`
      border-radius: 20px;
      padding: 10px;
    `
    const PASSWORD = styled(Input.Password)`
      border-radius: 20px;
      padding: 10px;
    `
    return (
        <>
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
                            className="email"

                            rules={[
                                {
                                    type: "email",
                                    required: true,
                                    message: "Please input your email!",
                                },
                            ]}
                        >
                            <EMAIL />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            className="password"
                            rules={[
                                {
                                    required: true,
                                    min: 6,
                                    message:
                                        "Please input your password, it at least 6 characters!",
                                },
                            ]}
                        >
                            <PASSWORD />
                        </Form.Item>
                        <Link to="/register" style={{ color: "blue" }}> Don't have an account yet?  Register! </Link>

                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox><br />
                        </Form.Item>


                        <Form.Item>
                            <Space>
                                <Button type="primary" style={{ borderRadius: "20px" }} htmlType="submit">
                                    Submit
                                </Button>
                                <Button htmlType="button" style={{ borderRadius: "20px" }} onClick={onReset}>
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
