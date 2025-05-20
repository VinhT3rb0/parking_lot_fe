import React, { useState } from 'react';
import { Tabs } from 'antd';
import OverviewTab from './components/OverviewTab';
// import ParkingManagementTab from './components/ParkingManagementTab';
import RevenueTab from './components/RevenueTab';
import BreadcrumbDetail from '../../components/Breadcrumb/BreadcrumbDetail';

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

    // Sample data for statistics
    const statistics = {
        totalRevenue: 15000000,
        monthlyRevenue: 5000000,
        totalParkingSpots: 200,
        availableSpots: 75,
        totalUsers: 150,
        activeUsers: 120
    };

    // Sample data for parking lots
    const parkingLots: ParkingLot[] = [
        {
            id: '1',
            name: 'Bãi A - Tòa nhà Sunrise',
            type: 'car',
            capacity: 100,
            available: 30,
            status: 'active',
            revenue: 5000000
        },
        {
            id: '2',
            name: 'Bãi Xe Máy - Trung tâm thương mại',
            type: 'motorbike',
            capacity: 500,
            available: 150,
            status: 'active',
            revenue: 3000000
        }
    ];

    // Sample revenue data
    const revenueData: RevenueData[] = [
        { date: '2024-03-01', amount: 1500000, type: 'car' },
        { date: '2024-03-02', amount: 1200000, type: 'motorbike' },
        { date: '2024-03-03', amount: 1800000, type: 'car' },
        { date: '2024-03-04', amount: 900000, type: 'motorbike' },
    ];

    const getTabTitle = (tabKey: string) => {
        switch (tabKey) {
            case '1':
                return 'Tổng quan';
            case '2':
                return 'Quản lý bãi đỗ';
            case '3':
                return 'Doanh thu';
            default:
                return 'Dashboard';
        }
    };

    const items = [
        {
            key: '1',
            label: 'Tổng quan',
            children: <OverviewTab statistics={statistics} />
        },
        // {
        //     key: '2',
        //     label: 'Quản lý bãi đỗ',
        //     children: <ParkingManagementTab parkingLots={parkingLots} />
        // },
        {
            key: '2',
            label: 'Doanh thu',
            children: <RevenueTab revenueData={revenueData} />
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