import React from 'react';
import BreadcrumbFunction from '../../components/Breadcrumb/BreadcrumbFunction';
import ParkingManageView from './components/ParkingManageView';

const ParkingManage = () => {
    return (
        <>
            <BreadcrumbFunction functionName="Quản lý bãi đỗ" title="Quản lý bãi đỗ" />
            <ParkingManageView />
        </>
    );
}

export default ParkingManage;
