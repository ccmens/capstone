import React, { useState, useEffect } from 'react';
import { Column, Bar, Line } from '@ant-design/charts';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Layout, Card, Col, Row, Statistic } from 'antd';

import {
  salesList as salesListAPI,
  categoryList as categoryListAPI,
} from '@services/api.service';
import moment from 'moment';
import './Dashboard.css';
const { Content } = Layout;
const Dashboard = ({ user }) => {
  const [salesList, setSalesList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRow, setCurrentRow] = useState(null);

  useEffect(() => {
    if (!loading || !user) {
      return;
    }
    setCurrentRow(null);
    //setIsFormVisible(false);
    setLoading(false);

    async function getCategoryList() {
      try {
        const result = await categoryListAPI();
        const list = result.data.map((item, index) => ({ ...item, key: index + 1 }));
        setCategoryList(list);


      } catch (error) {
        console.log('getCategorylist is error: ', error.message);
      }
    }

    getCategoryList();


    async function getSalesList() {
      try {
        const result = await salesListAPI();
        setSalesList(result.data);

      } catch (error) {
        console.log("getSalesList is error: ", error.message);
      }
    }

    getSalesList();

  }, [loading, user]);


  const data = [];
  let total_qty = 0;
  let total_sales = 0;
  let sales_qty = 0;

  //sales data
  salesList.forEach(item => {
    total_qty += item.sales_qty;
    total_sales += item.total_sales;
    sales_qty = item.sales_qty;
    data.push({
      date: moment(item.created_at).format('YYYY-MM-DD'),
      category: item?.category?.category_name,
      sales_qty: item.sales_qty,
      total_qty: total_qty,
      total_sales: total_sales,
    })

  });
  //product data
  let low_stock = 0;
  let low_stock_message = "";
  categoryList.forEach(item => {
    if (item.category_qty < 5) {
      low_stock += 1;

    } else {
      low_stock = 0;

    }
  });
  if (low_stock > 0) {
    low_stock_message = low_stock + " Product out of Stock! ";
  } else {
    low_stock_message = " All products are buildable. ";
  }
  const config_cl = {
    forceFit: true,
    title: {
      visible: true,
      text: 'Total Sales',
    },
    data,
    xField: 'date',
    yField: 'sales_qty',
    seriesField: 'category',
    isGroup: 'true',
  };
  return (
    <>

      <div className="site-statistic-demo-card">
        <Row gutter={[48, 40]} justify="center">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Sales Price"
                value={total_sales}
                suffix="cad"
                valueStyle={{
                  color: '#3f8600',
                }}
                prefix="$"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Sold Product"
                value={total_qty}
                suffix="units"
                valueStyle={{
                  color: '#05439F',
                }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="LOW STOCK WARNING"
                value={low_stock_message}
                valueStyle={{
                  color: '#cf1322',
                }}
              //prefix="!"
              />
            </Card>
          </Col>
        </Row>

        <Row style={{
          margin: '30px 16px 0',
        }}
        >
          <Col span={24}>
            <Card>
              <Column {...config_cl} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
};
export default Dashboard;