import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, DatePicker, Radio, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import RevenueDetailModal from './RevenueDetailModal';

interface RevenueData {
    date: string;
    amount: number;
    type: 'car' | 'motorbike';
}

interface ParkingLotRevenue {
    id: string;
    name: string;
    type: 'car' | 'motorbike';
    totalRevenue: number;
    carRevenue: number;
    motorbikeRevenue: number;
}

interface RevenueDetail {
    time: string;
    vehicleType: 'car' | 'motorbike';
    licensePlate: string;
    amount: number;
    duration: string;
}

interface RevenueTabProps {
    revenueData: RevenueData[];
}

const RevenueTab: React.FC<RevenueTabProps> = ({ revenueData }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParking, setSelectedParking] = useState<ParkingLotRevenue | null>(null);

    // Sample data for daily parking lot revenues
    const dailyParkingLotRevenues: ParkingLotRevenue[] = [
        {
            id: '1',
            name: 'Bãi A - Tòa nhà Sunrise',
            type: 'car',
            totalRevenue: 5000000,
            carRevenue: 4000000,
            motorbikeRevenue: 1000000
        },
        {
            id: '2',
            name: 'Bãi Xe Máy - Trung tâm thương mại',
            type: 'motorbike',
            totalRevenue: 3000000,
            carRevenue: 500000,
            motorbikeRevenue: 2500000
        }
    ];

    // Sample data for monthly parking lot revenues
    const monthlyParkingLotRevenues: ParkingLotRevenue[] = [
        {
            id: '1',
            name: 'Bãi A - Tòa nhà Sunrise',
            type: 'car',
            totalRevenue: 150000000,
            carRevenue: 120000000,
            motorbikeRevenue: 30000000
        },
        {
            id: '2',
            name: 'Bãi Xe Máy - Trung tâm thương mại',
            type: 'motorbike',
            totalRevenue: 90000000,
            carRevenue: 15000000,
            motorbikeRevenue: 75000000
        }
    ];

    // Sample data for revenue details
    const revenueDetails: RevenueDetail[] = [
        {
            time: '08:00',
            vehicleType: 'car',
            licensePlate: '30A-12345',
            amount: 50000,
            duration: '2 giờ'
        },
        {
            time: '09:30',
            vehicleType: 'motorbike',
            licensePlate: '30B-67890',
            amount: 20000,
            duration: '1 giờ'
        }
    ];

    const columns: ColumnsType<ParkingLotRevenue> = [
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
            title: 'Doanh thu xe ô tô',
            dataIndex: 'carRevenue',
            key: 'carRevenue',
            render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`
        },
        {
            title: 'Doanh thu xe máy',
            dataIndex: 'motorbikeRevenue',
            key: 'motorbikeRevenue',
            render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`
        },
        {
            title: 'Tổng doanh thu',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`
        }
    ];

    const handleDateChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleMonthChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            setSelectedMonth(date);
        }
    };

    const handleViewTypeChange = (e: any) => {
        setViewType(e.target.value);
    };

    const handleRowClick = (record: ParkingLotRevenue) => {
        setSelectedParking(record);
        setIsModalOpen(true);
    };

    const currentRevenues = viewType === 'daily' ? dailyParkingLotRevenues : monthlyParkingLotRevenues;
    const totalRevenue = currentRevenues.reduce((sum, lot) => sum + lot.totalRevenue, 0);
    const totalCarRevenue = currentRevenues.reduce((sum, lot) => sum + lot.carRevenue, 0);
    const totalMotorbikeRevenue = currentRevenues.reduce((sum, lot) => sum + lot.motorbikeRevenue, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Doanh thu</h2>
                <div className="flex items-center gap-4">
                    <Radio.Group value={viewType} onChange={handleViewTypeChange}>
                        <Radio.Button value="daily">Theo ngày</Radio.Button>
                        <Radio.Button value="monthly">Theo tháng</Radio.Button>
                    </Radio.Group>
                    {viewType === 'daily' ? (
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            format="DD/MM/YYYY"
                        />
                    ) : (
                        <DatePicker
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            picker="month"
                            format="MM/YYYY"
                        />
                    )}
                </div>
            </div>

            <Row gutter={[16, 16]} className="mb-6">
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={totalRevenue}
                            prefix={<DollarOutlined />}
                            formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Doanh thu xe ô tô"
                            value={totalCarRevenue}
                            prefix={<DollarOutlined />}
                            formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Doanh thu xe máy"
                            value={totalMotorbikeRevenue}
                            prefix={<DollarOutlined />}
                            formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                        />
                    </Card>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={currentRevenues}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' }
                })}
            />

            <RevenueDetailModal
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                parkingLotName={selectedParking?.name || ''}
                date={viewType === 'daily' ? selectedDate.format('DD/MM/YYYY') : selectedMonth.format('MM/YYYY')}
                details={revenueDetails}
            />
        </div>
    );
};

export default RevenueTab; 