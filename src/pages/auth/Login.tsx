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

    const onFinish = (values: any) => {
        try {
            login({
                username: values.username,
            });
            message.success('Đăng nhập thành công!');
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error) {
            message.error('Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="auth-container">
            <Card className="auth-card">
                <div className="logo-container">
                    <img src="/logopk.png" className='margin-auto' alt="Parking Lot Logo" />
                    <h1 className="form-title">Chào mừng trở lại!</h1>
                    <p className="form-subtitle">Vui lòng đăng nhập vào tài khoản của bạn</p>
                </div>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
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
                        <Button type="primary" htmlType="submit" block size="large">
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <div className="auth-links">
                        <a onClick={() => navigate('/register')}>Chưa có tài khoản? Đăng ký ngay!</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login; 