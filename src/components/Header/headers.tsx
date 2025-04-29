import { Col, Row, Tag, Layout } from 'antd';
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
const { Header } = Layout;
const Headers = () => {
    return (
        <div>
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
        </div>
    );
}

export default Headers;
