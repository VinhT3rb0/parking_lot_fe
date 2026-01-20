import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content, Header } = Layout;

const CustomerLayout: React.FC = () => {
    return (
        <Layout className="min-h-screen">
            <Header className="bg-white px-6 shadow-sm flex items-center justify-between">
                <div className="text-xl font-bold text-blue-600">Parking Lot</div>
                {/* Add Customer Navigation here later */}
                <div>
                    <a href="/login" className="text-blue-600 font-medium hover:text-blue-800">Login</a>
                </div>
            </Header>
            <Content className="p-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default CustomerLayout;
