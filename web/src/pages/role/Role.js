import './Role.css';
import { Table, Button, Space, message } from 'antd';
import React, { useState, useEffect } from 'react';
import {
    roleList as roleListAPI, roleAdd, roleUpdate, roleDelete
} from '@services/api.service';
import CategoryForm from './components/RoleForm';
import moment from 'moment';
import ConfirmComponent from '@components/ConfirmComponent';

async function HandleAction(action, id, params) {
    try {
        if (action === 'add') {
            await roleAdd(params);
        } else if (action === 'update') {
            await roleUpdate(id, params);
        } else if (action === 'delete') {
            await roleDelete(id);
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

const Role = ({ user }) => {

    const [loading, setLoading] = useState(true);
    const [roleList, setRoleList] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const showModal = (row) => {
        setCurrentRow(row);
        setIsFormVisible(true);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Role Type',
            dataIndex: 'role_name',
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
                    <Button onClick={() => showModal(row)}>Edit</Button>
                    <Button type="danger" onClick={() =>
                         ConfirmComponent(async () => {
                            await HandleAction('delete', row._id, null);
                             setLoading(true);
                        })
                        //message.error('Role cannot delete')
                    }>
                         {row.deleted ? 'Delete Permanently' : 'Delete'}
                    </Button>
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

        async function getRoleList() {
            try {
                const result = await roleListAPI();
                const list = result.data.map((item, index) => ({ ...item, key: index + 1 }));
                setRoleList(list);
            } catch (error) {
                console.log('getUserList is error: ', error.message);
            }
        }

        getRoleList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div className='role-wrap'>
                <h3 className='common-title'>Role List</h3>
                <Button type="primary" size='large' onClick={() => showModal(null)}>Add</Button>
                <CategoryForm
                    handleSubmit={handleSubmit}
                    isFormVisible={isFormVisible}
                    setIsFormVisible={setIsFormVisible}
                    currentRow={currentRow}
                />
                <Table columns={columns} dataSource={roleList} />
            </div>
        </>
    );
}
export default Role;