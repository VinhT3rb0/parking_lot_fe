import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';
import { Image, Menu, MenuProps } from 'antd';
import { CarOutlined, UserOutlined, DashboardOutlined, SettingOutlined, BuildOutlined, TeamOutlined, AuditOutlined } from '@ant-design/icons';
interface StaffNavBarProps {
    title: string;
    data: any;
}
export default function Navbar() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems: MenuProps['items'] = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: <Link to="/">Dashboard</Link>,
        },
        {
            key: '/park-vehicle',
            icon: <CarOutlined />,
            label: <Link to="/park-vehicle">Gửi xe</Link>,
        },
        {
            key: '/parking-management',
            icon: <BuildOutlined />,
            label: <Link to="/parking-management">Quản lý bãi đỗ</Link>,
        },
        {
            key: '/timekeeping',
            icon: <AuditOutlined />,
            label: <Link to="/timekeeping">Chấm công nhân viên</Link>,
        },
        {
            key: '/employee-management',
            icon: <TeamOutlined />,
            label: <Link to="/employee-management">Quản lý nhân viên</Link>,
        },
        {
            key: '/user',
            icon: <AuditOutlined />,
            label: <Link to="/user">Cá nhân</Link>,
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: <Link to="/settings">Cài đặt</Link>,
        },
        {
            key: '/test',
            icon: <SettingOutlined />,
            label: <Link to="/test">Test</Link>,
        },
    ];

    return (
        <Sider
            className='shadow-lg bg-white  z-10'
            width={200}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="light"
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '64px',
                    marginBottom: '16px',
                }}
            >
                <Image
                    src="/logopk.png"
                    alt="Logo"
                    preview={false}
                    width={collapsed ? 40 : 100}
                />
            </div>
            <Menu
                mode="inline"
                defaultSelectedKeys={['/']}
                selectedKeys={[location.pathname]}
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
            />
        </Sider>
    );
}