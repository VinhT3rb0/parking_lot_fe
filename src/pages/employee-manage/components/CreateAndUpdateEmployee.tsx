import React from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { Employee } from '../../../api/app_employee/apiEmployee';

interface CreateAndUpdateEmployeeProps {
    isModalVisible: boolean;
    editingMode: 'create' | 'edit';
    selectedEmployee: Employee | null;
    form: any;
    onClose: () => void;
    onSubmit: (values: any) => void;
}

const CreateAndUpdateEmployee: React.FC<CreateAndUpdateEmployeeProps> = ({
    isModalVisible,
    editingMode,
    selectedEmployee,
    form,
    onClose,
    onSubmit,
}) => {
    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={editingMode === 'create' ? 'Thêm nhân viên mới' : 'Sửa thông tin nhân viên'}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                preserve={false}
            >
                {editingMode === 'create' && (
                    <>
                        <Form.Item
                            name="username"
                            label="Tên đăng nhập"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </>
                )}
                <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            {editingMode === 'create' ? 'Thêm' : 'Cập nhật'}
                        </Button>
                        <Button onClick={onClose}>Hủy</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateAndUpdateEmployee;
