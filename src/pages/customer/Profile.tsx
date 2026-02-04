import React, { useState } from 'react';
import { Card, Descriptions, Avatar, Tag, Spin, Button, message, Tabs, Form, Input, DatePicker, Row, Col } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, SaveOutlined, CloseOutlined, LockOutlined, IdcardOutlined, AuditOutlined } from '@ant-design/icons';
import { useGetCurrentUserQuery, useUpdateUserInfoMutation, useChangePasswordMutation } from '../../api/app_home/apiAuth';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import UserInvoices from './components/UserInvoices';
import ParkingCardInfo from './components/ParkingCardInfo';

const Profile: React.FC = () => {
    // ... existing hook calls ...
    const { data: userData, isLoading, isError, refetch } = useGetCurrentUserQuery();
    const [updateUserInfo, { isLoading: isUpdating }] = useUpdateUserInfoMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    // State
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const handleLogout = () => {
        logout();
        message.success('Đã đăng xuất thành công');
        navigate('/');
    };

    const onFinishUpdateInfo = async (values: any) => {
        try {
            await updateUserInfo({
                fullname: values.fullname,
                phoneNumber: values.phoneNumber,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : '',
            }).unwrap();
            message.success('Cập nhật thông tin thành công!');
            setIsEditing(false);
            refetch();
        } catch (error) {
            message.error('Cập nhật thất bại. Vui lòng thử lại.');
        }
    };

    const onFinishChangePassword = async (values: any) => {
        try {
            await changePassword({
                password: values.password,
                newPassword: values.newPassword,
                retypePassword: values.retypePassword,
            }).unwrap();
            message.success('Đổi mật khẩu thành công!');
            passwordForm.resetFields();
        } catch (error) {
            message.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[500px]">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !userData?.data) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[500px] gap-4">
                <p className="text-red-500 text-lg">Không thể tải thông tin người dùng.</p>
                <Button type="primary" onClick={() => navigate('/login')}>Đăng nhập lại</Button>
            </div>
        );
    }

    const user = userData.data;

    const renderRoleTag = (role: string) => {
        let color = 'blue';
        if (role === 'OWNER' || role === 'ADMIN') color = 'gold';
        if (role === 'EMPLOYEE') color = 'green';
        return <Tag color={color}>{role}</Tag>;
    };

    // Tab Items
    const items = [
        {
            key: '1',
            label: (
                <span className="font-semibold text-base py-2 flex items-center gap-2">
                    <UserOutlined /> Thông Tin Cá Nhân
                </span>
            ),
            children: (
                <div className="py-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Thông Tin Chi Tiết</h3>
                        {!isEditing ? (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    form.setFieldsValue({
                                        fullname: user.fullname,
                                        phoneNumber: user.phoneNumber,
                                        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
                                        email: user.email, // Read only usually
                                        username: user.username // Read only
                                    });
                                    setIsEditing(true);
                                }}
                            >
                                Chỉnh sửa
                            </Button>
                        ) : (
                            <Button icon={<CloseOutlined />} onClick={() => setIsEditing(false)}>Hủy bỏ</Button>
                        )}
                    </div>

                    {!isEditing ? (
                        <Descriptions column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }} bordered size="middle" labelStyle={{ width: '180px', fontWeight: '600' }}>
                            <Descriptions.Item label="Họ và tên">
                                {user.fullname || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tên đăng nhập">
                                {user.username}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {user.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                {user.phoneNumber || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">
                                {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : <span className="text-gray-400 italic">Chưa cập nhật</span>}
                            </Descriptions.Item>
                            <Descriptions.Item label="Vai trò">
                                {renderRoleTag(user.role)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã nhân viên">
                                {(user as any).employeeId ? (user as any).employeeId : <span className="text-gray-400 italic">Không có</span>}
                            </Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinishUpdateInfo}
                            initialValues={{
                                fullname: user.fullname,
                                phoneNumber: user.phoneNumber,
                                dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
                            }}
                        >
                            <Row gutter={16}>
                                <Col span={24} md={12}>
                                    <Form.Item label="Tên đăng nhập" name="username">
                                        <Input disabled defaultValue={user.username} />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item label="Email" name="email">
                                        <Input disabled defaultValue={user.email} />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item label="Họ và tên" name="fullname" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                                        <Input placeholder="Nhập họ và tên của bạn" />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                                        <Input placeholder="Nhập số điện thoại" />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item label="Ngày sinh" name="dateOfBirth">
                                        <DatePicker format="DD/MM/YYYY" className="w-full" placeholder="Chọn ngày sinh" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className="flex justify-end gap-3 mt-4">
                                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                                <Button type="primary" htmlType="submit" loading={isUpdating} icon={<SaveOutlined />}>Lưu thay đổi</Button>
                            </div>
                        </Form>
                    )}
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <span className="font-semibold text-base py-2 flex items-center gap-2">
                    <LockOutlined /> Đổi Mật Khẩu
                </span>
            ),
            children: (
                <div className="py-4 max-w-lg mx-auto">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-slate-800">Thay Đổi Mật Khẩu</h3>
                        <p className="text-gray-500">Để bảo mật tài khoản, vui lòng đặt mật khẩu mạnh.</p>
                    </div>

                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={onFinishChangePassword}
                    >
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu cũ" prefix={<LockOutlined />} />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" prefix={<LockOutlined />} />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu mới"
                            name="retypePassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu mới" prefix={<LockOutlined />} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={isChangingPassword} className="mt-4">
                                Đổi Mật Khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <span className="font-semibold text-base py-2 flex items-center gap-2">
                    <IdcardOutlined /> Thẻ Gửi Xe
                </span>
            ),
            children: <ParkingCardInfo userId={user.id} role={user.role} />,
        },
    ];

    return (
        <div className="font-sans bg-gray-50 min-h-screen pb-20">
            <PageHeader
                title="Hồ Sơ Cá Nhân"
                breadcrumbs={[{ name: "Hồ Sơ", path: "/profile" }]}
            />

            <div className="container mx-auto px-4 md:px-8 mt-[-50px] relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - User User Card */}
                    <div className="w-full lg:w-1/3">
                        <Card className="shadow-lg rounded-xl overflow-hidden border-0 top-0 sticky">
                            <div className="flex flex-col items-center p-6 bg-white">
                                <Avatar
                                    size={120}
                                    icon={<UserOutlined />}
                                    src={(user as any).avatar}
                                    className="bg-orange-500 mb-4 shadow-md"
                                />
                                <h2 className="text-2xl font-bold text-slate-800 text-center">{user.fullname || user.username}</h2>
                                <p className="text-gray-500 mb-2 mt-1">{renderRoleTag(user.role)}</p>
                                <p className="text-gray-400 text-sm mb-6">{user.email}</p>

                                <div className="w-full flex flex-col gap-3">
                                    <Button danger icon={<LogoutOutlined />} onClick={handleLogout} className="h-10 rounded-lg w-full">
                                        Đăng xuất
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Tabs */}
                    <div className="w-full lg:w-2/3">
                        <Card className="shadow-lg rounded-xl border-0 min-h-[500px]">
                            <Tabs defaultActiveKey="1" items={[...items, {
                                key: '4',
                                label: (
                                    <span className="font-semibold text-base py-2 flex items-center gap-2">
                                        <AuditOutlined /> Hóa Đơn Của Tôi
                                    </span>
                                ),
                                children: <UserInvoices userId={user.id} />,
                            }]} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
