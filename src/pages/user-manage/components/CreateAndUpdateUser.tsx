import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

interface UserModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    initialValues: any;
    isEditing: boolean;
}

const AddAndUpdateUser: React.FC<UserModalProps> = ({ visible, onClose, onSubmit, initialValues, isEditing }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (isEditing) {
                form.setFieldsValue({
                    ...initialValues,
                    registeredDate: dayjs(initialValues.registeredDate),
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, isEditing, initialValues, form]);

    const handleFinish = (values: any) => {
        const formattedValues = {
            ...values,
            registeredDate: values.registeredDate.format('YYYY-MM-DD'),
        };
        onSubmit(formattedValues);
        form.resetFields();
    };

    return (
        <Modal
            title={isEditing ? 'Chỉnh sửa thông tin' : 'Đăng ký thẻ mới'}
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ status: 'pending' }}
            >
                <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item
                    label="Số thẻ"
                    name="cardNumber"
                    rules={[{ required: true, message: 'Vui lòng nhập số thẻ' }]}
                >
                    <Input placeholder="Nhập số thẻ" />
                </Form.Item>

                <Form.Item
                    label="Loại xe"
                    name="vehicleType"
                    rules={[{ required: true, message: 'Vui lòng chọn loại xe' }]}
                >
                    <Select
                        options={[
                            { value: 'car', label: 'Ô tô' },
                            { value: 'motorbike', label: 'Xe máy' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Ngày đăng ký"
                    name="registeredDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày đăng ký' }]}
                >
                    <DatePicker format="DD/MM/YYYY" className="w-full" />
                </Form.Item>

                <Form.Item label="Trạng thái" name="status">
                    <Select
                        options={[
                            { value: 'active', label: 'Đang hoạt động' },
                            { value: 'expired', label: 'Hết hạn' },
                            { value: 'pending', label: 'Chờ kích hoạt' },
                        ]}
                    />
                </Form.Item>

                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="primary" htmlType="submit">
                        {isEditing ? 'Cập nhật' : 'Đăng ký'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddAndUpdateUser;