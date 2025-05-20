import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVerifyEmailMutation, useResendVerificationMutation } from '../../api/app_home/apiAuth';
import './Auth.css';

const Verify: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [verifyEmail] = useVerifyEmailMutation();
    const [resendVerification] = useResendVerificationMutation();
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const email = location.state?.email;

    const onFinish = async (values: any) => {
        if (!email) {
            message.error('Không tìm thấy thông tin email');
            return;
        }

        try {
            setIsVerifying(true);
            await verifyEmail({
                email: email,
                verificationCode: values.code
            }).unwrap();
            message.success('Xác thực email thành công!');
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 1000);
        } catch (error) {
            message.error('Mã xác thực không đúng. Vui lòng thử lại.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            message.error('Không tìm thấy email để gửi lại mã xác thực');
            return;
        }

        try {
            setIsResending(true);
            await resendVerification({ email }).unwrap();
            message.success('Đã gửi lại mã xác thực. Vui lòng kiểm tra email của bạn.');
        } catch (error) {
            message.error('Không thể gửi lại mã xác thực. Vui lòng thử lại sau.');
        } finally {
            setIsResending(false);
        }
    };

    if (!email) {
        return (
            <div className="auth-container">
                <Card title="Lỗi" className="auth-card">
                    <p>Không tìm thấy thông tin email. Vui lòng đăng ký lại.</p>
                    <Button type="primary" onClick={() => navigate('/register', { replace: true })}>
                        Quay lại đăng ký
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <Card title="Xác thực email" className="auth-card">
                <div className="logo-container">
                    <img src="/logopk.png" className='margin-auto' alt="Parking Lot Logo" />
                    <h1 className="form-title">Xác thực email</h1>
                    <p className="form-subtitle">Vui lòng nhập mã xác thực đã được gửi đến email: {email}</p>
                </div>
                <Form
                    form={form}
                    name="verify"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="code"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã xác thực!' },
                            { len: 6, message: 'Mã xác thực phải có 6 ký tự!' }
                        ]}
                    >
                        <Input
                            placeholder="Nhập mã xác thực 6 số"
                            maxLength={6}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="verify-button"
                            block
                            size="large"
                            loading={isVerifying}
                            disabled={isVerifying}
                        >
                            Xác thực
                        </Button>
                    </Form.Item>

                    <div className="auth-links">
                        <Button
                            type="link"
                            onClick={handleResendCode}
                            loading={isResending}
                            disabled={isResending}
                        >
                            Gửi lại mã xác thực
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Verify; 