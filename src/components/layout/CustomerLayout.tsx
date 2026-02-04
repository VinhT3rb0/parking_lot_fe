import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';

import Header from '../Header';
import Footer from '../Footer';

const { Content } = Layout;

const CustomerLayout: React.FC = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <Layout className="min-h-screen bg-white">
            <Header />
            <Content className="bg-gray-50">
                <div className="w-full">
                    <Outlet />
                </div>
            </Content>
            <Footer />
        </Layout>
    );
};

export default CustomerLayout;
