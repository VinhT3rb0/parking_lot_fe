import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const CreateAndUpdateParking = ({ visible, onClose, onSubmit, initialValues, isEditing }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (isEditing) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [visible, isEditing, initialValues, form]);

    const handleOk = () => {
        form.validateFields().then(values => {
            onSubmit(values);
            form.resetFields();
        });
    };

    return (
        <Modal
            title={isEditing ? 'Chỉnh sửa bãi đỗ' : 'Thêm bãi đỗ'}
            open={visible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            onOk={handleOk}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Tên bãi đỗ" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="type" label="Loại xe" rules={[{ required: true }]}>
                    <Select>
                        <Option value="car">Ô tô</Option>
                        <Option value="motorbike">Xe máy</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="capacity" label="Sức chứa" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                    <Select>
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Ngừng hoạt động</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateAndUpdateParking;
