import "./User.css";
import {Table, Tag, Button, Space, message} from "antd";
import React, {useState, useEffect} from "react";
import {
    userList as userListAPI, userAdd, userUpdate, userDelete, userRecover,
    roleList as roleListAPI, userExport
} from '@services/api.service';
import UserForm from './components/UserForm';
import ConfirmComponent from '@components/ConfirmComponent';
import ExportButton from '@components/ExportButton';
import {ExportToCsv} from '@components/ExportUtils';

import moment from 'moment';


async function HandleAction(action, id, params) {
    try {
        let result = null;
        if (action === 'add') {
            result = await userAdd(params);
        } else if (action === 'update') {
            result = await userUpdate(id, params);
        } else if (action === 'delete') {
            result = await userDelete(id);
        } else if (action === 'export') {
            result = await userExport(id);
        } else if (action === 'recover') {
            result = await userRecover(id);
        }
        message.success('Handle action success');
        return result;
    } catch (error) {
        const text = `handle action is error: ${error?.data?.message || 'please try again'}`;
        console.log(text);
        message.error(text);
        return null;
    }
}

const UserList = ({user}) => {

    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const showModal = (row) => {
        setCurrentRow(row);
        setIsFormVisible(true);
    };

    const getStatus = (status) => {
        var text = status ? "active" : "inactive";
        var color = status ? "#87d068" : "#f50";
        return <Tag color={color}>{text}</Tag>;
    };

    const columns = [
        {
            title: "Index",
            dataIndex: "key",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Role",
            dataIndex: "title",
            render: (_, row) => row.role.title,
        },
        {
            title: "Name",
            render: (_, row) => (
                <span>
          {row.first_name} {row.last_name}
        </span>
            ),
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            render: (text) => moment(text).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Active",
            dataIndex: "active",
            render: (text) => getStatus(text),
        },
        {
            title: "Action",
            key: "action",
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
                                                 }, 'Are you sure to recover this user?')
                                             }
                    >Recover</Button>)}
                </Space>
            ),
        },
    ];

    const handleSubmit = async (values) => {
        const result = currentRow ?
            await HandleAction('update', currentRow._id, values) :
            await HandleAction('add', null, values);
        if (result) {
            setLoading(true);
        } else {
            console.log('handleSubmit is error');
        }
    }
    useEffect(() => {
        if (!loading || !user) {
            return;
        }

        setCurrentRow(null);
        setIsFormVisible(false);
        setLoading(false);

        async function getUserList() {
            try {
                const result = await userListAPI();
                const list = result.data.map((item, index) => ({
                    ...item,
                    key: index + 1,
                }));
                setUserList(list);
            } catch (error) {
                console.log("getUserList is error: ", error.message);
            }
        }

        getUserList();

        async function getRoleList() {
            try {
                const result = await roleListAPI();
                setRoleList(result.data);
            } catch (error) {
                console.log("getRoleList is error: ", error.message);
            }
        }

        getRoleList();
    }, [loading, user]);

    return (
        <>


            <div className='user-list-wrap'>
                <h3 className='common-title'>User List</h3>
                <Space>
                    <Button type="primary" size='large' onClick={() => showModal(null)}>Add</Button>
                    <ExportButton onExport={async () => {
                        const result = await HandleAction('export', null, null);
                        if (result) {
                            ExportToCsv(result.data, 'user-export.csv');
                        } else {
                            message.error('Export is error, please try again');
                        }
                    }}>
                        Export to CSV
                    </ExportButton>
                </Space>
                <Table columns={columns} dataSource={userList}/>
            </div>
            <UserForm
                handleSubmit={handleSubmit}
                isFormVisible={isFormVisible}
                setIsFormVisible={setIsFormVisible}
                currentRow={currentRow}
                roleList={roleList}
            />
        </>
    );
}
export default UserList;