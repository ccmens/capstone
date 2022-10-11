import { Modal, Checkbox, Row, Col, Input, Form, Button } from "antd";
import React, { useState } from "react";
import { userList as userListAPI } from "@services/api.service";
import { CSVLink } from "react-csv";

export default function UserReportForm({
  isReportVisible,
  setIsReportVisible,
}) {
  const [csvData, setCsvData] = useState(null);

  async function fetchData() {
    const result = await userListAPI();
    if (result) {
      return result.data;
    }
  }

  const handleFormSubmit = async (values) => {
    if (
      values?.report_selection?.length &&
      values?.report_selection?.length > 0
    ) {
      const result = await fetchData();
      const headers = [];
      values.report_selection.map((item) => {
        headers.push({
          label: item,
          key: item,
        });
      });

      console.log(result);

      const data = [];
      for (let index = 0; index < result.length; index++) {
        const tempObject = {};
        if (values.report_selection.find((item) => item == "name"))
          tempObject.name =
            result[index].first_name +
            " " +
            result[index].last_name;

        if (values.report_selection.find((item) => item == "email"))
          tempObject.email = result[index].email;

        if (values.report_selection.find((item) => item == "role"))
          tempObject.role = result[index].role.role_name;

        if (values.report_selection.find((item) => item == "createdAt"))
          tempObject.createdAt = result[index].created_at;

        data.push(tempObject);
      }

      const csvReport = {
        filename: values.report_title,
        headers: headers,
        data: data,
      };

      console.log("csvReport", csvReport);
      console.log("data", data);

      setCsvData(csvReport);
    }
  };

  return (
    <Modal
      title="Create User Report"
      footer={null}
      visible={isReportVisible}
      onCancel={() => setIsReportVisible(false)}
    >
      <Form onFinish={handleFormSubmit}>
        <Form.Item
          name="report_title"
          required
          label="Report Title"
          rules={[{ required: true, message: "Please enter report title!" }]}
        >
          <Input />
        </Form.Item>
        <p>Select atleast 1 field to create report!</p>
        <Form.Item name="report_selection">
          <Checkbox.Group
            style={{ width: "100%" }}
            onChange={(values) => console.log(values)}
          >
            <Row>
              <Col style={{ margin: "10px 12px" }}>
                <Checkbox value="name">Name</Checkbox>
              </Col>
              <Col style={{ margin: "10px 12px" }}>
                <Checkbox value="email">Email</Checkbox>
              </Col>
              <Col style={{ margin: "10px 12px" }}>
                <Checkbox value="role">Role</Checkbox>
              </Col>
              <Col style={{ margin: "10px 12px" }}>
                <Checkbox value="createdAt">Created At</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item style={{ margin: "auto", width: "fit-content" }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        {csvData && <CSVLink {...csvData}>Download Report</CSVLink>}
      </Form>
    </Modal>
  );
}
