import React from 'react';
import { Layout, theme } from 'antd';
import Navbar from '../Navbar/Navbar';
import Headers from '../Header/headers';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const { Content } = Layout;

const ParkingLayout = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const location = useLocation();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Layout>
                <Headers />
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div
                                style={{
                                    padding: 24,
                                    minHeight: 360,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <Outlet />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </Content>
                <Layout.Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
                    Parkivia ©{new Date().getFullYear()} Created by Vietnam
                </Layout.Footer>
            </Layout>
        </Layout>
    );
};

export default ParkingLayout;