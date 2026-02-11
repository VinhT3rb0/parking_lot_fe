import React, { useState } from 'react';
import { Card, Row, Col, Tag, Statistic, Button, Input, Rate, Progress, Skeleton, Empty } from 'antd';
import { useGetAllParkingLotsQuery } from '../../api/app_parkinglot/apiParkinglot';
import PageHeader from '../../components/PageHeader';
import { EnvironmentOutlined, CarOutlined, DollarOutlined, ClockCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const ParkingLots: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: parkingLots, isLoading, isError } = useGetAllParkingLotsQuery({ name: searchTerm });
    const navigate = useNavigate();

    const getRandomImage = (id: number) => `https://picsum.photos/seed/parking${id}/400/250`;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="font-sans bg-gray-50 min-h-screen pb-20">
            <PageHeader
                title="Danh Sách Bãi Đỗ Xe"
                breadcrumbs={[{ name: "Trang chủ", path: "/" }, { name: "Bãi đỗ xe", path: "/parking-lots" }]}
            />

            <div className="container mx-auto px-4 md:px-8 mt-[-30px] relative z-10">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Tìm kiếm bãi đỗ xe..."
                        size="large"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                    />
                </div>

                {isLoading ? (
                    <Row gutter={[24, 24]}>
                        {[1, 2, 3, 4].map(i => (
                            <Col xs={24} sm={12} lg={8} xl={6} key={i}>
                                <Card loading cover={<Skeleton.Image active className="w-full h-48" />}>
                                    <Skeleton active paragraph={{ rows: 3 }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : isError ? (
                    <div className="text-center py-12">
                        <p className="text-red-500">Có lỗi xảy ra khi tải danh sách bãi đỗ xe.</p>
                        <Button onClick={() => window.location.reload()}>Thử lại</Button>
                    </div>
                ) : parkingLots && parkingLots.length > 0 ? (
                    <Row gutter={[24, 24]}>
                        {parkingLots.map((lot: any) => (
                            <Col xs={24} sm={12} lg={8} xl={6} key={lot.id}>
                                <Card
                                    hoverable
                                    className="h-full flex flex-col overflow-hidden rounded-xl shadow-md border-0 transition-transform hover:-translate-y-1"
                                    cover={
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                alt={lot.name}
                                                src={getRandomImage(lot.id)}
                                                className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <Tag color={lot.status === 'ACTIVE' ? 'success' : 'error'} className="m-0 font-bold px-3 py-1 rounded-full shadow-sm">
                                                    {lot.status === 'ACTIVE' ? 'Hoạt động' : 'Bảo trì'}
                                                </Tag>
                                            </div>
                                            {lot.isCovered && (
                                                <div className="absolute top-3 left-3">
                                                    <Tag color="blue" className="m-0 font-bold px-3 py-1 rounded-full shadow-sm bg-blue-500 text-white border-0">
                                                        Có mái che
                                                    </Tag>
                                                </div>
                                            )}
                                        </div>
                                    }
                                    actions={[
                                        <Button type="link" icon={<EnvironmentOutlined />} onClick={() => window.open(`https://maps.google.com/?q=${lot.address}`)}>Bản đồ</Button>,
                                        <Button type="primary" ghost onClick={() => navigate(`/parking-lots/${lot.id}`)}>Chi tiết</Button>
                                    ]}
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={lot.name}>{lot.name}</h3>
                                        </div>

                                        <div className="flex items-start gap-2 text-gray-500 text-sm h-10">
                                            <EnvironmentOutlined className="mt-1 text-orange-500 shrink-0" />
                                            <span className="line-clamp-2">{lot.address}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400">Giờ</span>
                                                <span className="font-bold text-green-600">{formatCurrency(lot.hourlyRate)}</span>
                                            </div>
                                            <div className="flex flex-col border-l pl-3">
                                                <span className="text-xs text-gray-400">Ngày</span>
                                                <span className="font-bold text-blue-600">{formatCurrency(lot.dailyRate)}</span>
                                            </div>
                                        </div>

                                        <div className="mt-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">Chỗ trống</span>
                                                <span className="font-bold text-slate-700">{lot.availableSpots} / {lot.capacity}</span>
                                            </div>
                                            <Progress
                                                percent={Math.round(((lot.capacity - lot.availableSpots) / lot.capacity) * 100)}
                                                status={lot.availableSpots === 0 ? "exception" : "active"}
                                                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                                                showInfo={false}
                                                size="small"
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {lot.vehicleTypes.split(',').map((type: string) => (
                                                <Tag key={type} icon={<CarOutlined />} className="text-xs bg-gray-100 border-gray-200">
                                                    {type.trim()}
                                                </Tag>
                                            ))}
                                            <Tag icon={<ClockCircleOutlined />} className="text-xs bg-gray-100 border-gray-200">
                                                {lot.operatingHours}
                                            </Tag>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty description="Không tìm thấy bãi đỗ xe nào" />
                )}
            </div>
        </div>
    );
};

export default ParkingLots;
