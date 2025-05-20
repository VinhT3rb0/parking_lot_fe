import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Typography, Tag, Space, Spin, Divider, Button, Modal, message } from 'antd';
import { useGetAllParkingLotsQuery, ParkingLot } from '../../../api/app_parkinglot/apiParkinglot';
import { useCreateParkingEntryMutation } from '../../../api/app_parking/apiParking';
import { CarOutlined, EnvironmentOutlined, ClockCircleOutlined, DollarOutlined, TagOutlined, CameraOutlined } from '@ant-design/icons';
import './ParkVehicle.css';

const { Title, Text } = Typography;

const ParkVehicleForm: React.FC = () => {
    const { data: parkingLots, isLoading } = useGetAllParkingLotsQuery({});
    const [createParkingEntry] = useCreateParkingEntryMutation();
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const parseVehicleTypes = (vehicleTypesStr: string) => {
        try {
            // Remove brackets and split by comma
            const types = vehicleTypesStr
                .replace(/[\[\]]/g, '') // Remove [ and ]
                .split(',')
                .map(type => type.trim()); // Trim whitespace
            return types;
        } catch (error) {
            console.error('Error parsing vehicle types:', error);
            return [];
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch (error) {
            message.error('Không thể truy cập camera');
            setIsCameraModalOpen(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const captureImage = async () => {
        if (!videoRef.current || !selectedLot) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(videoRef.current, 0, 0);
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
            if (!blob) {
                message.error('Không thể tạo ảnh');
                return;
            }
            console.log(blob);
            const formData = new FormData();
            formData.append('image', blob, 'license-plate.jpg');
            try {
                await createParkingEntry({
                    parkingLotId: selectedLot.id,
                    data: { image: blob }
                }).unwrap();
                message.success('Gửi xe thành công!');
                setIsCameraModalOpen(false);
                stopCamera();
            } catch (error) {
                message.error('Có lỗi xảy ra khi gửi xe');
            }
        }, 'image/jpeg');
    };

    const handleParkClick = (lot: ParkingLot) => {
        setSelectedLot(lot);
        setIsCameraModalOpen(true);
    };

    const handleCameraModalClose = () => {
        setIsCameraModalOpen(false);
        stopCamera();
    };

    useEffect(() => {
        if (isCameraModalOpen) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isCameraModalOpen]);

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="park-vehicle-container">
            <Title level={4} className="page-title">Danh sách bãi đỗ xe</Title>
            <Row gutter={[24, 24]}>
                {parkingLots?.map((lot: ParkingLot) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={lot.id}>
                        <Card
                            hoverable
                            className="parking-lot-card"
                            title={
                                <div className="card-title">
                                    <CarOutlined className="card-icon" />
                                    <span>{lot.name}</span>
                                </div>
                            }
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <div className="info-section">
                                    <div className="info-item">
                                        <EnvironmentOutlined className="info-icon" />
                                        <Text>{lot.address}</Text>
                                    </div>
                                    <div className="info-item">
                                        <ClockCircleOutlined className="info-icon" />
                                        <Text>{lot.operatingHours}</Text>
                                    </div>
                                </div>

                                <Divider className="card-divider" />

                                <div className="capacity-section">
                                    <div className="capacity-info">
                                        <Text className="capacity-label">Sức chứa</Text>
                                        <Text className="capacity-value">{lot.capacity} xe</Text>
                                    </div>
                                    <div className="capacity-info">
                                        <Text className="capacity-label">Còn trống</Text>
                                        <Text className="capacity-value">{lot.availableSlots} chỗ</Text>
                                    </div>
                                </div>

                                <Divider className="card-divider" />

                                <div className="price-section">
                                    <div className="price-item">
                                        <DollarOutlined className="price-icon" />
                                        <div>
                                            <Text className="price-label">Giá theo giờ</Text>
                                            <Text className="price-value">{lot.hourlyRate.toLocaleString()}đ</Text>
                                        </div>
                                    </div>
                                    <div className="price-item">
                                        <DollarOutlined className="price-icon" />
                                        <div>
                                            <Text className="price-label">Giá theo ngày</Text>
                                            <Text className="price-value">{lot.dailyRate.toLocaleString()}đ</Text>
                                        </div>
                                    </div>
                                </div>

                                <Divider className="card-divider" />

                                <div className="tags-section">
                                    <div className="vehicle-types">
                                        <TagOutlined className="tags-icon" />
                                        <div className="tags-container">
                                            {parseVehicleTypes(lot.vehicleTypes).map((type, index) => (
                                                <Tag key={index} color="blue" className="vehicle-tag">
                                                    {type}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="status-tags">
                                        <Tag color={lot.isCovered ? 'green' : 'orange'} className="status-tag">
                                            {lot.isCovered ? 'Có mái che' : 'Không có mái che'}
                                        </Tag>
                                        <Tag color={lot.status === 'ACTIVE' ? 'green' : 'red'} className="status-tag">
                                            {lot.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm ngưng'}
                                        </Tag>
                                    </div>
                                </div>

                                <Button
                                    type="primary"
                                    icon={<CameraOutlined />}
                                    onClick={() => handleParkClick(lot)}
                                    disabled={lot.status !== 'ACTIVE' || lot.availableSlots === 0}
                                    block
                                >
                                    Gửi xe
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                title="Chụp ảnh biển số xe"
                open={isCameraModalOpen}
                onCancel={handleCameraModalClose}
                footer={[
                    <Button key="capture" type="primary" onClick={captureImage}>
                        Chụp ảnh
                    </Button>
                ]}
                width={800}
            >
                <div className="camera-container">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', maxHeight: '500px' }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ParkVehicleForm; 