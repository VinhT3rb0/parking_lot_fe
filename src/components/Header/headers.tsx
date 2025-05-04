import React from 'react';
import { Col, Row, Tag, Layout, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const { Header } = Layout;
const Headers = () => {
    return (
        <div>
            <Header className="header" style={{ background: '#fff', padding: 0 }}>
                <Row justify="space-between" style={{ padding: '0 24px' }}>
                    <Col>
                        <Image src="/logopk.png" alt="Logo" preview={false} width={100} />
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
