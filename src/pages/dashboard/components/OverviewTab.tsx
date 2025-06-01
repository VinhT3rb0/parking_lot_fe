import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Typography } from 'antd';
import {
    DollarOutlined,
    CarOutlined,
    UserOutlined,
    EnvironmentOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { ParkingLot } from '../../../api/app_parkinglot/apiParkinglot';
import { useGetRevenueQuery } from '../../../api/app_revenue/apiRevenue';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface OverviewTabProps {
    parkingLots: ParkingLot[];
    isLoading: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ parkingLots, isLoading }) => {
    const today = dayjs().format('YYYY-MM-DD');
    const { data: revenueResponse, isLoading: isLoadingRevenue } = useGetRevenueQuery({
        startDate: today,
        endDate: today
    }, {
        refetchOnMountOrArgChange: true
    });
    if (isLoading && isLoadingRevenue) {
        return (
            <div className="p-4 flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <div>Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }
    const totalRevenue = revenueResponse?.reduce((sum, record) =>
        sum + record.totalRevenue, 0) || 0;

    const totalSessions = revenueResponse?.reduce((sum, record) =>
        sum + record.totalSessions, 0) || 0;

    const totalParkingSpots = parkingLots.reduce((sum, lot) => sum + lot.capacity, 0);
    const availableSpots = parkingLots.reduce((sum, lot) => sum + lot.availableSlots, 0);
    const occupiedSpots = totalParkingSpots - availableSpots;

    const activeParkingLots = parkingLots.filter(lot => lot.status === 'ACTIVE').length;
    const inactiveParkingLots = parkingLots.length - activeParkingLots;

    const totalEmployees = parkingLots.reduce((sum, lot) =>
        sum + (lot.employeeDTOs ? lot.employeeDTOs.length : 0), 0
    );
    const utilizationPercent = totalParkingSpots > 0
        ? Math.round((occupiedSpots / totalParkingSpots) * 100)
        : 0;

    return (
        <div className="p-4">
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={12}>
                    <Card className="h-full">
                        <Statistic
                            title="Tổng doanh thu ngày"
                            value={totalRevenue}
                            prefix={<DollarOutlined />}
                            suffix="VNĐ"
                            valueStyle={{ color: '#3f8600' }}
                            formatter={(value) => `${Number(value).toLocaleString('vi-VN')}`}
                        />
                        <div className="mt-4">
                            <Text type="secondary">Ngày: {today}</Text>
                            <div className="mt-2">
                                <Text type="secondary">Tổng lượt gửi xe:</Text>
                                <Text strong className="ml-2">{totalSessions}</Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card className="h-full">
                        <div className="flex justify-between items-start">
                            <Statistic
                                title="Tổng số bãi xe"
                                value={parkingLots.length}
                                prefix={<EnvironmentOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                            <div>
                                <Tag icon={<CheckCircleOutlined />} color="success">
                                    Đang hoạt động: {activeParkingLots}
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} color="warning" className="mt-2">
                                    Tạm dừng: {inactiveParkingLots}
                                </Tag>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Text type="secondary">Nhân viên quản lý</Text>
                            <Title level={4} className="mt-1">
                                {totalEmployees} người
                            </Title>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Parking Spots Section */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={24}>
                    <Card title="Tình trạng chỗ đỗ xe">
                        <div className="flex items-center mb-4">
                            <Text strong className="mr-4">Tổng số chỗ đỗ:</Text>
                            <Text>{totalParkingSpots.toLocaleString('vi-VN')}</Text>
                            <div className="ml-auto flex">
                                <Tag color="green" className="mr-2">
                                    Còn trống: {availableSpots.toLocaleString('vi-VN')}
                                </Tag>
                                <Tag color="orange">
                                    Đã sử dụng: {occupiedSpots.toLocaleString('vi-VN')}
                                </Tag>
                            </div>
                        </div>

                        <Progress
                            percent={utilizationPercent}
                            status="active"
                            strokeColor={{
                                '0%': '#87d068',
                                '100%': '#ff5500',
                            }}
                        />

                        <div className="mt-6 grid grid-cols-3 gap-4">
                            {parkingLots.map(lot => (
                                <Card
                                    key={lot.id}
                                    size="small"
                                    title={<span className="font-bold">{lot.name}</span>}
                                    extra={<Tag color={lot.status === 'ACTIVE' ? 'green' : 'orange'}>{lot.status}</Tag>}
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <Text type="secondary">Sức chứa:</Text>
                                            <div>{lot.capacity}</div>
                                        </div>
                                        <div>
                                            <Text type="secondary">Còn trống:</Text>
                                            <div className={lot.availableSlots < 10 ? 'text-red-500' : 'text-green-500'}>
                                                {lot.availableSlots}
                                            </div>
                                        </div>
                                        <div>
                                            <Text type="secondary">Giá/giờ:</Text>
                                            <div>{lot.hourlyRate.toLocaleString('vi-VN')} VNĐ</div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="Loại phương tiện">
                        <div className="grid grid-cols-4 gap-4">
                            {parkingLots.map(lot => (
                                <Card key={lot.id} size="small">
                                    <div className="font-medium mb-2">{lot.name}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {lot.vehicleTypes.split(',').map((type, idx) => (
                                            <Tag key={idx} color="blue">
                                                {type.trim()}
                                            </Tag>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OverviewTab;