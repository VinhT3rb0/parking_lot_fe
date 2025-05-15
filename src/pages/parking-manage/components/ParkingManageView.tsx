import React, { useState } from 'react';
import { Button, Table, Tag, Modal, Form, Input, Select, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import CreateAndUpdateParking from './CreateAndUpdateParking';

interface ParkingLot {
    id: string;
    name: string;
    type: 'car' | 'motorbike';
    capacity: number;
    available: number;
    status: 'active' | 'inactive';
}

const ParkingManageView: React.FC = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParking, setSelectedParking] = useState<ParkingLot | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [parkingLots, setParkingLots] = useState<ParkingLot[]>([
        {
            id: '1',
            name: 'Bãi A - Tòa nhà Sunrise',
            type: 'car',
            capacity: 100,
            available: 30,
            status: 'active'
        },
        {
            id: '2',
            name: 'Bãi Xe Máy - Trung tâm thương mại',
            type: 'motorbike',
            capacity: 500,
            available: 150,
            status: 'active'
        }
    ]);

    const columns: ColumnsType<ParkingLot> = [
        {
            title: 'Tên bãi đỗ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Loại xe',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'car' ? 'blue' : 'green'}>
                    {type === 'car' ? 'Ô tô' : 'Xe máy'}
                </Tag>
            )
        },
        {
            title: 'Sức chứa',
            dataIndex: 'capacity',
            key: 'capacity',
            align: 'center'
        },
        {
            title: 'Chỗ trống',
            dataIndex: 'available',
            key: 'available',
            align: 'center'
        },
        {
            title: 'Tình trạng',
            key: 'status',
            render: (_, record) => (
                <Progress
                    percent={Math.round((record.available / record.capacity) * 100)}
                    status={record.available === 0 ? 'exception' : 'normal'}
                />
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Tag>
            )
        }
    ];

    const handleAddParking = () => {
        // setSelectedParking(null);
        // form.resetFields();
        setIsModalOpen(true);
        setIsEdit(false); // Chế độ thêm mới

    };

    const handleEditParking = (record: ParkingLot) => {
        setIsModalOpen(true);
        setSelectedParking(record);
        setIsEdit(true); // Chế độ sửa
        // form.setFieldsValue(record);
    };

    const handleSubmit = (values: ParkingLot) => {
        if (selectedParking) {
            // Update existing
            setParkingLots(prev => prev.map(p =>
                p.id === selectedParking.id ? { ...values, id: p.id } : p
            ));
        } else {
            // Add new
            setParkingLots(prev => [...prev, {
                ...values,
                id: Date.now().toString(),
                available: values.capacity
            }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Quản lý Bãi đỗ</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddParking}
                >
                    Thêm bãi đỗ
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={parkingLots}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleEditParking(record)
                })}
                rowClassName="cursor-pointer hover:bg-gray-50"
            />
            <CreateAndUpdateParking
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialValues={selectedParking || { status: 'active' }}
                isEditing={isEdit}
            />

        </div>
    );
};

export default ParkingManageView;