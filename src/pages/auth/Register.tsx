import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Form, Input, Button, message, Image } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../api/app_home/apiAuth';
import './Auth.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [register, { isLoading }] = useRegisterMutation();

    const onFinish = async (values: any) => {
        try {
            await register({
                username: values.username,
                email: values.email,
                password: values.password,
                role: 'CUSTOMER',
                active: true,
            }).unwrap();
            message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
            navigate('/verify', { state: { email: values.email } });
        } catch (error) {
            message.error('Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-sans p-4 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
            <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row w-full max-w-4xl h-auto md:h-[650px] relative z-10">
                {/* Left Side - Image & Branding */}
                <div className="w-full md:w-1/2 bg-slate-900 relative hidden md:flex flex-col items-center justify-center p-8 text-white">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573164713894-3aee67520e55?q=80&w=2669&auto=format&fit=crop')" }}></div>
                    <div className="z-10 text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Image src="/logopk.png" alt="Parkivia Logo" preview={false} width={60} />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Gia Nhập Parkivia</h2>
                        <p className="text-gray-300">Trải nghiệm dịch vụ đậu xe thông minh, tiện lợi và an toàn.</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
                    <div className="md:hidden text-center mb-8 mt-4">
                        <Image src="/logopk.png" alt="Logo" preview={false} width={60} />
                        <h2 className="text-2xl font-bold text-slate-900 mt-2">Đăng Ký</h2>
                    </div>

                    <h2 className="hidden md:block text-3xl font-bold text-slate-900 mb-2">Tạo Tài Khoản</h2>
                    <p className="text-gray-500 mb-6">Điền thông tin bên dưới để bắt đầu.</p>

                    <Form
                        form={form}
                        name="register"
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
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-orange-500" />}
                                placeholder="Email"
                                className="rounded-lg border-gray-300 hover:border-orange-500 focus:border-orange-500"
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
                                prefix={<LockOutlined className="text-orange-500" />}
                                placeholder="Mật khẩu"
                                className="rounded-lg border-gray-300 hover:border-orange-500 focus:border-orange-500"
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
                                prefix={<LockOutlined className="text-orange-500" />}
                                placeholder="Xác nhận mật khẩu"
                                className="rounded-lg border-gray-300 hover:border-orange-500 focus:border-orange-500"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={isLoading}
                                className="bg-orange-500 hover:bg-orange-600 border-none font-bold h-12 rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                ĐĂNG KÝ
                            </Button>
                        </Form.Item>

                        <div className="text-center mt-4">
                            <span className="text-gray-500">Đã có tài khoản? </span>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                                onClick={() => navigate('/login')}
                                className="font-bold text-slate-900 hover:text-orange-500 cursor-pointer transition-colors"
                            >
                                Đăng nhập ngay
                            </a>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register; 