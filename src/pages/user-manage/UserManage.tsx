import React from 'react';
import BreadcrumbFunction from '../../components/Breadcrumb/BreadcrumbFunction';
import UserManageView from './components/UserManageView';

const UserManage = () => {
    return (
        <>
            <BreadcrumbFunction functionName="Quản lý người dùng" title="Quản lý người dùng" />
            <UserManageView />
        </>
    );
}

export default UserManage;
