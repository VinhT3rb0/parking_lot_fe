import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, MapPin, Settings } from 'lucide-react';
import Sider from 'antd/es/layout/Sider';
import { Menu, MenuProps } from 'antd';
import { CarOutlined, UserOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons';

export default function Navbar() {
    const location = useLocation();
    const menuItems: MenuProps['items'] = [
        {
            key: '/',
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
        <Sider width={200} theme="light">
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                selectedKeys={[location.pathname]}
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
            />
        </Sider>
    );
}