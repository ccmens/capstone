
import './Sales.css';
import { Button, Col, Input, message, Row, Space, Table } from 'antd';
import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import {
    salesList as salesListAPI, salesAdd, salesUpdate, salesDelete,
    categoryList as categoryListAPI,
} from '@services/api.service';
import SalesForm from './components/SalesForm';
import ConfirmComponent from '@components/ConfirmComponent';
import ExportButton from '@components/ExportButton';
import { ExportToCsv } from '@components/ExportUtils';
import moment from 'moment';


async function HandleAction(action, id, params) {
    try {
        if (action === 'add') {
            await salesAdd(params);

        } else if (action === 'update') {
            await salesUpdate(id, params);
        } else if (action === 'delete') {
            await salesDelete(id);
        }
        else if (action === 'sales-list') {
            await salesListAPI();
        } else if (action === 'category-list') {
            await categoryListAPI();
        }
        message.success('Handle action success');
        return true;
    } catch (error) {
        const text = `handle action is error: ${error?.data?.message || 'please try again'}`;
        console.log(text);
        message.error(text);
        return false;
    }
}




const Sales = ({ user }) => {

    const [loading, setLoading] = useState(true);
    const [salesList, setSalesList] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [search, setSearch] = useState("");

    const BUTTON = styled(Button)`
    border-radius: 20px;
  width: 75px;
  height: 40px;
`

    const showModal = (row) => {
        setCurrentRow(row);
        setIsFormVisible(true);
    };



    const columns = [

        {
            title: 'Products Name',
            dataIndex: 'category',
            render: (_, row) => row.category?.category_name,

        },
        {
            title: 'Sales Quantity ',
            dataIndex: 'sales_qty',

        },
        {
            title: 'Updated Product Inventory',
            dataIndex: 'category',
            render: (_, row) => {
                const stock = Number(row.category.category_qty);
                return stock;
            }

        },

        {
            title: 'Total Sell ($CAD)',
            dataIndex: 'total_sales',

        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
        },
        {
            //title: 'Needed Part',
            //dataIndex: 'needed_part',
            //render: (_,row) => <ol>{getPartItemList(row?.needed_part.item)}</ol>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, row) => (
                <Space size="middle">
                    <Button onClick={() => showModal(row)}>Edit</Button>
                    <BUTTON
                        type="danger"
                        onClick={() =>
                            ConfirmComponent(async () => {
                                await HandleAction("delete", row._id, null);
                                setLoading(true);
                            })
                        }
                    >
                        {row.deleted ? 'Delete Permanently' : 'Delete'}
                    </BUTTON>
                </Space>
            ),
        }
    ];




    useEffect(() => {
        if (!loading || !user) {
            return;
        }
        setCurrentRow(null);
        setIsFormVisible(false);
        setLoading(false);

        async function getSalesList() {
            try {
                const result = await salesListAPI();
                const list = result.data.map((item, index) => ({ ...item, key: index + 1 }));
                setSalesList(list);


            } catch (error) {
                console.log('getSaleslist is error: ', error.message);
            }
        }

        getSalesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps

        async function getCategoryList() {
            try {
                const result = await categoryListAPI();
                setCategoryList(result.data);
            } catch (error) {
                console.log("getProductList is error: ", error.message);
            }
        }

        getCategoryList();

    }, [loading, user]);

    console.log(categoryList);
    useEffect(() => {
        if (!search) {
            setTableList(salesList);
            return;
        }
        const lists = salesList.filter((item) => item.category.category_name.includes(search));
        setTableList(lists);
    }, [search, salesList]);

    const handleSubmit = async (values) => {
        const result = currentRow ? await HandleAction('update', currentRow._id, values) : await HandleAction('add', null, values);

        if (result) {
            setLoading(true);
        } else {
            console.log('handleSubmit is error');
        }
    }

    return (
        <>
            <div className='item-wrap'>

                <h3 className='common-title'>Sales History</h3>

                <div className='flex justify-between'>
                    <Row>
                        <Space>
                            <BUTTON type="primary" size='large' onClick={() => showModal(null)}>Add</BUTTON>
                        </Space>
                    </Row>
                    <Row>
                        <Col>
                            Search Sale By Product Name:
                            <Input value={search} size='large' onChange={(e) => setSearch(e.target.value)}
                                placeholder="Enter product name" style={{ width: 200, marginLeft: '1rem', marginRight: '1rem' }} />
                            <BUTTON size='large' onClick={() => setSearch('')}>Clear</BUTTON>
                        </Col>
                    </Row>

                </div >
                <Table
                    style={{
                        marginTop: '10px'
                    }} columns={columns} dataSource={tableList} />
                <SalesForm
                    handleSubmit={handleSubmit}
                    isFormVisible={isFormVisible}
                    setIsFormVisible={setIsFormVisible}
                    currentRow={currentRow}
                    categoryList={categoryList}
                />
            </div>
        </>
    );
}
export default Sales;


