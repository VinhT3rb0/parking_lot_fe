import React from 'react';
import { Tabs } from 'antd';
import { TeamOutlined, UserAddOutlined, WarningOutlined } from '@ant-design/icons';
import BreadcrumbFunction from '../../components/Breadcrumb/BreadcrumbFunction';
import AllMembersTab from './components/AllMembersTab';
import PendingMembersTab from './components/PendingMembersTab';
import ExpiringMembersTab from './components/ExpiringMembersTab';

const MemberManage: React.FC = () => {

    const items = [
        {
            key: '1',
            label: (
                <span>
                    <TeamOutlined />
                    Danh sách thành viên
                </span>
            ),
            children: <AllMembersTab />,
        },
        {
            key: '2',
            label: (
                <span>
                    <UserAddOutlined />
                    Chờ duyệt
                </span>
            ),
            children: <PendingMembersTab />,
        },
        {
            key: '3',
            label: (
                <span className="text-orange-600">
                    <WarningOutlined />
                    Sắp hết hạn
                </span>
            ),
            children: <ExpiringMembersTab />,
        },
    ];

    return (
        <div>
            <BreadcrumbFunction functionName="Quản lý thành viên" title="Quản lý danh sách thành viên" />
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </div>
    );
};

export default MemberManage;
