import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Descriptions, Tag, Card, Row, Col, Button, } from 'antd';
import { ClockCircleOutlined, DollarCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useGetParkingLotByIdQuery } from '../../api/app_parkinglot/apiParkinglot';
import { ParkingLot } from '../../api/app_parkinglot/apiParkinglot';


const ParkingLotDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: parkingLotData, isLoading, isError } = useGetParkingLotByIdQuery(Number(id), {
        skip: !id
    });

    const [bgImage, setBgImage] = useState<string>("");

    useEffect(() => {
        const randomImageId = Math.floor(Math.random() * 1000);
        setBgImage(`https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1920&random=${randomImageId}`);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[600px]">
                <Spin size="large" tip="Đang tải thông tin bãi đỗ xe..." />
            </div>
        );
    }

    if (isError || !parkingLotData) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[500px] gap-4">
                <p className="text-red-500 text-lg">Không thể tải thông tin bãi đỗ xe hoặc bãi đỗ xe không tồn tại.</p>
                <Button type="primary" onClick={() => navigate('/')}>Quay lại trang chủ</Button>
            </div>
        );
    }
    const parkingLot = parkingLotData as ParkingLot;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero/Cover Section */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${bgImage}')` }}
                >
                    <div className="absolute inset-0 bg-slate-900/60 transition-colors" />
                </div>
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
                    <Tag color={parkingLot.status === 'ACTIVE' ? 'green' : 'red'} className="w-fit mb-4 px-3 py-1 text-sm font-bold border-none">
                        {parkingLot.status === 'ACTIVE' ? 'ĐANG HOẠT ĐỘNG' : 'NGỪNG HOẠT ĐỘNG'}
                    </Tag>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{parkingLot.name}</h1>
                    <div className="flex items-center text-gray-200 gap-2 text-lg">
                        <EnvironmentOutlined />
                        <span>{parkingLot.address}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card title="Thông Tin Chi Tiết" bordered={false} className="shadow-md rounded-xl mb-6">
                            <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} bordered size="middle">
                                <Descriptions.Item label="Sức chứa">{parkingLot.capacity} xe</Descriptions.Item>
                                <Descriptions.Item label="Chỗ trống hiện tại">
                                    <span className="text-green-600 font-bold">{parkingLot.availableSlots}</span>
                                </Descriptions.Item>
                                <Descriptions.Item label="Giờ hoạt động">{parkingLot.operatingHours}</Descriptions.Item>
                                <Descriptions.Item label="Loại xe">{parkingLot.vehicleTypes}</Descriptions.Item>
                                <Descriptions.Item label="Mái che">
                                    {parkingLot.isCovered ? <Tag color="blue">Có mái che</Tag> : <Tag color="orange">Ngoài trời</Tag>}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card title="Mô Tả" bordered={false} className="shadow-md rounded-xl">
                            <p className="text-gray-600 leading-relaxed">
                                Bãi đỗ xe {parkingLot.name} tọa lạc tại {parkingLot.address}, cung cấp dịch vụ trông giữ xe chuyên nghiệp với hệ thống an ninh giám sát 24/7.
                                {parkingLot.isCovered ? " Khu vực đỗ xe có mái che giúp bảo vệ phương tiện của bạn khỏi thời tiết." : ""}
                                {" "}Đội ngũ nhân viên chuyên nghiệp luôn sẵn sàng hỗ trợ.
                            </p>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title="Bảng Giá Dịch Vụ" bordered={false} className="shadow-md rounded-xl sticky top-24">
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                            <ClockCircleOutlined />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-0">Theo Giờ</p>
                                            <p className="font-bold text-slate-800">Giá vé lượt</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold text-orange-500">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parkingLot.hourlyRate)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                                            <DollarCircleOutlined />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-0">Theo Ngày</p>
                                            <p className="font-bold text-slate-800">Giá vé ngày</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold text-orange-500">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parkingLot.dailyRate)}
                                    </span>
                                </div>

                                <Button type="primary" size="large" block className="h-12 text-lg font-bold bg-slate-900 hover:bg-slate-800 mt-2">
                                    Đặt Chỗ Ngay
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ParkingLotDetail;
