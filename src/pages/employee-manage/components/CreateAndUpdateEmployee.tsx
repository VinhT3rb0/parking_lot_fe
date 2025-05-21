import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space, DatePicker, Select } from 'antd';
import { Employee } from '../../../api/app_employee/apiEmployee';
import dayjs from 'dayjs';

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

    useEffect(() => {
        if (isModalVisible && editingMode === 'edit' && selectedEmployee) {
            console.log('Selected Employee:', selectedEmployee);
            const formValues = {
                parkingLotId: selectedEmployee.parkingLotId,
                userDTO: {
                    username: selectedEmployee.userResponse.username,
                    fullname: selectedEmployee.userResponse.fullname,
                    email: selectedEmployee.userResponse.email,
                    phoneNumber: selectedEmployee.userResponse.phoneNumber,
                    dateOfBirth: dayjs(selectedEmployee.userResponse.dateOfBirth),
                },
                status: selectedEmployee.status,
            };
            Promise.resolve().then(() => {
                form.setFieldsValue(formValues);
            });
        }
    }, [isModalVisible, editingMode, selectedEmployee, form]);

    return (
        <Modal
            title={editingMode === 'create' ? 'Thêm nhân viên mới' : 'Sửa thông tin nhân viên'}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
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
                            name={['userDTO', 'username']}
                            label="Tên đăng nhập"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={['userDTO', 'password']}
                            label="Mật khẩu"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </>
                )}
                <Form.Item
                    name={['userDTO', 'fullname']}
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['userDTO', 'email']}
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['userDTO', 'phoneNumber']}
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['userDTO', 'dateOfBirth']}
                    label="Ngày sinh"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select>
                        <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                        <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
                    </Select>
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
