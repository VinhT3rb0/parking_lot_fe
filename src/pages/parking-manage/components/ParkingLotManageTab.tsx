import React, { useState } from 'react';
import {
    Button,
    Table,
    Tag,
    Progress,
    message,
    Modal,
    Input,
    Select,
    Row,
    Col,
    Card,
    Typography,
    Space,
    Popconfirm
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EnvironmentOutlined,
    CarOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useDebounce } from '../../../hooks/useDebounce';
import {
    useGetAllParkingLotsQuery,
    useCreateParkingLotMutation,
    useUpdateParkingLotMutation,
    ParkingLot,
    useDeleteParkingLotMutation,
    ParkingLotFilter
} from '../../../api/app_parkinglot/apiParkinglot';
import ParkingLotDetail from './ParkingLotDetail';
import './ParkingLotManageTab.css';
const { Title, Text } = Typography;

const ParkingLotManageTab: React.FC = () => {
    const { user, isAdmin } = useAuth();
    const [filters, setFilters] = useState<ParkingLotFilter>({});
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const { data: parkingLotsData, isLoading, refetch } = useGetAllParkingLotsQuery({
        ...filters,
        name: debouncedSearchValue
    });
    const [createParkingLot] = useCreateParkingLotMutation();
    const [updateParkingLot] = useUpdateParkingLotMutation();
    const [deleteParkingLot] = useDeleteParkingLotMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParking, setSelectedParking] = useState<ParkingLot | undefined>(undefined);
    const [isEdit, setIsEdit] = useState(false);

    const handleFilterChange = (key: keyof ParkingLotFilter, value: string | string[] | boolean | undefined) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (key === 'vehicleTypes') {
                if (value && Array.isArray(value) && value.length > 0) {
                    newFilters[key] = value.join(',');
                } else {
                    delete newFilters[key];
                }
            } else if (key === 'isCovered') {
                if (typeof value === 'boolean') {
                    newFilters[key] = value;
                } else {
                    delete newFilters[key];
                }
            } else {
                if (value) {
                    newFilters[key] = value as string;
                } else {
                    delete newFilters[key];
                }
            }
            return newFilters;
        });
    };

    const handleDeleteParking = async (record: ParkingLot) => {
        try {
            await deleteParkingLot(record.id).unwrap();
            message.success('Xóa bãi đỗ thành công!');
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa bãi đỗ!');
        }
    };

    const columns: ColumnsType<ParkingLot> = [
        {
            title: 'TÊN BÃI ĐỖ',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: ParkingLot) => (
                <div className="parking-name-cell">
                    <div className="parking-name">{text}</div>
                    <div className="parking-address">
                        <EnvironmentOutlined className="address-icon" />
                        <Text type="secondary">{record.address}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'LOẠI XE',
            dataIndex: 'vehicleTypes',
            key: 'vehicleTypes',
            render: (vehicleTypes: string) => (
                <div className="vehicle-tags">
                    {vehicleTypes
                        .replace(/[\[\]]/g, '')
                        .split(',')
                        .map((type, index) => (
                            <Tag
                                key={index}
                                color={type.includes('Xe máy') ? 'blue' : type.includes('Ô tô') ? 'geekblue' : 'cyan'}
                                className="vehicle-tag"
                            >
                                {type.trim()}
                            </Tag>
                        ))}
                </div>
            )
        },
        {
            title: 'SỨC CHỨA',
            dataIndex: 'capacity',
            key: 'capacity',
            align: 'center',
            render: (value) => <Text strong>{value}</Text>
        },
        {
            title: 'CHỖ TRỐNG',
            dataIndex: 'availableSlots',
            key: 'availableSlots',
            align: 'center',
            render: (value, record) => (
                <div className={`available-slots ${value < 5 ? 'low-availability' : ''}`}>
                    <Text strong>{value}</Text>
                    {value < 5 && <InfoCircleOutlined className="warning-icon" />}
                </div>
            )
        },
        {
            title: 'TÌNH TRẠNG',
            key: 'occupancy',
            render: (_, record) => (
                <div className="occupancy-container">
                    <Progress
                        percent={Math.round((record.availableSlots / record.capacity) * 100)}
                        status={record.availableSlots === 0 ? 'exception' : 'normal'}
                        strokeColor={record.availableSlots / record.capacity > 0.3 ? '#52c41a' : '#faad14'}
                        showInfo={false}
                    />
                    <Text type="secondary" className="occupancy-text">
                        {Math.round((record.availableSlots / record.capacity) * 100)}% còn trống
                    </Text>
                </div>
            )
        },
        {
            title: 'GIÁ CẢ',
            key: 'pricing',
            render: (_, record) => (
                <div className="pricing-info">
                    <div className="pricing-item">
                        <Text type="secondary">Giờ:</Text>
                        <Text strong className="pricing-value">{record.hourlyRate.toLocaleString()}đ</Text>
                    </div>
                    <div className="pricing-item">
                        <Text type="secondary">Ngày:</Text>
                        <Text strong className="pricing-value">{record.dailyRate.toLocaleString()}đ</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    color={status === 'ACTIVE' ? 'green' : 'red'}
                    className="status-tag"
                >
                    {status === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'NGỪNG HOẠT ĐỘNG'}
                </Tag>
            )
        },
        ...(isAdmin ? [{
            title: 'HÀNH ĐỘNG',
            key: 'action',
            align: 'center' as const,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        ghost
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditParking(record);
                        }}
                        className="action-button"
                    />
                    <Popconfirm
                        title="Xác nhận xóa bãi đỗ"
                        description="Bạn có chắc chắn muốn xóa bãi đỗ này?"
                        onConfirm={() => handleDeleteParking(record)}
                        onCancel={(e) => e?.stopPropagation()}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                            className="action-button"
                        />
                    </Popconfirm>
                </Space>
            )
        }] : [])
    ];

    const handleAddParking = () => {
        setSelectedParking(undefined);
        setIsModalOpen(true);
        setIsEdit(false);
    };

    const handleEditParking = (record: ParkingLot) => {
        setSelectedParking(record);
        setIsModalOpen(true);
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
                    availableSlots: values.availableSlots || values.capacity
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
        <div className="parking-lot-manage">
            <Card className="filter-card">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={6}>
                        <Input
                            placeholder="Tìm kiếm theo tên"
                            prefix={<SearchOutlined />}
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            allowClear
                            size="large"
                        />
                    </Col>
                    <Col xs={24} md={6}>
                        <Select
                            mode="multiple"
                            placeholder="Loại xe"
                            style={{ width: '100%' }}
                            value={filters.vehicleTypes ? filters.vehicleTypes.split(',') : undefined}
                            onChange={value => handleFilterChange('vehicleTypes', value)}
                            allowClear
                            size="large"
                            suffixIcon={<CarOutlined />}
                        >
                            <Select.Option value="Xe máy">Xe máy</Select.Option>
                            <Select.Option value="Ô tô">Ô tô</Select.Option>
                            <Select.Option value="Xe tải">Xe tải</Select.Option>
                            <Select.Option value="Xe đạp">Xe đạp</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} md={4}>
                        <Select
                            placeholder="Mái che"
                            style={{ width: '100%' }}
                            value={filters.isCovered}
                            onChange={value => handleFilterChange('isCovered', value)}
                            allowClear
                            size="large"
                        >
                            <Select.Option value={true}>Có mái che</Select.Option>
                            <Select.Option value={false}>Không mái che</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} md={4}>
                        <Select
                            placeholder="Trạng thái"
                            style={{ width: '100%' }}
                            value={filters.status}
                            onChange={value => handleFilterChange('status', value)}
                            allowClear
                            size="large"
                        >
                            <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                            <Select.Option value="INACTIVE">Ngừng hoạt động</Select.Option>
                        </Select>
                    </Col>
                    {isAdmin && (
                        <Col xs={24} md={4} style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddParking}
                                size="large"
                                className="add-button"
                            >
                                Thêm bãi đỗ
                            </Button>
                        </Col>
                    )}
                </Row>
            </Card>

            <Card className="table-card">
                <Table
                    columns={columns}
                    dataSource={parkingLotsData}
                    rowKey="id"
                    loading={isLoading}
                    onRow={(record) => ({
                        onClick: () => handleEditParking(record),
                        className: 'parking-row'
                    })}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total) => `Tổng ${total} bãi đỗ`
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            <ParkingLotDetail
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialValues={selectedParking}
                isEditing={isEdit}
            />
        </div>
    );
};

export default ParkingLotManageTab;