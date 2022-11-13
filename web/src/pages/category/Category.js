
import './Category.css';
import { Table, Button, Space, message } from 'antd';
import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import {
    categoryList as categoryListAPI, categoryAdd, categoryUpdate, categoryDelete,
    itemList as itemListAPI
} from '@services/api.service';
import CategoryForm from './components/CategoryForm';
import BannerSection from '@components/BannerSection';
import ConfirmComponent from '@components/ConfirmComponent';
import moment from 'moment';
import AdminManageBar from "../../components/AdminManageBar";
import UserManageBar from "../../components/UserManageBar";

async function HandleAction(action, id, params) {
    try {
        if (action === 'add') {
            await categoryAdd(params);
        } else if (action === 'update') {
            await categoryUpdate(id, params);
        } else if (action === 'delete') {
            await categoryDelete(id);
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


const Category = ({ user }) => {

    const [loading, setLoading] = useState(true);
    const [categoryList, setCategoryList] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

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
            dataIndex: 'category_name',
            // render: (_, row) => (
            //     <p>{getPartItemList(row?.needed_part)}</p>
            // ),
        },
        {
            title: 'Product Stock',
            dataIndex: 'category_qty',
        },
        {
            title: 'Product Price ($cad)',
            dataIndex: 'category_price',
        },
        {
            title: 'Build Hours (hrs)',
            dataIndex: 'category_hrs',
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


    const nestedcolumns = [
        {
            title: 'Part Name',
            dataIndex: 'item_name',
            //render: (_, row) => row.item?.item_name,
        },
        /*
        {
          title: 'Needed QTY',
          dataIndex: 'needed_qty',
        },
        {
          title: 'Unit Price',
          dataIndex: 'price',
        },
        */
    ];

    const getPartItemList = (ids) => {
        if (!ids) {
            return 'item is empty';
        }
        let text = '';
        const list = [];
        ids.forEach(id => {
            const item = itemList.find(item => item._id === id);
            if (item) {
                list.push(item);
                text += item.item_name + '<br/>';
            }
        });
        return text;
    }

    console.log(tableList);

    useEffect(() => {
        if (!loading || !user) {
            return;
        }
        setCurrentRow(null);
        setIsFormVisible(false);
        setLoading(false);

        async function getCategoryList() {
            try {
                const result = await categoryListAPI();

                const list = result.data.map((item, index) => ({ ...item, key: index + 1 }));
                setCategoryList(list);
                const nestedList = result.data.map((item, index) => {
                    return {
                        item: item.needed_part
                    }
                });
                setTableList(nestedList);
            } catch (error) {
                console.log('getCategorylist is error: ', error.message);
            }
        }

        getCategoryList();
        // eslint-disable-next-line react-hooks/exhaustive-deps

        async function getItemList() {
            try {
                const result = await itemListAPI();
                setItemList(result.data);
            } catch (error) {
                console.log("getPartList is error: ", error.message);
            }
        }

        getItemList();

    }, [loading, user]);

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
            <div className='category-wrap'>
                <h3 className='common-title'>Products List</h3>

                <Button type="primary" size='large' onClick={() => showModal(null)}>Add</Button>
                <CategoryForm
                    handleSubmit={handleSubmit}
                    isFormVisible={isFormVisible}
                    setIsFormVisible={setIsFormVisible}
                    currentRow={currentRow}
                    itemList={itemList}
                />

                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => {
                            return <Table rowKey={record => record.key} columns={nestedcolumns} dataSource={record.needed_part} pagination={false} />;
                        },
                        defaultExpandedRowKeys: ['0'],
                    }}
                    dataSource={categoryList} />

            </div>
        </>
    );
}
export default Category;


