import React from 'react';
import { Layout, Menu, Row, Col, Tag, Statistic, Card, Breadcrumb } from 'antd';
import type { MenuProps } from 'antd';
import {
    DashboardOutlined,
    CarOutlined,
    UserOutlined,
    SettingOutlined
} from '@ant-design/icons';
import Navbar from '../Navbar/Navbar';
import Headers from '../Header/headers';
import BreadcrumbFunction from '../Breadcrumb/BreadcrumbFunction';
import { Outlet } from 'react-router-dom';

const { Content, Sider } = Layout;

type ParkingSpot = {
    id: number;
    name: string;
    status: 'available' | 'occupied' | 'reserved';
};

const ParkingLayout = () => {
    // Mock data với kiểu dữ liệu
    const parkingSpots: ParkingSpot[] = [
        { id: 1, name: 'A1', status: 'available' },
        { id: 2, name: 'A2', status: 'occupied' },
        { id: 3, name: 'A3', status: 'reserved' },
    ];


    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Header */}
            <Headers />

            <Layout>
                <Navbar />
                <Content style={{ padding: '24px', minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default ParkingLayout;