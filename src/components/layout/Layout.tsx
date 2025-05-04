import React from 'react';
import { Layout } from 'antd';
import Navbar from '../Navbar/Navbar';
import Headers from '../Header/headers';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;
const ParkingLayout = () => {
    return (
        <div className="relative flex h-full">
            <Layout style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className={`absolute top-0 left-0 w-full h-[250px] bg-gradient-to-b  from-blue-500 z-0`}></div>
                <Content style={{ padding: '24px', minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </div>
    );
};

export default ParkingLayout;