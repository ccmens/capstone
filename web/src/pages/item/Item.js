import "./Item.css";
import { Table, Button, Space, message, Input, Row, Col } from "antd";
import React, { useState, useEffect } from "react";
import {
  itemList as itemListAPI,
  itemAdd,
  itemUpdate,
  itemDelete,
  itemRecover,
  itemExport,
  categoryList as categoryListAPI,
} from "@services/api.service";
import ItemForm from "./components/ItemForm";
import BannerSection from "@components/BannerSection";
import ConfirmComponent from "@components/ConfirmComponent";
import ExportButton from '@components/ExportButton';
import { ExportToCsv } from '@components/ExportUtils';
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

export default function ItemList({ user }) {
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [search, setSearch] = useState("");

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
      title: 'Item Name',
      dataIndex: 'item_name',
    },
    {
      title: 'Picture',
      dataIndex: 'image',
      render: (_, row) => <img alt={row.name} width={60} height={60} src={row.image || '/images/default-item.png'} />,
    },
    {
      title: 'Category',
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
          <Button onClick={() => showModal(row)}>Edit</Button>
          <Button
            type="danger"
            onClick={() =>
              ConfirmComponent(async () => {
                await HandleAction("delete", row._id, null);
                setLoading(true);
              })
            }
          >
            {row.deleted ? 'Delete Permanently' : 'Delete'}
          </Button>
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
        const lists = result.data.map((item, index) => ({ ...item, key: index + 1 }));
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
      <BannerSection color="#fff" title="Parts Management"/>
      <div className='item-wrap'>
        <h3 className='common-title'>Item List</h3>
        <Row>
          <Space>
            <Button type="primary" size='large' onClick={() => showModal(null)}>Add</Button>
            <ExportButton onExport={async () => {
              const result = await HandleAction('export', null, null);
              if (result) {
                ExportToCsv(result.data, 'Group5-item-export.csv');
              } else {
                message.error('Export is error, please try again');
              }
            }}>
              Export to CSV
            </ExportButton>
          </Space>
        </Row>
        <Row>
          <Col>
            Search Item By Name:
            <Input value={search} size='large' onChange={(e) => setSearch(e.target.value)} placeholder="Enter item name" style={{ width: 200, marginLeft: '1rem' }} />
            <Button size='large' onClick={() => setSearch('')}>Clear</Button>
          </Col>
        </Row>
        <Table style={{ marginTop: '10px' }} columns={columns} dataSource={tableList} />
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
