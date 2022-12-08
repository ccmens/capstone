import "./Report.css";
import { Button, Col, Input, message, Row, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    categoryList as categoryListAPI,
    itemExport,
    itemList as itemListAPI,
} from "@services/api.service";
import { Report } from "./components/Report";
import Dashboard from "../../components/Dashboard";
import ExportButton from '@components/ExportButton';
import { ExportToCsv } from '@components/ExportUtils';

async function HandleAction(action, id, params) {
    try {
        var result = null;
        switch (action) {
            case "export":
                result = await itemExport(id);
                break;
            case "item-list":
                result = await itemListAPI();
                break;
            case "category-list":
                result = await categoryListAPI();
                break;
            default:
                break;
        }
        return result;
    } catch (error) {
        const text = `handle action is error: ${error?.data?.message || "please try again"
            }`;
        console.log(text);
        message.error(text);
        return null;
    }
}

const ItemList = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [itemList, setItemList] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [search, setSearch] = useState("");
    const [totalBox, settotalBox] = useState([]);

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
    useEffect(() => {
        //const result =  categoryListAPI();
        //console.log("result: " + result.data);

        async function getDataList() {
            try {
                const cateResult = await categoryListAPI();
                const cateList = cateResult.data;
                const itemResult = await itemListAPI();
                const itemList = itemResult.data;
                //  cont itemListReult = 
                setCategoryList(cateList);
                setItemList(itemList);


            } catch (error) {
                console.log('getCategorylist is error: ', error.message);
            }
        }

        getDataList();
    }, [])
    // dataOutput samples
    console.log("categoryList: " + categoryList.length);
    console.log("itemList: " + itemList.length);

    const productBox = [
        {
            productID: 1,
            name: "Product",
            productType: "product",
            dataIndex: "category",
            render: (_, row) => {
                return (<span>{row.item_name.categoryList.length}</span>);
            }
        },
        {
            productID: 2,
            name: "Part",
            productType: "part",
            dataIndex: 'stock',
            render: (_, row) => {
                return (<span>{row.item_name.length}</span>);
            }
        },
        {
            productID: 3,
            name: "Low in Stock",
            productType: "part",
            dataIndex: "stock",
            render: (_, row) => {
                if (row.stock < 10 && row.stock > 0) {
                    return (<span>{row.item_name.length}</span>);
                }
            }
        },
        {
            productID: 4,
            name: "Out of Stock",
            productType: "part",
            dataIndex: "stock",
            render: (_, row) => {
                if (row.stock == 0) {
                    return (<span>{row.item_name.length}</span>);
                }
            }
        },
    ]
    const columns = [
        {
            title: 'Picture',
            dataIndex: 'image',
            render: (_, row) => {
                if (row.stock < 10) {
                    return (
                        <img alt={row.name} width={100} height={100}
                            src={row.image || '/images/default-item.png'}
                            style={{ 'object-fit': 'contain' }} />
                    )
                }
            }
        },
        {
            title: 'Item Name',
            dataIndex: 'item_name',
            render: (_, row) => {
                if (row.stock < 10) {
                    return (
                        <span>{row.item_name}</span>
                    )
                }
            }
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            render: (_, row) => {
                if (row.stock < 10) {
                    return (
                        <span style={{ color: 'red', fontSize: 20 }}>
                            {row.stock} left</span>
                    );
                }
            }
        },
    ];

    useEffect(() => {
        if (!loading || !user) {
            return;
        }
        setLoading(false);

        async function fetchData() {
            const result = await HandleAction('item-list');
            if (result) {
                const lists = result.data.map((item, index) => ({ ...item, key: index + 1 }));
                setItemList(lists);
                setTableList(lists);
            }
            const categorys = await HandleAction('category-list');
            if (categorys) {
                setCategoryList(categorys.data);
                console.log("categorys.data: " + categorys.data);
            }
        }
        fetchData();
    }, [loading, user]);

    useEffect(() => {
        if (!search) {
            setTableList(itemList);
            return;
        }
        const lists = itemList.filter((item) => item.item_name.includes(search));
        setTableList(lists);
    }, [search, itemList]);

    return (
        <>
            {/* <div className='Box'>
                {productBox.map(productBox => (
                    <Report
                        key={productBox.id}
                        name={productBox.name}
                        unitLeft={productBox.dataIndex}
                    />
                ))}
            </div> */}


            <div className='item-wrap'>

                <h3 className='common-title'>Report Dashboard</h3>

                {user && <Dashboard user={user} />}
                <h3 className='common-title'>Low in Stock</h3>

                <div className='flex justify-between'>
                    <Row>
                        <Space>
                            <ExportButton onExport={async () => {
                                const result = await HandleAction('export', null, null);
                                if (result) {
                                    ExportToCsv(result.data, 'item-export.csv');
                                } else {
                                    message.error('Export is error, please try again');
                                }
                            }}>
                                Export Complete Item Inventory
                            </ExportButton>
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
                <Table style={{
                    marginTop: '10px'
                }} columns={columns} dataSource={tableList} />
            </div>
        </>
    );
}

export default ItemList;
