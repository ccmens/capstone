import { Modal, Checkbox, Row, Col, Input, Form, Button } from "antd";
import React, { useState } from "react";
import { itemList as itemListAPI } from "@services/api.service";
import { CSVLink } from "react-csv";

export default function ItemReportForm({
  isReportVisible,
  setIsReportVisible,
}) {
  const [csvData, setCsvData] = useState(null);

  async function fetchData() {
    const result = await itemListAPI();
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
        return true;
      });

      const data = [];
      for (let index = 0; index < result.length; index++) {
        const tempObject = {};
        if (values.report_selection.find((item) => item === "addedBy"))
          tempObject.addedBy =
            result[index].owner.first_name +
            " " +
            result[index].owner.last_name;

        if (values.report_selection.find((item) => item === "itemName"))
          tempObject.itemName = result[index].item_name;

        if (values.report_selection.find((item) => item === "itemCategory"))
          tempObject.itemCategory = result[index].category.category_name;

        if (values.report_selection.find((item) => item === "itemPrice"))
          tempObject.itemPrice = result[index].price;

        if (values.report_selection.find((item) => item === "createdAt"))
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
      title="Create Item Report"
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
                <Checkbox value="addedBy">Added By</Checkbox>
              </Col>
              <Col style={{ margin: "10px 12px" }}>
                <Checkbox value="itemName">Item Name</Checkbox>
              </Col>
              <Col style={{ margin: "10px 12px" }}>
                <Checkbox value="itemCategory">Item Category</Checkbox>
              </Col>
              <Col style={{ margin: "10px 12px" }}>
                <Checkbox value="itemPrice">Item Price</Checkbox>
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
