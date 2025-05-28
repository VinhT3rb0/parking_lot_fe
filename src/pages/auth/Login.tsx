import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            await login(values.username, values.password);
            message.success('Đăng nhập thành công!');
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error) {
            message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
        }
    };

    return (
        <div className="auth-container">
            <Card title="Đăng nhập" className="auth-card">
                <div className="logo-container">
                    <img src="/logopk.png" className='margin-auto' alt="Parking Lot Logo" />
                    <h1 className="form-title">Chào mừng trở lại!</h1>
                    <p className="form-subtitle">Vui lòng đăng nhập vào tài khoản của bạn</p>
                </div>
                <Form
                    form={form}
                    name="login"
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
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                            placeholder="Mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button" block size="large">
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <div className="auth-links">
                        <a onClick={() => navigate('/register')}>Chưa có tài khoản? Đăng ký ngay!</a>
                    </div>
                    <div className="auth-links">
                        <a onClick={() => navigate('/forgot-password')}>Quên mật khẩu?</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login; 