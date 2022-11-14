
import './Category.css';
import { Table, Button, Space, message } from 'antd';
import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { StopOutlined } from '@ant-design/icons';
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
            render: (_, row) => {
                if (row.category_qty == 0) {
                    return (
                        <span style={{ color: 'red' }}>
                            <StopOutlined /><span> Out of stock</span>
                        </span>
                    );
                } else if (row.category_qty < 10) {
                    return (
                        <span style={{ color: 'orange' }}>
                            <span>Running low!<br />{row.category_qty}</span>
                        </span>
                    );
                } else {
                    return <span>{row.category_qty}</span>
                }
            }
        },
        {
            title: 'Product Price ($CAD)',
            dataIndex: 'category_price',
        },
        {
            title: 'Build Duration (hrs)',
            dataIndex: 'category_hrs',
        },
        {
            title: 'Create At',
            dataIndex: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD HH:mm')
        },
        {
            title: 'Needed Part',
            dataIndex: 'needed_part',
            render: (_,row) => <ol>{getPartItemList(row?.needed_part)}</ol>
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



    const getPartItemList = (ids) => {
        console.log('ids=', ids)
        // return 'aaaa';
        if (!ids) {
            return 'item is empty';
        }
        let text = "";
        const list = [];
        ids.forEach(id => {
            const item = itemList.find(item => item._id === id);
            if (item) {
                list.push(item);
                
                text +=  item.item_name + '\r\n';
            }
        });
        return text;
    }

/*
        const nestedcolumns = [
          {
            title: 'Part Name',
            dataIndex: 'needed_part',
            render:(_,row) => row._id?.item?.item_name,
            
          },
          
          {
            title: 'Needed QTY',
            dataIndex: 'needed_qty',
          },
          {
            title: 'Unit Price',
            dataIndex: 'price',
          },
          
        ];
  */
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
                dataSource={categoryList}/>
                
            </div>
        </>
    );
}
export default Category;


