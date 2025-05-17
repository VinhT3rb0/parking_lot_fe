import React, { useState } from 'react';
import { Button, Table, Tag, Progress, message, Modal, Space, Input, Select, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import CreateAndUpdateParking from './CreateAndUpdateParking';
import { useAuth } from '../../../contexts/AuthContext';
import {
    useGetAllParkingLotsQuery,
    useCreateParkingLotMutation,
    useUpdateParkingLotMutation,
    ParkingLot,
    useDeleteParkingLotMutation,
    ParkingLotFilter
} from '../../../api/app_parkinglot/apiParkinglot';

const ParkingManageView: React.FC = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<ParkingLotFilter>({});
    const { data: parkingLotsData, isLoading, refetch } = useGetAllParkingLotsQuery(filters);
    const [createParkingLot] = useCreateParkingLotMutation();
    const [updateParkingLot] = useUpdateParkingLotMutation();
    const [deleteParkingLot] = useDeleteParkingLotMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParking, setSelectedParking] = useState<ParkingLot | null>(null);
    const [isEdit, setIsEdit] = useState(false);

    const handleFilterChange = (key: keyof ParkingLotFilter, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleDeleteParking = (record: ParkingLot, e: React.MouseEvent) => {
        e.stopPropagation();
        const { confirm } = Modal;
        confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa bãi đỗ này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteParkingLot(record.id).unwrap();
                    message.success('Xóa bãi đỗ thành công!');
                    refetch();
                } catch (error) {
                    message.error('Có lỗi xảy ra khi xóa bãi đỗ!');
                }
            }
        });
    }
    const columns: ColumnsType<ParkingLot> = [
        {
            title: 'Tên bãi đỗ',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: ParkingLot) => (
                <a onClick={() => handleEditParking(record)}>{text}</a>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Loại xe',
            dataIndex: 'vehicleTypes',
            key: 'vehicleTypes',
            render: (vehicleTypes: string) => (
                <>
                    {vehicleTypes
                        .replace(/[\[\]]/g, '')
                        .split(',')
                        .map((type, index) => (
                            <Tag color="blue" key={index}>
                                {type.trim()}
                            </Tag>
                        ))}
                </>
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
            dataIndex: 'availableSlots',
            key: 'availableSlots',
            align: 'center'
        },
        {
            title: 'Tình trạng',
            key: 'occupancy',
            render: (_, record) => (
                <Progress
                    percent={Math.round((record.availableSlots / record.capacity) * 100)}
                    status={record.availableSlots === 0 ? 'exception' : 'normal'}
                />
            )
        },
        {
            title: 'Giá theo giờ',
            dataIndex: 'hourlyRate',
            key: 'hourlyRate',
            align: 'right',
            render: (value) => `${value.toLocaleString()}đ`
        },
        {
            title: 'Giá theo ngày',
            dataIndex: 'dailyRate',
            key: 'dailyRate',
            align: 'right',
            render: (value) => `${value.toLocaleString()}đ`
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
                    {status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    danger
                    onClick={(e) => handleDeleteParking(record, e)}
                >
                    Xóa
                </Button>
            )
        }
    ];

    const handleAddParking = () => {
        setSelectedParking(null);
        setIsModalOpen(true);
        setIsEdit(false);
    };

    const handleEditParking = (record: ParkingLot) => {
        setIsModalOpen(true);
        setSelectedParking(record);
        setIsEdit(true);
    };

    const handleSubmit = async (values: any) => {
        try {
            if (!user?.id) {
                message.error('Không tìm thấy thông tin người dùng');
                return;
            }

            if (isEdit && selectedParking) {
                await updateParkingLot({
                    id: selectedParking.id,
                    data: values
                }).unwrap();
                message.success('Cập nhật bãi đỗ thành công!');
            } else {
                await createParkingLot({
                    ...values,
                    ownerId: user.id,
                    availableSlots: values.capacity
                }).unwrap();
                message.success('Thêm bãi đỗ thành công!');
            }
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    return (
        <div>
            <div className="mb-4">
                <Row gutter={[16, 16]} align="middle">
                    <Col span={6}>
                        <Input
                            placeholder="Tìm kiếm theo tên"
                            prefix={<SearchOutlined />}
                            value={filters.name || ''}
                            onChange={e => handleFilterChange('name', e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col span={4}>
                        <Select
                            mode="multiple"
                            placeholder="Loại xe"
                            style={{ width: '100%' }}
                            value={filters.vehicleTypes ? filters.vehicleTypes.split(',') : undefined}
                            onChange={value => handleFilterChange('vehicleTypes', value.join(','))}
                            allowClear
                        >
                            <Select.Option value="Xe máy">Xe máy</Select.Option>
                            <Select.Option value="Ô tô">Ô tô</Select.Option>
                            <Select.Option value="Xe tải">Xe tải</Select.Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Mái che"
                            style={{ width: '100%' }}
                            value={filters.isCovered}
                            onChange={value => handleFilterChange('isCovered', value)}
                            allowClear
                        >
                            <Select.Option value={true}>Có mái che</Select.Option>
                            <Select.Option value={false}>Không có mái che</Select.Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select
                            placeholder="Trạng thái"
                            style={{ width: '100%' }}
                            value={filters.status}
                            onChange={value => handleFilterChange('status', value)}
                            allowClear
                        >
                            <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                            <Select.Option value="INACTIVE">Ngừng hoạt động</Select.Option>
                        </Select>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddParking}
                        >
                            Thêm bãi đỗ
                        </Button>
                    </Col>
                </Row>
            </div>

            <Table
                columns={columns}
                dataSource={parkingLotsData}
                rowKey="id"
                loading={isLoading}
            />

            <CreateAndUpdateParking
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialValues={selectedParking || { status: 'ACTIVE', isCovered: false }}
                isEditing={isEdit}
            />
        </div>
    );
};

export default ParkingManageView;