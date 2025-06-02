import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag,
    DatePicker,
    Radio,
    Select,
    Typography,
    Spin
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    DollarOutlined,
    BarChartOutlined,
    PieChartOutlined,
    CarOutlined,
    ClockCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetRevenueQuery } from '../../../api/app_revenue/apiRevenue';
import RevenueDetailModal from './RevenueDetailModal';
import { ParkingLot } from '../../../api/app_parkinglot/apiParkinglot';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface RevenueTabProps {
    parkingLots: ParkingLot[];
    isLoading: boolean;
}

interface RevenueRecord {
    id: number;
    parkingLotId: number;
    parkingLotName: string;
    date: string;
    totalSessions: number;
    totalRevenue: number;
    averageDurationMinutes: number;
    details: {
        time: string;
        vehicleType: 'car' | 'motorbike';
        licensePlate: string;
        amount: number;
        duration: string;
    }[];
}

interface ParkingLotRevenue {
    id: number;
    name: string;
    totalRevenue: number;
    sessions: number;
    averageDuration: number;
    capacity: number;
    availableSlots: number;
    status: string;
    details: {
        time: string;
        vehicleType: 'car' | 'motorbike';
        licensePlate: string;
        amount: number;
        duration: string;
    }[];
}

const RevenueTab: React.FC<RevenueTabProps> = ({ parkingLots, isLoading: isLoadingParkingLots }) => {
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);
    const [selectedParkingLot, setSelectedParkingLot] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParking, setSelectedParking] = useState<ParkingLotRevenue | null>(null);
    const [parkingLotRevenues, setParkingLotRevenues] = useState<ParkingLotRevenue[]>([]);
    const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
    const [vehicleTypeData, setVehicleTypeData] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [revenueDetails, setRevenueDetails] = useState<RevenueRecord[]>([]);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    const { data: revenueResponse, isLoading: isLoadingRevenue, isError } = useGetRevenueQuery({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        ...(selectedParkingLot && { parkingLotId: selectedParkingLot })
    });

    useEffect(() => {
        if (revenueResponse && parkingLots.length > 0) {
            const combinedRevenues = parkingLots.map(lot => {
                const revenueData = Array.isArray(revenueResponse)
                    ? revenueResponse.filter(r => r.parkingLotId === lot.id)
                    : [];
                const totalRevenue = revenueData.reduce((sum, r) => sum + r.totalRevenue, 0);
                const totalSessions = revenueData.reduce((sum, r) => sum + r.totalSessions, 0);
                const totalDuration = revenueData.reduce((sum, r) => sum + r.averageDurationMinutes, 0);
                const averageDuration = revenueData.length > 0 ? totalDuration / revenueData.length : 0;

                const allDetails = revenueData.flatMap(r => {
                    const date = r.date;
                    return (r.details || []).map(detail => ({
                        ...detail,
                        time: `${date} ${detail.time}`
                    }));
                });

                return {
                    id: lot.id,
                    name: lot.name,
                    totalRevenue,
                    sessions: totalSessions,
                    averageDuration: Math.round(averageDuration),
                    capacity: lot.capacity,
                    availableSlots: lot.availableSlots,
                    status: lot.status,
                    details: allDetails
                };
            });

            setParkingLotRevenues(combinedRevenues);
            const chartData = combinedRevenues.map(lot => ({
                name: lot.name,
                revenue: lot.totalRevenue,
                sessions: lot.sessions
            }));
            setRevenueChartData(chartData);

            // Tính toán số lượt gửi theo loại xe (70% ô tô, 30% xe máy)
            const vehicleTypes = [
                { type: 'Ô tô', value: combinedRevenues.reduce((sum, lot) => sum + Math.round(lot.sessions * 0.7), 0) },
                { type: 'Xe máy', value: combinedRevenues.reduce((sum, lot) => sum + Math.round(lot.sessions * 0.3), 0) }
            ];
            setVehicleTypeData(vehicleTypes);
        }
    }, [revenueResponse, parkingLots]);

    const columns: ColumnsType<ParkingLotRevenue> = [
        {
            title: 'Tên bãi đỗ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'ACTIVE' ? 'green' : 'orange'}>
                    {status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'}
                </Tag>
            ),
        },
        {
            title: 'Sức chứa',
            dataIndex: 'capacity',
            key: 'capacity',
            render: (capacity, record) => (
                <div>
                    <div>Tổng: {capacity}</div>
                    <div className={record.availableSlots < 10 ? 'text-red-500' : 'text-green-500'}>
                        Còn trống: {record.availableSlots}
                    </div>
                </div>
            ),
        },
        {
            title: 'Tổng doanh thu',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`,
            sorter: (a, b) => a.totalRevenue - b.totalRevenue,
        },
        {
            title: 'Số lượt gửi',
            dataIndex: 'sessions',
            key: 'sessions',
            sorter: (a, b) => a.sessions - b.sessions,
        },
        {
            title: 'Thời gian TB',
            dataIndex: 'averageDuration',
            key: 'averageDuration',
            render: (value) => `${value} phút`,
            sorter: (a, b) => a.averageDuration - b.averageDuration,
        },
        {
            title: 'Chi tiết',
            key: 'action',
            render: (_, record) => (
                <a onClick={() => handleViewDetails(record.id, record.name)}>Xem chi tiết</a>
            ),
        }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-md">
                    <p className="font-medium">{label}</p>
                    <p className="text-blue-500">
                        {payload[0].value.toLocaleString('vi-VN')} VNĐ
                    </p>
                </div>
            );
        }
        return null;
    };

    const handleDateRangeChange = (dates: any) => {
        if (dates) {
            setDateRange([dates[0], dates[1]]);
        }
    };

    const handleViewDetails = (parkingLotId: number, parkingLotName: string) => {
        const selectedRevenues = revenueResponse?.filter(r => r.parkingLotId === parkingLotId) || [];
        if (selectedRevenues.length > 0) {
            setSelectedParkingLot(parkingLotId);
            setSelectedDate(selectedRevenues[0].date);
            setRevenueDetails(selectedRevenues);
            setDetailModalVisible(true);
        }
    };

    const totalRevenue = parkingLotRevenues.reduce((sum, lot) => sum + lot.totalRevenue, 0);
    const totalSessions = parkingLotRevenues.reduce((sum, lot) => sum + lot.sessions, 0);

    if (isError) return <div>Đã xảy ra lỗi khi tải dữ liệu</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <Title level={3} className="!mb-0">Quản lý Doanh thu</Title>
                <div className="flex items-center gap-4">
                    <RangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        format="DD/MM/YYYY"
                        className="w-80"
                    />
                </div>
            </div>

            <Spin spinning={isLoadingParkingLots || isLoadingRevenue}>
                <Row gutter={[16, 16]} className="mb-6">
                    <Col span={8}>
                        <Card className="h-full shadow-md">
                            <Statistic
                                title="Tổng doanh thu"
                                value={totalRevenue}
                                prefix={<DollarOutlined />}
                                formatter={(value) => `${Number(value).toLocaleString('vi-VN')} VNĐ`}
                                valueStyle={{ color: '#3f8600', fontSize: '24px' }}
                            />
                            <div className="mt-4">
                                <Text type="secondary">Trung bình mỗi lượt:</Text>
                                <Text strong className="block text-lg">
                                    {totalRevenue > 0 ? (totalRevenue / totalSessions).toLocaleString('vi-VN') : 0} VNĐ
                                </Text>
                            </div>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card className="h-full shadow-md">
                            <Statistic
                                title="Tổng lượt gửi xe"
                                value={totalSessions}
                                prefix={<CarOutlined />}
                                valueStyle={{ fontSize: '24px' }}
                            />
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <Text type="secondary">Ô tô:</Text>
                                    <Text strong className="block">{(totalSessions * 0.7).toFixed(0)}</Text>
                                </div>
                                <div>
                                    <Text type="secondary">Xe máy:</Text>
                                    <Text strong className="block">{(totalSessions * 0.3).toFixed(0)}</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card className="h-full shadow-md">
                            <div className="flex items-center h-full">
                                <PieChartOutlined className="text-3xl mr-4 text-blue-500" />
                                <div>
                                    <Text type="secondary">Thời gian gửi trung bình</Text>
                                    <Title level={3} className="!mt-1 !mb-0">
                                        {parkingLotRevenues.length > 0
                                            ? (parkingLotRevenues.reduce((sum, lot) => sum + lot.averageDuration, 0) / parkingLotRevenues.length).toFixed(0)
                                            : 0} phút
                                    </Title>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mb-6">
                    <Col span={12}>
                        <Card
                            title="Doanh thu theo bãi xe"
                            className="shadow-md"
                            extra={<BarChartOutlined className="text-blue-500" />}
                        >
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart
                                        data={revenueChartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="revenue" name="Doanh thu" fill="#1890ff" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title="Phân loại phương tiện"
                            className="shadow-md"
                            extra={<PieChartOutlined className="text-blue-500" />}
                        >
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={vehicleTypeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="type"
                                        >
                                            {vehicleTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} lượt`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card
                    title="Chi tiết doanh thu"
                    className="shadow-md"
                    extra={<Text strong>
                        {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
                    </Text>}
                >
                    <Table
                        columns={columns}
                        dataSource={parkingLotRevenues}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
                </Card>
            </Spin>

            <RevenueDetailModal
                visible={detailModalVisible}
                onClose={() => {
                    setDetailModalVisible(false);
                    setSelectedParkingLot(null);
                }}
                parkingLotName={selectedParking?.name || ''}
                date={selectedDate || ''}
                details={revenueDetails}
            />
        </div>
    );
};

export default RevenueTab;