import React from 'react';
import { Layout, Row, Col, Avatar, Dropdown, MenuProps, Space, Tag, theme } from 'antd';
import { UserOutlined, BellOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Headers = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const items: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Thông tin cá nhân',
            icon: <UserOutlined />,
            onClick: () => navigate('/user'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <Header style={{ padding: '0 24px', background: colorBgContainer, position: 'sticky', top: 0, zIndex: 1, boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
            <Row justify="space-between" align="middle" className="h-full">
                <Col>
                    <h2 className="text-lg font-bold m-0 text-slate-800">
                        {isAdmin ? 'Quản Lý Bãi Đỗ Xe' : 'Cổng Thông Tin Nhân Viên'}
                    </h2>
                </Col>
                <Col>
                    <Space size="large">
                        <div className="cursor-pointer hover:text-blue-500 transition-colors">
                            <BellOutlined style={{ fontSize: '18px' }} />
                        </div>
                        <Dropdown menu={{ items }} trigger={['click']}>
                            <Space className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <Avatar
                                    style={{ backgroundColor: isAdmin ? '#f56a00' : '#87d068' }}
                                    icon={<UserOutlined />}
                                    src={(user as any)?.avatar}
                                />
                                <div className="hidden md:block leading-tight">
                                    <div className="font-semibold text-sm">{(user as any)?.fullname || (user as any)?.username || 'User'}</div>
                                    <Tag color={isAdmin ? 'volcano' : 'green'} className="m-0 text-[10px] border-none">
                                        {(user as any)?.role || 'USER'}
                                    </Tag>
                                </div>
                                <DownOutlined style={{ fontSize: '10px', color: '#999' }} />
                            </Space>
                        </Dropdown>
                    </Space>
                </Col>
            </Row>
        </Header>
    );
}

export default Headers;
