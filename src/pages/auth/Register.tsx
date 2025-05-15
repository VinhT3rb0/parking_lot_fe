import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Modal } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation, useVerifyEmailMutation } from '../../api/app_home/apiAuth';
import './Auth.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [register] = useRegisterMutation();
    const [verifyEmail] = useVerifyEmailMutation();
    const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const onFinish = async (values: any) => {
        try {
            const registerData = {
                username: values.username,
                password: values.password,
                email: values.email,
                fullName: values.fullName,
                dateOfBirth: values.dateOfBirth,
                phoneNumber: values.phoneNumber,
                role: 'CUSTOMER', // Default role
                active: true
            };

            await register(registerData).unwrap();
            setVerificationEmail(values.email);
            setIsVerificationModalVisible(true);
            message.success('Đăng ký thành công! Vui lòng xác thực email.');
        } catch (error) {
            message.error('Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    const handleVerification = async () => {
        try {
            await verifyEmail({
                email: verificationEmail,
                verificationCode: verificationCode
            }).unwrap();
            message.success('Email xác thực thành công!');
            setIsVerificationModalVisible(false);
            navigate('/login');
        } catch (error) {
            message.error('Xác thực thất bại. Vui lòng kiểm tra mã xác thực và thử lại.');
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card">
                <div className="logo-container">
                    <img src="/logopk.png" alt="Parking Lot Logo" />
                    <h1 className="form-title">Đăng ký</h1>
                </div>
                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Tên tài khoản"
                        />
                    </Form.Item>

                    <Form.Item
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Họ và tên"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="dateOfBirth"
                        rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                    >
                        <Input
                            prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                            type="date"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input
                            prefix={<PhoneOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Số điện thoại"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Xác nhận mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <div className="auth-links">
                        <a onClick={() => navigate('/login')}>Đã có tài khoản? Đăng nhập</a>
                    </div>
                </Form>
            </Card>

            <Modal
                title="Xác thực email"
                open={isVerificationModalVisible}
                onOk={handleVerification}
                onCancel={() => setIsVerificationModalVisible(false)}
                okText="Xác thực"
                cancelText="Hủy"
            >
                <p>Please enter the 6-digit verification code sent to your email.</p>
                <Input
                    placeholder="Nhập mã xác thực"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    style={{ marginTop: 16 }}
                />
            </Modal>
        </div>
    );
};

export default Register; 