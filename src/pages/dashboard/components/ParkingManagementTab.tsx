import React, { useState } from 'react';
import { Table, Tag, Progress, Button, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import CreateAndUpdateParking from '../../parking-manage/components/CreateAndUpdateParking';

interface ParkingLot {
    id: string;
    name: string;
    type: 'car' | 'motorbike';
    capacity: number;
    available: number;
    status: 'active' | 'inactive';
    revenue: number;
}

interface ParkingManagementTabProps {
    parkingLots: ParkingLot[];
}

const ParkingManagementTab: React.FC<ParkingManagementTabProps> = ({ parkingLots }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParking, setSelectedParking] = useState<ParkingLot | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');

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
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`
        }
    ];

    const handleAddParking = () => {
        setSelectedParking(null);
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleEditParking = (record: ParkingLot) => {
        setSelectedParking(record);
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleSubmit = (values: any) => {
        // Here you would typically update the parking lot data
        console.log('Updated values:', values);
        setIsModalOpen(false);
    };

    const filteredParkingLots = parkingLots.filter(lot => {
        const matchesSearch = lot.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesType = selectedType === 'all' || lot.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <>
            <div className="flex justify-between mb-4">
                <div className="flex gap-4">
                    <Input
                        placeholder="Tìm kiếm bãi đỗ..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                    <Select
                        value={selectedType}
                        onChange={setSelectedType}
                        style={{ width: 150 }}
                        options={[
                            { value: 'all', label: 'Tất cả loại xe' },
                            { value: 'car', label: 'Ô tô' },
                            { value: 'motorbike', label: 'Xe máy' }
                        ]}
                    />
                </div>
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
                dataSource={filteredParkingLots}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleEditParking(record),
                    style: { cursor: 'pointer' }
                })}
            />
            <CreateAndUpdateParking
                visible={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedParking(null);
                }}
                onSubmit={handleSubmit}
                initialValues={selectedParking || { status: 'active' }}
                isEditing={isEdit}
            />
        </>
    );
};

export default ParkingManagementTab;