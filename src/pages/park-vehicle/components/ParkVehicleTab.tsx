import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Typography, Tag, Space, Spin, Divider, Button, Modal, message, Input, Select } from 'antd';
import { useGetAllParkingLotsQuery, ParkingLot } from '../../../api/app_parkinglot/apiParkinglot';
import { useCreateParkingEntryMutation, useGetAllParkingEntriesQuery, useRecognizeLicensePlateMutation } from '../../../api/app_parking/apiParking';
import { CarOutlined, EnvironmentOutlined, ClockCircleOutlined, DollarOutlined, TagOutlined, CameraOutlined } from '@ant-design/icons';
import './ParkVehicle.css';

const { Text } = Typography;

const ParkVehicleTab: React.FC = () => {
    const { data: parkingLots, isLoading, refetch } = useGetAllParkingLotsQuery({});
    const [createParkingEntry] = useCreateParkingEntryMutation();
    const [recognizeLicensePlate] = useRecognizeLicensePlateMutation();
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [correctedPlate, setCorrectedPlate] = useState<string>('');
    const [selectedVehicleType, setSelectedVehicleType] = useState<string>('');
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [parkingCode, setParkingCode] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { data: entries } = useGetAllParkingEntriesQuery();

    const parseVehicleTypes = (vehicleTypesStr: string) => {
        try {
            return vehicleTypesStr.replace(/[[\]]/g, '').split(',').map(type => type.trim());
        } catch {
            return [];
        }
    };

    const generateUniqueCode = () => {
        const existingCodes = entries?.map(e => e.code) || [];
        let code: number;
        do {
            code = Math.floor(100 + Math.random() * 900);
        } while (existingCodes.includes(code));
        return code;
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
        } catch {
            message.error('Không thể truy cập camera');
            setIsCameraModalOpen(false);
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    };

    const captureImage = async () => {
        if (!videoRef.current || !selectedLot) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(async blob => {
            if (blob) {
                setCapturedBlob(blob);
                setIsCameraModalOpen(false);
                const formData = new FormData();
                formData.append('image', blob, 'plate.jpg');

                try {
                    const recognitionResult = await recognizeLicensePlate(formData).unwrap();
                    if (recognitionResult && recognitionResult.plate && recognitionResult.plate.trim() !== '') {
                        setCorrectedPlate(recognitionResult.plate.trim());
                        setIsConfirmModalOpen(true);
                    } else {
                        message.error('Không thể nhận diện biển số xe. Vui lòng thử lại.');
                        setIsCameraModalOpen(true);
                    }
                } catch (error) {
                    message.error('Không thể nhận diện biển số xe. Vui lòng thử lại.');
                    setIsCameraModalOpen(true);
                }
                stopCamera();
            }
        }, 'image/jpeg');
    };

    const handleConfirm = async () => {
        if (!selectedLot || !correctedPlate || !selectedVehicleType || !capturedBlob) {
            message.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
        const code = generateUniqueCode();
        const payload = {
            lotId: selectedLot.id,
            licensePlate: correctedPlate,
            code: code,
            vehicleType: selectedVehicleType,
        }
        const form = new FormData();
        const jsonBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        form.append("data", jsonBlob);
        form.append("image", capturedBlob, "plate.jpg");

        try {
            const res = await createParkingEntry(form);
            if ('error' in res) {
                const apiError = res.error as { data?: { message?: string } };
                if (apiError.data && apiError.data.message === "An unexpected error occurred: Xe đã có phiên gửi xe đang hoạt động") {
                    message.error("Xe đã có phiên gửi xe đang hoạt động");
                } else {
                    message.error("Có lỗi xảy ra khi gửi xe");
                }
            } else {
                message.success("Gửi xe thành công!");
                setIsConfirmModalOpen(false);
                setParkingCode(res.data.code);
                setIsSuccessModalOpen(true);
                setCorrectedPlate("");
                setSelectedVehicleType("");
                setCapturedBlob(null);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi gửi xe");
        }
    };

    const handleParkClick = (lot: ParkingLot) => {
        setSelectedLot(lot);
        setCorrectedPlate('');
        setSelectedVehicleType('');
        setIsCameraModalOpen(true);
    };

    const handleCameraModalClose = () => {
        setIsCameraModalOpen(false);
        stopCamera();
    };

    useEffect(() => {
        if (isCameraModalOpen) startCamera();
        return () => stopCamera();
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

            <Modal
                title="Xác nhận thông tin xe"
                open={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                onOk={handleConfirm}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Biển số xe:</Text>
                        <Input value={correctedPlate} onChange={e => setCorrectedPlate(e.target.value)} placeholder="Nhập biển số xe" />
                    </div>
                    <div>
                        <Text strong>Loại xe:</Text>
                        <Select
                            style={{ width: '100%' }}
                            value={selectedVehicleType}
                            onChange={setSelectedVehicleType}
                            placeholder="Chọn loại xe"
                        >
                            {selectedLot && parseVehicleTypes(selectedLot.vehicleTypes).map((type, idx) => (
                                <Select.Option key={idx} value={type}>{type}</Select.Option>
                            ))}
                        </Select>
                    </div>
                </Space>
            </Modal>

            <Modal
                title="Gửi xe thành công"
                open={isSuccessModalOpen}
                onOk={() => setIsSuccessModalOpen(false)}
                onCancel={() => setIsSuccessModalOpen(false)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setIsSuccessModalOpen(false)}>
                        Đóng
                    </Button>
                ]}
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <Text strong style={{ fontSize: '16px' }}>Mã xe của bạn là:</Text>
                    </div>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: '#1890ff',
                        background: '#f0f5ff',
                        padding: '16px 32px',
                        borderRadius: '8px',
                        display: 'inline-block'
                    }}>
                        {parkingCode}
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <Text type="secondary">Vui lòng lưu lại mã này để lấy xe sau</Text>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ParkVehicleTab; 