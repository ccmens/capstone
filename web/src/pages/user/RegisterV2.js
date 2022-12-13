import React from "react";
import "./User.css";
import styled from "styled-components";
import { message, Button, Form, Input, Space } from "antd";
import { useNavigate } from "react-router-dom";
import BannerSection from "../../components/BannerSection";

export default function RegisterV2({ handleAction }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("onFinish:", values);
    if (values.password !== values.confirm_password) {
      message.error("Password and Confirm Password are not same");
      return;
    }
    const result = await handleAction("register", null, values);
    if (result) {
      message.success("Register success");
      navigate("/login");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onReset = () => {
    form.resetFields();
  };

  const EMAIL = styled(Input)`
  padding: 6px;
`
  const PASSWORD = styled(Input.Password)`
  padding: 6px;
`

  const NAME = styled(Input)`
  padding: 6px;
  `

  return (
    <>
      <BannerSection title="Welcome To Variable Oscillations-Inventory MGMT" color='white' />
      <div className="register-wrap">
        {/* <h3>Register</h3> */}
        <div className="register-form">
          <Form
            name="basic"
            layout="vertical"
            form={form}
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
              <EMAIL />
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
              <PASSWORD />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirm_password"
              rules={[
                {
                  required: true,
                  min: 6,
                  message:
                    "Please input confirm password, it at least 6 characters!",
                },
              ]}
            >
              <PASSWORD />
            </Form.Item>

            <Form.Item
              label="First Name"
              name="first_name"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <NAME />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <NAME />
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
        </div>
      </div>
    </>
  );
}
