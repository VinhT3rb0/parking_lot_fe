import React from 'react';
import { Layout, Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useForgotPasswordMutation } from '../../api/app_home/apiAuth';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    // Lấy ra hàm gọi api quên mật khẩu
    const [forgotPassword] = useForgotPasswordMutation();

    const handleSubmit = async (values: { email: string }) => {
        try {
            await forgotPassword(values).unwrap();
            message.success('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn!');
            form.resetFields();
            navigate('/login');
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại sau!');
        }
    };

    return (
        <Layout className="forgot-password-container">
            <Content className="forgot-password-content">
                <Card className="forgot-password-card">
                    <div className="forgot-password-header">
                        <Title level={2}>Quên Mật Khẩu</Title>
                        <Text>Vui lòng nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</Text>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="forgot-password-form"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email của bạn!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Nhập email của bạn"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                            >
                                Gửi Yêu Cầu
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="link"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate('/login')}
                                block
                            >
                                Quay lại trang đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default ForgotPassword;
