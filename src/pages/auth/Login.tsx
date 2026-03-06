import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Form, Input, Button, message, Image } from 'antd';
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
            const user = await login(values.username, values.password);
            message.success('Đăng nhập thành công!');
            const from = (location.state as any)?.from?.pathname;
            if (from) {
                navigate(from, { replace: true });
            } else {
                console.log("Logged in user:", user);
                // Check role rigorously
                const role = user?.role;
                if (role === 'OWNER' || role === 'EMPLOYEE') {
                    navigate('/dashboard', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }
        } catch (error) {
            message.error(' Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-sans bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
            <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row w-full max-w-4xl m-4 h-[600px] relative z-10">
                {/* Left Side - Image & Branding */}
                <div className="w-full md:w-1/2 bg-slate-900 relative hidden md:flex flex-col items-center justify-center p-8 text-white">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')" }}></div>
                    <div className="z-10 text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Image src="/logopk.png" alt="Parkivia Logo" preview={false} width={60} />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Chào Mừng Trở Lại</h2>
                        <p className="text-gray-300">Kết nối với hệ thống quản lý bãi xe thông minh số 1 Việt Nam.</p>
                    </div>
                    <div className="absolute bottom-4 text-xs text-gray-500">© 2024 Parkivia System</div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="md:hidden text-center mb-8">
                        <Image src="/logopk.png" alt="Logo" preview={false} width={60} />
                        <h2 className="text-2xl font-bold text-slate-900 mt-2">Đăng Nhập</h2>
                    </div>

                    <h2 className="hidden md:block text-3xl font-bold text-slate-900 mb-2">Đăng Nhập</h2>
                    <p className="text-gray-500 mb-8">Nhập thông tin tài khoản của bạn để tiếp tục.</p>

                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-orange-500" />}
                                placeholder="Tên đăng nhập"
                                className="rounded-lg border-gray-300 hover:border-orange-500 focus:border-orange-500"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-orange-500" />}
                                placeholder="Mật khẩu"
                                className="rounded-lg border-gray-300 hover:border-orange-500 focus:border-orange-500"
                            />
                        </Form.Item>

                        <div className="flex justify-between items-center mb-6">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                {/* Checkbox removed for simplicity or added back if needed */}
                            </Form.Item>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                                onClick={() => navigate('/forgot-password')}
                                className="text-sm font-semibold text-orange-500 hover:text-orange-600 cursor-pointer"
                            >
                                Quên mật khẩu?
                            </a>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="bg-orange-500 hover:bg-orange-600 border-none font-bold h-12 rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                ĐĂNG NHẬP
                            </Button>
                        </Form.Item>

                        <div className="text-center mt-6">
                            <span className="text-gray-500">Chưa có tài khoản? </span>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                                onClick={() => navigate('/register')}
                                className="font-bold text-slate-900 hover:text-orange-500 cursor-pointer transition-colors"
                            >
                                Đăng ký ngay
                            </a>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login; 