import React, { useState } from "react";
import { Layout, Menu, Form, Input, Button, List, Card, Avatar, Typography } from "antd";
import { UserOutlined, LockOutlined, HistoryOutlined, CarOutlined } from '@ant-design/icons';
import './UserInfo.css';

const { Sider } = Layout;
const { Title, Text } = Typography;

const UserInfo = () => {
    const [activeTab, setActiveTab] = useState("personalInfo");
    const parkingData = [
        { licensePlate: "29A-12345", entryTime: "08:00 AM", exitTime: "10:00 AM" },
        { licensePlate: "30B-67890", entryTime: "09:00 AM", exitTime: "11:30 AM" },
        { licensePlate: "31C-54321", entryTime: "07:30 AM", exitTime: "09:00 AM" },
        { licensePlate: "32D-98765", entryTime: "10:15 AM", exitTime: "12:45 PM" },
    ];
    const renderContent = () => {
        switch (activeTab) {
            case "personalInfo":
                return (
                    <div className="userinfo-section">
                        <Title level={4}>Đổi Thông Tin Cá Nhân</Title>
                        <Form layout="vertical" className="userinfo-form">
                            <Form.Item label="Tên Người Gửi" name="senderName" rules={[{ required: true, message: "Vui lòng nhập tên người gửi!" }]}>
                                <Input placeholder="Nhập tên người gửi" />
                            </Form.Item>
                            <Form.Item label="Mã Thẻ Xe" name="cardId" rules={[{ required: true, message: "Vui lòng nhập mã thẻ xe!" }]}>
                                <Input placeholder="Nhập mã thẻ xe" />
                            </Form.Item>
                            <Form.Item label="Tên Xe" name="vehicleType" rules={[{ required: true, message: "Vui lòng chọn loại xe!" }]}>
                                <Input placeholder="Tên xe" />
                            </Form.Item>
                            <Form.Item label="Biển Số" name="licensePlate" rules={[{ required: true, message: "Vui lòng nhập biển số xe!" }]}>
                                <Input placeholder="Nhập biển số xe" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="userinfo-btn">
                                    Lưu Thay Đổi
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                );
            case "changePassword":
                return (
                    <div className="userinfo-section">
                        <Title level={4}>Đổi Mật Khẩu</Title>
                        <Form layout="vertical" className="userinfo-form">
                            <Form.Item label="Mật Khẩu Cũ" name="oldPassword">
                                <Input.Password placeholder="Nhập mật khẩu cũ" />
                            </Form.Item>
                            <Form.Item label="Mật Khẩu Mới" name="newPassword">
                                <Input.Password placeholder="Nhập mật khẩu mới" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="userinfo-btn">
                                    Đổi Mật Khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                );
            case "parkingHistory":
                return (
                    <div className="userinfo-section">
                        <Title level={4}>Lịch Sử Gửi Xe</Title>
                        <List
                            className="userinfo-history-list"
                            itemLayout="horizontal"
                            dataSource={parkingData}
                            renderItem={(item) => (
                                <List.Item className="userinfo-history-item">
                                    <List.Item.Meta
                                        avatar={<CarOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                                        title={<Text strong>Biển số xe: {item.licensePlate}</Text>}
                                        description={<span>Vào: <b>{item.entryTime}</b> &nbsp;|&nbsp; Ra: <b>{item.exitTime}</b></span>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="userinfo-wrapper">
            <Layout className="userinfo-layout">
                <Sider
                    width={280}
                    className="userinfo-sider"
                    breakpoint="lg"
                    collapsedWidth="0"
                >
                    <div className="userinfo-avatar-block">
                        <Avatar size={64} icon={<UserOutlined />} />
                        <div className="userinfo-username">Nguyễn Văn A</div>
                    </div>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["personalInfo"]}
                        selectedKeys={[activeTab]}
                        onClick={(e) => setActiveTab(e.key)}
                        className="userinfo-menu"
                    >
                        <Menu.Item key="personalInfo" icon={<UserOutlined />}>Đổi Thông Tin Cá Nhân</Menu.Item>
                        <Menu.Item key="changePassword" icon={<LockOutlined />}>Đổi Mật Khẩu</Menu.Item>
                        <Menu.Item key="parkingHistory" icon={<HistoryOutlined />}>Lịch Sử Gửi Xe</Menu.Item>
                    </Menu>
                </Sider>
                <div className="userinfo-content">
                    {renderContent()}
                </div>
            </Layout>
        </div>
    );
};

export default UserInfo;