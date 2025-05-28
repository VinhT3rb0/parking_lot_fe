import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Button, List, Card, Avatar, Typography, Tabs, message, DatePicker, Tag, Spin } from "antd";
import { UserOutlined, LockOutlined, CarOutlined, LogoutOutlined } from '@ant-design/icons';
import './UserInfo.css';
import { useChangePasswordMutation, useGetCurrentUserQuery, useUpdateUserInfoMutation } from "../../api/app_home/apiAuth";
import { getAccessTokenFromCookie } from "../../utils/token";
import dayjs from 'dayjs';
import { useAuth } from "../../contexts/AuthContext";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserInfo = () => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);
    const { logout } = useAuth();

    const handleEditToggle = () => {
        setIsEdit(true);
    };

    const handleLogout = () => {
        logout();
        message.success("Đăng xuất thành công!");
    };

    const { data: user, isLoading, error } = useGetCurrentUserQuery(undefined, {
        skip: !getAccessTokenFromCookie()
    });
    const [updateUserInfo] = useUpdateUserInfoMutation();
    const [changePassword] = useChangePasswordMutation();
    useEffect(() => {
        if (user?.data) {
            form.setFieldsValue({
                fullName: user.data.fullname,
                phoneNumber: user.data.phoneNumber,
                dateOfBirth: user.data.dateOfBirth ? dayjs(user.data.dateOfBirth) : null
            });
        }
    }, [user, form]);

    const handleUpdateUserInfo = async (values: any) => {
        await updateUserInfo(values);
        message.success("Cập nhật thông tin thành công!");
        setIsEdit(false);
    };

    const handleChangePassword = async (values: any) => {
        await changePassword(values);
        message.success("Cập nhật thông tin thành công!");
        setIsEdit(false);
    };

    if (isLoading) {
        return (
            <Layout className="userinfo-container">
                <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin size="large" />
                </Content>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout className="userinfo-container">
                <Content style={{ padding: '24px' }}>
                    <Card>
                        <Typography.Text type="danger">Không thể tải thông tin người dùng. Vui lòng thử lại sau.</Typography.Text>
                    </Card>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout className="userinfo-container">
            <Content style={{ padding: '24px' }}>
                <div className="userinfo-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>{user?.data?.fullname || 'Chưa cập nhật'}</Title>
                            <Text>Thông tin tài khoản</Text>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Đăng Xuất
                    </Button>
                </div>

                <Card>
                    <Tabs defaultActiveKey="personalInfo" type="line" tabBarGutter={32}>
                        <TabPane tab="Thông Tin Cá Nhân" key="personalInfo">
                            <Form
                                layout="vertical"
                                form={form}
                                className="userinfo-form"
                                style={{ maxWidth: 500 }}
                                onFinish={handleUpdateUserInfo}
                            >
                                <Form.Item label="Tên Người Gửi" name="fullName" rules={[{ required: true }]}>
                                    <Input placeholder="Nhập tên người gửi" disabled={!isEdit} />
                                </Form.Item>

                                <Form.Item label="Số Điện Thoại" name="phoneNumber" rules={[{ required: true }]}>
                                    <Input placeholder="Nhập số điện thoại" disabled={!isEdit} />
                                </Form.Item>
                                <Form.Item label="Ngày Sinh" name="dateOfBirth" rules={[{ required: true }]}>
                                    <DatePicker placeholder="Nhập ngày sinh" disabled={!isEdit} />
                                </Form.Item>
                                <Form.Item>
                                    {isEdit ? (
                                        <Button htmlType="submit">Lưu</Button>
                                    ) : (
                                        ""
                                    )}
                                </Form.Item>
                                {!isEdit ? (
                                    <Button htmlType="button" onClick={handleEditToggle}>Sửa Đổi</Button>
                                ) : null}
                            </Form>
                        </TabPane>

                        <TabPane tab="Đổi Mật Khẩu" key="changePassword">
                            <Form layout="vertical" className="userinfo-form" style={{ maxWidth: 500 }} onFinish={handleChangePassword}>
                                <Form.Item label="Mật Khẩu Cũ" name="password">
                                    <Input.Password placeholder="Nhập mật khẩu cũ" />
                                </Form.Item>

                                <Form.Item label="Mật Khẩu Mới" name="newPassword">
                                    <Input.Password placeholder="Nhập mật khẩu mới" />
                                </Form.Item>
                                <Form.Item label="Nhập Lại Mật Khẩu Mới" name="retypePassword">
                                    <Input.Password placeholder="Nhập lại mật khẩu mới" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Đổi Mật Khẩu</Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        </Layout>
    );
};

export default UserInfo;
