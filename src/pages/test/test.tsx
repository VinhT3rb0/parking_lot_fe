import React from 'react';
import { Layout, Menu, Row, Col, Tag } from 'antd';
import type { MenuProps } from 'antd';
import {
    DashboardOutlined,
    CarOutlined,
    UserOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Outlet, Link, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
    const location = useLocation();

    const menuItems: MenuProps['items'] = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
            key: '/parking-management',
            icon: <CarOutlined />,
            label: <Link to="/parking-management">Quản lý bãi đỗ</Link>,
        },
        {
            key: '/user-management',
            icon: <UserOutlined />,
            label: <Link to="/user-management">Quản lý người dùng</Link>,
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: <Link to="/settings">Cài đặt</Link>,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header" style={{ background: '#fff', padding: 0 }}>
                <Row justify="space-between" style={{ padding: '0 24px' }}>
                    <Col>
                        <h2 style={{ margin: 0 }}>Hệ thống quản lý bãi đỗ xe</h2>
                    </Col>
                    <Col>
                        <Tag color="blue">Admin</Tag>
                        <Tag icon={<UserOutlined />}>Nguyễn Văn A</Tag>
                    </Col>
                </Row>
            </Header>

            <Layout>
                <Sider width={200} theme="light">
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                    />
                </Sider>

                <Content style={{ padding: '24px', minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;