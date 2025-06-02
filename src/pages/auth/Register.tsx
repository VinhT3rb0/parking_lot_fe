import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../api/app_home/apiAuth';
import './Auth.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [register] = useRegisterMutation();

    const onFinish = async (values: any) => {
        try {
            await register({
                username: values.username,
                email: values.email,
                password: values.password,
                role: 'OWNER',
                active: true,
            }).unwrap();
            message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
            navigate('/verify', { state: { email: values.email } });
        } catch (error) {
            message.error('Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="auth-container">
            <Card title="Đăng ký" className="auth-card">
                <div className="logo-container">
                    <img src="/logopk.png" className='margin-auto' alt="Parking Lot Logo" />
                    <h1 className="form-title">Tạo tài khoản mới</h1>
                    <p className="form-subtitle">Vui lòng điền thông tin để đăng ký tài khoản</p>
                </div>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Tên đăng nhập"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Email"
                            size="large"
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
                            size="large"
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
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Xác nhận mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-button" block size="large">
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <div className="auth-links">
                        <a onClick={() => navigate('/login')}>Đã có tài khoản? Đăng nhập ngay!</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register; 