import React, { useState } from "react";
import { Layout, Form, Input, Button, List, Card, Avatar, Typography, Tabs, message, DatePicker, Tag } from "antd";
import { UserOutlined, LockOutlined, CarOutlined } from '@ant-design/icons';
import './UserInfo.css';
import { useChangePasswordMutation, useGetCurrentUserQuery, useUpdateUserInfoMutation } from "../../api/app_home/apiAuth";
import { getAccessTokenFromCookie } from "../../utils/token";
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserInfo = () => {
    const [form] = Form.useForm();
    const [isEdit, setIsEdit] = useState(false);

    const parkingData = [
        { licensePlate: "29A-12345", entryTime: "08:00 AM", exitTime: "10:00 AM" },
        { licensePlate: "30B-67890", entryTime: "09:00 AM", exitTime: "11:30 AM" },
        { licensePlate: "31C-54321", entryTime: "07:30 AM", exitTime: "09:00 AM" },
        { licensePlate: "32D-98765", entryTime: "10:15 AM", exitTime: "12:45 PM" },
    ];
    const handleEditToggle = () => {
        setIsEdit(true);
    };

    const { data: user } = useGetCurrentUserQuery(undefined, {
        skip: !getAccessTokenFromCookie()
    });

    console.log("user", user);
    const [updateUserInfo] = useUpdateUserInfoMutation();

    // Lấy ra hàm gọi api đổi mật khẩu
    const [changePassword] = useChangePasswordMutation();

    const handleUpdateUserInfo = async (values: any) => {
        console.log("values", values);
        await updateUserInfo(values);
        message.success("Cập nhật thông tin thành công!");
        setIsEdit(false);
    };

    const handleChangePassword = async (values: any) => {
        console.log("values", values);
        // gọi api đổi mật khẩu
        await changePassword(values);
        message.success("Cập nhật thông tin thành công!");
        setIsEdit(false);
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
    };

    return (
        <Layout className="userinfo-container">
            <Content style={{ padding: '24px' }}>
                <div className="userinfo-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                    <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
                    <div>
                        <Title level={4} style={{ margin: 0 }}>{user?.data?.fullname || 'Chưa cập nhật'}</Title>
                        <Text>Thông tin tài khoản người gửi xe</Text>
                    </div>
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
                                initialValues={{
                                    fullName: user?.data?.fullname,
                                    phoneNumber: user?.data?.phoneNumber,
                                    dateOfBirth: user?.data?.dateOfBirth ? dayjs(user.data.dateOfBirth) : null
                                }}
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
