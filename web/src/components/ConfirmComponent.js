import React from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function ConfirmComponent(callback, title, content) {
    confirm({
        title: title || 'Are you sure delete this item?',
        icon: <ExclamationCircleOutlined />,
        content: content || 'Operation confirmation',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',

        onOk() {
            callback();
        },

        onCancel() {
            console.log('Cancel');
        },
    });
}
