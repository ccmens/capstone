import React from "react";
import "./User.css";
import { Alert, Button, Checkbox, Form, Input, message, Space } from "antd";
import "./Login.css";
import styled from "styled-components";
import { Link } from "react-router-dom";
import BannerSection from "../../components/BannerSection";

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
    const onForgot = () => {
        message.success("Please contact Dev Team for further change.");
    };
    const EMAIL = styled(Input)`
        padding: 8px;
    `
    const PASSWORD = styled(Input.Password)`
        padding: 8px; 
    `
    return (
        <>
            <BannerSection title="Welcome To Variable Oscillations-Inventory MGMT" color='white' />
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
                            <Checkbox>Remember me</Checkbox>
                            <Button type="text" style={{ float: "right" }} onClick={onForgot}>
                                Forgot password
                            </Button>
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
                </div>
            </div>
        </>
    );
}
