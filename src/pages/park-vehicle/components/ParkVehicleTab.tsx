import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Typography, Tag, Space, Spin, Divider, Button, Modal, message, Input, Select } from 'antd';
import { useGetAllParkingLotsQuery, ParkingLot } from '../../../api/app_parkinglot/apiParkinglot';
import { useCreateParkingEntryMutation, useGetAllParkingEntriesQuery, useRecognizeLicensePlateMutation, useCreateMemberParkingEntryMutation } from '../../../api/app_parking/apiParking';
import { useLazyGetMemberByCodeQuery } from '../../../api/app_member/apiMember';
import { CarOutlined, EnvironmentOutlined, ClockCircleOutlined, DollarOutlined, TagOutlined, CameraOutlined } from '@ant-design/icons';
import './ParkVehicle.css';

import jsQR from 'jsqr';

const { Text } = Typography;

const ParkVehicleTab: React.FC = () => {
    const { data: parkingLots, isLoading, refetch } = useGetAllParkingLotsQuery({});
    const [createParkingEntry] = useCreateParkingEntryMutation();
    const [createMemberParkingEntry] = useCreateMemberParkingEntryMutation();
    const [recognizeLicensePlate] = useRecognizeLicensePlateMutation();
    const [getMemberByCode] = useLazyGetMemberByCodeQuery();
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [correctedPlate, setCorrectedPlate] = useState<string>('');
    const [selectedVehicleType, setSelectedVehicleType] = useState<string>('');
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [parkingCode, setParkingCode] = useState<number | null>(null);
    const [scannedMemberCode, setScannedMemberCode] = useState<string | null>(null);
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

    const scanningRef = useRef<boolean>(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                scanningRef.current = true;
                requestAnimationFrame(scanQRCode);
            }
        } catch {
            message.error('Không thể truy cập camera');
            setIsCameraModalOpen(false);
        }
    };

    const scanQRCode = () => {
        if (!scanningRef.current || !videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
            if (scanningRef.current) requestAnimationFrame(scanQRCode);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code && !scannedMemberCode) {
                console.log("QR Code detected (Real-time):", code.data);
                scanningRef.current = false;

                getMemberByCode(code.data).unwrap()
                    .then(memberRes => {
                        const memberData = memberRes.data;
                        message.success(`Đã nhận diện TV ${memberData.fullname || ''}. Vui lòng hướng camera chụp biển số xe.`);
                        setScannedMemberCode(code.data);
                        if (memberData && memberData.vehicles && memberData.vehicles.length > 0) {
                            setCorrectedPlate(memberData.vehicles[0].licensePlate);
                            setSelectedVehicleType(memberData.vehicles[0].vehicleType);
                        }
                    })
                    .catch(err => {
                        message.error('Không tìm thấy thông tin thành viên từ mã QR này');
                        scanningRef.current = true;
                        requestAnimationFrame(scanQRCode);
                    });

                return;
            }
        }
        requestAnimationFrame(scanQRCode);
    };

    const stopCamera = () => {
        scanningRef.current = false;
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    };

    const captureImage = async () => {
        if (!videoRef.current || !selectedLot) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Nếu đã quét QR thành công ở bước trước, thao tác này là chụp ảnh BIỂN SỐ
        if (scannedMemberCode) {
            canvas.toBlob(async blob => {
                if (blob) {
                    setCapturedBlob(blob);
                    stopCamera();
                    setIsCameraModalOpen(false);

                    const formData = new FormData();
                    formData.append('image', blob, 'plate.jpg');
                    message.loading({ content: 'Đang trích xuất ảnh và nhận diện biển số...', key: 'recognize' });

                    try {
                        let recognizedPlate = '';
                        try {
                            const recognitionResult = await recognizeLicensePlate(formData).unwrap();
                            if (recognitionResult && recognitionResult.plate && recognitionResult.plate.trim() !== '') {
                                recognizedPlate = recognitionResult.plate.trim();
                            }
                        } catch (e) {
                            console.error('Lỗi nhận diện:', e);
                        }

                        const memberRes = await getMemberByCode(scannedMemberCode).unwrap();
                        const memberData = memberRes.data;

                        if (memberData && memberData.vehicles && memberData.vehicles.length > 0) {
                            if (recognizedPlate) {
                                const cleanPlate = (p: string) => p.replace(/[-.\s_]/g, '').toUpperCase();
                                const recognizedClean = cleanPlate(recognizedPlate);

                                const matchedVehicle = memberData.vehicles.find(
                                    (v: any) => cleanPlate(v.licensePlate) === recognizedClean
                                );

                                if (matchedVehicle) {
                                    setCorrectedPlate(matchedVehicle.licensePlate);
                                    setSelectedVehicleType(matchedVehicle.vehicleType);
                                    message.success({ content: `Nhận diện thành công biển số: ${matchedVehicle.licensePlate}`, key: 'recognize' });
                                } else {
                                    setCorrectedPlate(recognizedPlate);
                                    message.warning({ content: `Không tìm thấy xe ${recognizedPlate} trong danh sách của thành viên. Vui lòng kiểm tra lại.`, key: 'recognize' });
                                }
                            } else {
                                setCorrectedPlate(memberData.vehicles[0].licensePlate);
                                setSelectedVehicleType(memberData.vehicles[0].vehicleType);
                                message.warning({ content: 'Không nhận diện được rõ biển số. Đã lấy xe mặc định.', key: 'recognize' });
                            }
                        } else {
                            if (recognizedPlate) setCorrectedPlate(recognizedPlate);
                            message.success({ content: 'Hoàn tất quá trình lấy thông tin', key: 'recognize' });
                        }
                    } catch (err) {
                        message.error({ content: 'Có lỗi xảy ra khi tải dữ liệu', key: 'recognize' });
                    }

                    setIsConfirmModalOpen(true);
                }
            }, 'image/jpeg', 0.8);
            return;
        }

        const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
        });

        // Nếu lúc nhấn chụp vô tình trúng QR (fallback)
        if (qrCode) {
            console.log("QR Code detected at capture:", qrCode.data);

            try {
                const memberRes = await getMemberByCode(qrCode.data).unwrap();
                const memberData = memberRes.data;
                message.success(`Đã nhận diện TV ${memberData.fullname || ''}. Vui lòng hướng camera chụp biển số xe.`);
                setScannedMemberCode(qrCode.data);
                if (memberData && memberData.vehicles && memberData.vehicles.length > 0) {
                    setCorrectedPlate(memberData.vehicles[0].licensePlate);
                    setSelectedVehicleType(memberData.vehicles[0].vehicleType);
                }
            } catch (err) {
                message.error('Không tìm thấy thông tin thành viên từ mã QR này');
            }
            return;
        }

        // Luồng thông thường: ảnh biển số tự do (chưa có member) quét AI
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
                        startCamera();
                    }
                } catch (error) {
                    message.error('Không thể nhận diện biển số xe. Vui lòng thử lại.');
                    setIsCameraModalOpen(true);
                    startCamera();
                }
                stopCamera();
            }
        }, 'image/jpeg', 0.8);
    };

    const handleConfirm = async () => {
        if (!selectedLot || !correctedPlate || !selectedVehicleType || !capturedBlob) {
            message.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const form = new FormData();
        form.append("image", capturedBlob, "plate.jpg");

        try {
            let res;
            // Member checkin
            if (scannedMemberCode) {
                const payload = {
                    lotId: selectedLot.id,
                    licensePlate: correctedPlate,
                    vehicleType: selectedVehicleType,
                    memberCode: scannedMemberCode
                };
                const jsonBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
                form.append("data", jsonBlob);

                res = await createMemberParkingEntry(form);
            } else {
                // Normal checkin
                const code = generateUniqueCode();
                const payload = {
                    lotId: selectedLot.id,
                    licensePlate: correctedPlate,
                    code: code,
                    vehicleType: selectedVehicleType,
                };
                const jsonBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
                form.append("data", jsonBlob);

                res = await createParkingEntry(form);
            }

            if ('error' in res) {
                const apiError = res.error as { data?: { message?: string } };
                if (apiError.data && apiError.data.message === "An unexpected error occurred: Xe đã có phiên gửi xe đang hoạt động") {
                    message.error("Xe đã có phiên gửi xe đang hoạt động");
                } else {
                    message.error(apiError.data?.message || "Có lỗi xảy ra khi gửi xe");
                }
            } else {
                message.success("Gửi xe thành công!");
                setIsConfirmModalOpen(false);
                if (!scannedMemberCode) {
                    setParkingCode(res.data.code);
                    setIsSuccessModalOpen(true);
                } else {
                    // Của member thì không cần quan tâm mã code thẻ
                }
                setCorrectedPlate("");
                setSelectedVehicleType("");
                setCapturedBlob(null);
                setScannedMemberCode(null);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi gửi xe");
        }
    };

    const handleParkClick = (lot: ParkingLot) => {
        setSelectedLot(lot);
        setCorrectedPlate('');
        setSelectedVehicleType('');
        setScannedMemberCode(null);
        setIsCameraModalOpen(true);
    };

    const handleCameraModalClose = () => {
        setIsCameraModalOpen(false);
        stopCamera();
        setScannedMemberCode(null);
    };

    useEffect(() => {
        if (isCameraModalOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isCameraModalOpen]);

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!parkingLots || parkingLots.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                <Text>Không có bãi đỗ xe nào khả dụng.</Text>
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