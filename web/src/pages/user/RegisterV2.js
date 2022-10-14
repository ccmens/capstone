import React from "react";
import "./User.css";
import { message, Button, Form, Input, Space } from "antd";
import BannerSection from "@components/BannerSection";
import { useNavigate } from "react-router-dom";

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

  return (
    <>
      <BannerSection title="Register" />

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
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="First Name"
              name="first_name"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input />
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
