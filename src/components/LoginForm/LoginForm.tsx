import React from "react";
import { Button, Form, Input } from "antd";

function LoginForm({
    onFinish,
    error,
    onChangeInput,
    loading,
}: {
    onFinish: (values: any) => void;
    error: string | null;
    onChangeInput: () => void;
    loading: boolean;
}) {
    return (
        <Form className="flex-1" onFinish={onFinish}>
            <Form.Item
                name="username"
                rules={[{ required: true, message: "Vui lòng điền tên đăng nhập!" }]}
                className="mb-3"
            >
                <Input
                    prefix={
                        <span className="site-form-item-icon">
                        </span>
                    }
                    className="bg-input bg-inherit"
                    placeholder="Username"
                    onChange={onChangeInput}
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng điền mật khẩu" }]}
                className="mb-1"
            >
                <Input.Password
                    prefix={
                        <span className="site-form-item-icon">
                        </span>
                    }
                    type="password"
                    placeholder="Password"
                    className="bg-input bg-inherit"
                    onChange={onChangeInput}
                />
            </Form.Item>
            {error && <div className="text-red-500">{error}</div>}

            <Form.Item>
                <Button htmlType="submit" className="login__submit mt-2" block loading={loading}>
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
    );
}

export default LoginForm;