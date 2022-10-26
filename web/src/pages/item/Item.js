import "./Item.css";
import {Button, Col, Input, message, Row, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
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
import {ExportToCsv} from '@components/ExportUtils';
import moment from "moment";

async function HandleAction(action, id, params) {
    try {
        var result = null;
        switch (action) {
            case "add":
                result = await itemAdd(params);
                break;
            case "update":
                result = await itemUpdate(id, params);
                break;
            case "delete":
                result = await itemDelete(id);
                break;
            case "recover":
                result = await itemRecover(id);
                break;
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
        // message.success('Handle action success');
        return result;
    } catch (error) {
        const text = `handle action is error: ${error?.data?.message || "please try again"
        }`;
        console.log(text);
        message.error(text);
        return null;
    }
}

const ItemList = ({user}) => {
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

    const EXPORTBUTTON = styled(Button)`
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
                                     src={row.image || '/images/default-item.png'}/>,
        },
        {
            title: 'Item Name',
            dataIndex: 'item_name',
        },

        {
            title: 'Products',
            dataIndex: 'category',
            render: (_, row) => row.category?.category_name,
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'User Name',
            dataIndex: 'owner',
            render: (_, row) => row.owner?.email,
        },
        {
            title: 'Create At',
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


    useEffect(() => {
        if (!loading || !user) {
            return;
        }
        setCurrentRow(null);
        setIsFormVisible(false);
        setLoading(false);

        async function fetchData() {

            const result = await HandleAction('item-list');
            if (result) {
                const lists = result.data.map((item, index) => ({...item, key: index + 1}));
                setItemList(lists);
                setTableList(lists);
            }
            const categorys = await HandleAction('category-list');
            if (categorys) {
                setCategoryList(categorys.data);
            }
        }

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

                <h3 className='common-title'>Item List</h3>

                <Row>
                    <Space>
                        <BUTTON type="primary" size='large' onClick={() => showModal(null)}>Add</BUTTON>
                        <EXPORTBUTTON onExport={async () => {
                            const result = await HandleAction('export', null, null);
                            if (result) {
                                ExportToCsv(result.data, 'item-export.csv');
                            } else {
                                message.error('Export is error, please try again');
                            }
                        }}>
                            Export to CSV
                        </EXPORTBUTTON>
                    </Space>
                </Row>
                <Row>
                    <Col>
                        Search Item By Name:
                        <Input value={search} size='large' onChange={(e) => setSearch(e.target.value)}
                               placeholder="Enter item name" style={{width: 200, marginLeft: '1rem'}}/>
                        <BUTTON size='large' onClick={() => setSearch('')}>Clear</BUTTON>
                    </Col>
                </Row>
                <Table style={{marginTop: '10px'}} columns={columns} dataSource={tableList}/>
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