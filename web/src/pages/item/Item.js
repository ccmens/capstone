import "./Item.css";
import { Button, Col, Input, message, Row, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    categoryList as categoryListAPI,
    itemAdd,
    itemDelete,
    itemExport,
    itemList as itemListAPI,
    itemRecover,
    itemUpdate,
} from "@services/api.service";
import ItemForm from "./components/ItemForm";
import ConfirmComponent from "@components/ConfirmComponent";
import ExportButton from '@components/ExportButton';
import { ExportToCsv } from '@components/ExportUtils';
import { StopOutlined } from '@ant-design/icons';
import moment from "moment";

async function HandleAction(action, id, params) {
    try {
        if (action === "add") {
            await itemAdd(params);
        } else if (action === "update") {
            await itemUpdate(id, params);
        } else if (action === "delete") {
            await itemDelete(id);
        } else if (action === "recover") {
            await itemRecover(id);
        } else if (action === "export") {
            await itemExport(id);
        }
        message.success('Handle action success');
        return true;
    } catch (error) {
        const text = `handle action is error: ${error?.data?.message || "please try again"
            }`;
        console.log(text);
        message.error(text);
        return false;
    }
}

const ItemList = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [itemList, setItemList] = useState([]);
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

    const EXPORTBUTTON = styled(ExportButton)`
        border-radius: 20px;
      width: 150px;
      height: 40px;
        
    `
    const showModal = (row) => {
        setCurrentRow(row);
        setIsFormVisible(true);
    };

    const columns = [
        // {
        //   title: 'Id',
        //   dataIndex: '_id',
        // },
        {
            title: 'Picture',
            dataIndex: 'image',
            render: (_, row) => <img alt={row.name} width={200} height={200}
                src={row.image || '/images/default-item.png'}
                style={{
                    'object-fit': 'contain'
                }} />,
        },
        {
            title: 'Item Name',
            dataIndex: 'item_name',
        },

        // {
        //     title: 'Product',
        //     dataIndex: 'category',
        //     render: (_, row) => row.category?.category_name,
        // },
        // {
        //     title: 'Needed Qty',
        //     dataIndex: 'needed_qty',
        // },

        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            render: (_, row) => {
                if (row.stock == 0) {
                    return (
                        <span style={{ color: 'red' }}>
                            <StopOutlined /><span> Out of stock</span>
                        </span>
                    );
                } else if (row.stock < 10) {
                    return (
                        <span style={{ color: 'orange' }}>
                            <span>Running low!<br />{row.stock}</span>
                        </span>
                    );
                } else {
                    return <span>{row.stock}</span>
                }
            }
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, row) => (
                <Space size="middle">
                    <BUTTON onClick={() => showModal(row)}>Edit</BUTTON>
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
                    {row.deleted && (<Button type='primary'
                        onClick={() =>
                            ConfirmComponent(async () => {
                                await HandleAction("recover", row._id, null);
                                setLoading(true);
                            }, 'Are you sure to recover this item?')
                        }
                    >Recover</Button>)}
                </Space>
            ),
        }

    ];


    const nestedcolumns = [
        {
            title: 'Realted Procuct',
            dataIndex: 'category_name',
            render: (_, row) => row.category_name?.category_name,
        },

    ];


    useEffect(() => {
        if (!loading || !user) {
            return;
        }
        setCurrentRow(null);
        setIsFormVisible(false);
        setLoading(false);

        async function getItemList() {

            try {
                const result = await itemListAPI();
                const lists = result.data.map((item, index) => ({ ...item, key: index + 1 }));
                setItemList(lists);
                setTableList(lists);

            } catch (error) {
                console.log("getPartList is error: ", error.message);
            }
        }
        getItemList();

        async function getCategoryList() {
            try {
                const result = await categoryListAPI();
                setCategoryList(result.data);
            } catch (error) {
                console.log("getCategoryList is error: ", error.message);
            }
        }

        getCategoryList();


    }, [loading, user]);

    useEffect(() => {
        if (!search) {
            setTableList(itemList);
            return;
        }
        const lists = itemList.filter((item) => item.item_name.includes(search));
        setTableList(lists);
    }, [search, itemList]);

    const handleSubmit = async (values) => {
        const result = currentRow ?
            await HandleAction('update', currentRow._id, values) :
            await HandleAction('add', null, values);
        if (result) {
            setLoading(true);
            message.success('Handle action success');
        } else {
            message.error('Handle action failed, please try again');
        }
    };

    return (
        <>
            <div className='item-wrap'>

                <h3 className='common-title'>Parts</h3>

                <div className='flex justify-between'>
                    <Row>
                        <Space>
                            <BUTTON type="primary" size='large' onClick={() => showModal(null)}>Add</BUTTON>
                        </Space>
                    </Row>

                    <Row>
                        <Col>
                            Search Item By Name:
                            <Input value={search} size='large' onChange={(e) => setSearch(e.target.value)}
                                placeholder="Enter item name" style={{ width: 200, marginLeft: '1rem', marginRight: '1rem' }} />
                            <BUTTON size='large' onClick={() => setSearch('')}>Clear</BUTTON>
                        </Col>
                    </Row>

                </div >
                <Table
                    expandable={{
                        expandedRowRender: record => {
                            return <Table columns={nestedcolumns} dataSource={record.category} pagination={false} />;
                        },
                    }}
                    style={{
                        marginTop: '10px'
                    }} columns={columns} dataSource={tableList} />
                <ItemForm
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

export default ItemList;
