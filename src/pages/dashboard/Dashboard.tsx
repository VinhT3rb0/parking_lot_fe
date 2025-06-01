import React, { useState } from 'react';
import { Tabs } from 'antd';
import OverviewTab from './components/OverviewTab';
// import ParkingManagementTab from './components/ParkingManagementTab';
import RevenueTab from './components/RevenueTab';
import BreadcrumbDetail from '../../components/Breadcrumb/BreadcrumbDetail';
import { useGetAllParkingLotsQuery } from '../../api/app_parkinglot/apiParkinglot';

interface ParkingLot {
    id: string;
    name: string;
    type: 'car' | 'motorbike';
    capacity: number;
    available: number;
    status: 'active' | 'inactive';
    revenue: number;
}

interface RevenueData {
    date: string;
    amount: number;
    type: 'car' | 'motorbike';
}

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('1');
    const { data: parkingLots = [], isLoading: isLoadingParkingLots } = useGetAllParkingLotsQuery({});

    const getTabTitle = (tabKey: string) => {
        switch (tabKey) {
            case '1':
                return 'Tổng quan';
            case '2':
                return 'Doanh thu';
            default:
                return 'Dashboard';
        }
    };

    const items = [
        {
            key: '1',
            label: 'Tổng quan',
            children: <OverviewTab parkingLots={parkingLots} isLoading={isLoadingParkingLots} />
        },
        {
            key: '2',
            label: 'Doanh thu',
            children: <RevenueTab parkingLots={parkingLots} isLoading={isLoadingParkingLots} />
        },
    ];

    return (
        <>
            <BreadcrumbDetail
                pageName="Dashboard"
                title={getTabTitle(activeTab)}
                pageLink="/"
            />
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                size="large"
            />
        </>
    );
};

export default Dashboard; 