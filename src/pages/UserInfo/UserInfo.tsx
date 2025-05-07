import React, { useState } from "react";
import { Layout, Menu, Form, Input, Button, List, Card, Select } from "antd";
import { Option } from "antd/es/mentions";
import { CarOutlined, UserOutlined, DashboardOutlined, SettingOutlined, LockOutlined, HistoryOutlined } from '@ant-design/icons';
// import styles from "./UserInfo.module.css";

const { Sider, Content } = Layout;

const UserInfo = () => {
    const [activeTab, setActiveTab] = useState("personalInfo");
    const parkingData = [
        {
            licensePlate: "29A-12345",
            entryTime: "08:00 AM",
            exitTime: "10:00 AM",
        },
        {
            licensePlate: "30B-67890",
            entryTime: "09:00 AM",
            exitTime: "11:30 AM",
        },
        {
            licensePlate: "31C-54321",
            entryTime: "07:30 AM",
            exitTime: "09:00 AM",
        },
        {
            licensePlate: "32D-98765",
            entryTime: "10:15 AM",
            exitTime: "12:45 PM",
        },
    ];
    const renderContent = () => {
        switch (activeTab) {
            case "personalInfo":
                return (
                    <Card title="Đổi Thông Tin Cá Nhân" bordered={false}>
                        <Form layout="vertical">
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
                                <Button type="primary" htmlType="submit">
                                    Lưu Thay Đổi
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                );
            case "changePassword":
                return (
                    <Card title="Đổi Mật Khẩu" bordered={false}>
                        <Form layout="vertical">
                            <Form.Item label="Mật Khẩu Cũ" name="oldPassword">
                                <Input.Password placeholder="Nhập mật khẩu cũ" />
                            </Form.Item>
                            <Form.Item label="Mật Khẩu Mới" name="newPassword">
                                <Input.Password placeholder="Nhập mật khẩu mới" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Đổi Mật Khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                );
            case "parkingHistory":
                return (
                    <Card title="Lịch Sử Gửi Xe" bordered={false}>
                        <List
                            itemLayout="horizontal"
                            dataSource={parkingData}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={`Biển số xe: ${item.licensePlate}`}
                                        description={`Thời gian vào: ${item.entryTime} - Thời gian ra: ${item.exitTime}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex" }}>
            {/* Sidebar */}
            <Sider
                width="40%"
                style={{
                    background: "#fff",
                    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1, // Đảm bảo chiều cao bằng nhau
                }}
            >
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["personalInfo"]}
                    onClick={(e) => setActiveTab(e.key)}
                    style={{ height: "100%", borderRight: 0 }}
                >
                    <Menu.Item key="personalInfo" icon={<UserOutlined />}>
                        Đổi Thông Tin Cá Nhân
                    </Menu.Item>
                    <Menu.Item key="changePassword" icon={<LockOutlined />}>
                        Đổi Mật Khẩu
                    </Menu.Item>
                    <Menu.Item key="parkingHistory" icon={<HistoryOutlined />}>
                        Lịch Sử Gửi Xe
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Content */}
            <Layout
                style={{
                    padding: "24px",
                    width: "60%",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                }}
            >
                <Content
                    style={{
                        background: "#fff",
                        padding: "24px",
                        margin: 0,
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        flex: 1,
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
        
    );
};

export default UserInfo;