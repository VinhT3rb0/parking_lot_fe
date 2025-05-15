import React, { useState } from 'react';
import { Table, Tag, Modal, Form, Input, Button, Select, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddAndUpdateUser from './CreateAndUpdateUser';

interface User {
    id: string;
    fullName: string;
    cardNumber: string;
    vehicleType: 'car' | 'motorbike';
    licensePlate?: string;
    registeredDate: string;
    expirationDate: string;
    status: 'active' | 'expired' | 'pending';
}

const UserManagementView: React.FC = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            fullName: 'Nguyễn Văn A',
            cardNumber: 'CARD-001',
            vehicleType: 'car',
            licensePlate: '29A-123.45',
            registeredDate: '2024-03-01',
            expirationDate: '2025-03-01',
            status: 'active'
        },
        {
            id: '2',
            fullName: 'Trần Thị B',
            cardNumber: 'CARD-002',
            vehicleType: 'motorbike',
            registeredDate: '2024-03-15',
            expirationDate: '2025-03-15',
            status: 'expired'
        }
    ]);

    const columns: ColumnsType<User> = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Số thẻ',
            dataIndex: 'cardNumber',
            key: 'cardNumber',
        },
        {
            title: 'Loại xe',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
            render: (type) => (
                <Tag color={type === 'car' ? 'blue' : 'green'}>
                    {type === 'car' ? 'Ô tô' : 'Xe máy'}
                </Tag>
            )
        },
        {
            title: 'Biển số xe',
            dataIndex: 'licensePlate',
            key: 'licensePlate',
            render: (text) => <span>{text || 'Chưa có'}</span>
        },
        {
            title: 'Ngày đăng ký',
            dataIndex: 'registeredDate',
            key: 'registeredDate',
            render: (date) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expirationDate',
            key: 'expirationDate',
            render: (date) => {
                const expirationDate = dayjs(date).format('DD/MM/YYYY');
                return <span>{expirationDate}</span>;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusMap = {
                    active: { color: 'green', text: 'Đang hoạt động' },
                    expired: { color: 'red', text: 'Hết hạn' },
                    pending: { color: 'orange', text: 'Chờ kích hoạt' }
                };
                return (
                    <Tag color={statusMap[status].color}>
                        {statusMap[status].text}
                    </Tag>
                );
            }
        }
    ];

    const handleAddUser = () => {
        setIsModalOpen(true);
        setSelectedUser(null);
        form.resetFields();
    };

    const handleEditUser = (record: User) => {
        setIsModalOpen(true);
        setSelectedUser(record);
        form.setFieldsValue({
            ...record,
            registeredDate: dayjs(record.registeredDate)
        });
    };

    const handleSubmit = (values: any) => {
        const formattedValues = {
            ...values,
            registeredDate: values.registeredDate.format('YYYY-MM-DD')
        };

        if (selectedUser) {
            setUsers(prev => prev.map(u =>
                u.id === selectedUser.id ? { ...formattedValues, id: u.id } : u
            ));
        } else {
            setUsers(prev => [...prev, {
                ...formattedValues,
                id: Date.now().toString(),
                status: 'pending'
            }]);
        }
        setIsModalOpen(false);
    };
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleFilterChange = (value: string) => {
        setFilterStatus(value);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = filterStatus ? user.status === filterStatus : true;
        return matchesSearch && matchesStatus;
    });
    return (
        <div>
            <div className="flex justify-between mb-4">
                <div className="flex gap-4">
                    <Input
                        placeholder="Tìm kiếm theo tên"
                        prefix={<SearchOutlined />}
                        onChange={handleSearch}
                        allowClear
                    />
                    <Select
                        placeholder="Lọc theo trạng thái"
                        onChange={(value) => setFilterStatus(value)}
                        allowClear
                        style={{ width: 200 }}
                    >
                        <Select.Option value="active">Đang hoạt động</Select.Option>
                        <Select.Option value="expired">Hết hạn</Select.Option>
                        <Select.Option value="pending">Chờ kích hoạt</Select.Option>
                    </Select>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddUser}
                >
                    Đăng ký thẻ mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleEditUser(record)
                })}
                rowClassName="cursor-pointer hover:bg-gray-50"
            />
            <AddAndUpdateUser
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialValues={selectedUser || { status: 'pending' }}
                isEditing={!!selectedUser}
            />
        </div>
    );
};

export default UserManagementView;