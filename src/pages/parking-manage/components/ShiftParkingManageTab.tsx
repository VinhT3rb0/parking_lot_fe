import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGetAllEmployeesQuery, useCreateEmployeeMutation, useUpdateEmployeeMutation, useDeleteEmployeeMutation, Employee } from '../../../api/app_employee/apiEmployee';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

const ShiftParkingManageTab: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [searchName, setSearchName] = useState('');

    const { data: employees, isLoading, refetch } = useGetAllEmployeesQuery(searchName);
    const [createEmployee] = useCreateEmployeeMutation();
    const [updateEmployee] = useUpdateEmployeeMutation();
    const [deleteEmployee] = useDeleteEmployeeMutation();

    const columns: ColumnsType<Employee> = [
        {
            title: 'Tên nhân viên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <span>
                    {role === 'ADMIN' ? 'Quản trị viên' :
                        role === 'MANAGER' ? 'Quản lý' : 'Nhân viên'}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span style={{ color: status === 'ACTIVE' ? 'green' : 'red' }}>
                    {status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ việc'}
                </span>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setSelectedEmployee(null);
        setIsEdit(false);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Employee) => {
        setSelectedEmployee(record);
        setIsEdit(true);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (record: Employee) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
            onOk: async () => {
                try {
                    await deleteEmployee(record.id).unwrap();
                    message.success('Xóa nhân viên thành công!');
                    refetch();
                } catch (error) {
                    message.error('Có lỗi xảy ra khi xóa nhân viên!');
                }
            },
        });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (isEdit && selectedEmployee) {
                await updateEmployee({
                    id: selectedEmployee.id,
                    data: values,
                }).unwrap();
                message.success('Cập nhật nhân viên thành công!');
            } else {
                await createEmployee(values).unwrap();
                message.success('Thêm nhân viên thành công!');
            }
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Space>
                    <Input.Search
                        placeholder="Tìm kiếm theo tên"
                        allowClear
                        onSearch={setSearchName}
                        style={{ width: 300 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm nhân viên
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={employees}
                rowKey="id"
                loading={isLoading}
            />

            <Modal
                title={isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                okText={isEdit ? 'Cập nhật' : 'Thêm'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên nhân viên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
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

                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select>
                            <Option value="ADMIN">Quản trị viên</Option>
                            <Option value="MANAGER">Quản lý</Option>
                            <Option value="STAFF">Nhân viên</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Option value="ACTIVE">Đang làm việc</Option>
                            <Option value="INACTIVE">Đã nghỉ việc</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ShiftParkingManageTab; 