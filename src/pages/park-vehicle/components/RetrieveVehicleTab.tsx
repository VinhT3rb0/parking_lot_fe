import React, { useState, useRef, useEffect } from 'react';
import { Card, Typography, Space, Button, Input, message, Modal } from 'antd';
import { useCreateParkingExitMutation, useGetAllParkingEntriesQuery } from '../../../api/app_parking/apiParking';
import { CameraOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ParkingExitDetails {
    id: number;
    lotId: number;
    vehicleId: number;
    licensePlate: string;
    entryTime: string;
    exitTime: string;
    licensePlateImageEntry: string;
    licensePlateImageExit: string;
    status: string;
    totalCost: number;
    code: number;
}

const RetrieveVehicleTab: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [createParkingExit] = useCreateParkingExitMutation();
    const { refetch } = useGetAllParkingEntriesQuery();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [exitDetails, setExitDetails] = useState<ParkingExitDetails | null>(null);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

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

    const captureImage = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(blob => {
            if (blob) {
                setCapturedBlob(blob);
                setIsCameraModalOpen(false);
                stopCamera();
            }
        }, 'image/jpeg');
    };

    const handleCameraModalClose = () => {
        setIsCameraModalOpen(false);
        stopCamera();
    };

    const handleRetrieve = async () => {
        if (!code) {
            message.error("Vui lòng nhập mã xe");
            return;
        }

        if (!capturedBlob) {
            message.error("Vui lòng chụp ảnh biển số xe");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', capturedBlob, 'exit-image.jpg');

            const res = await createParkingExit({ code, formData });
            if (res.error) {
                message.error("Có lỗi xảy ra khi lấy xe");
            } else {
                message.success("Lấy xe thành công!");
                setExitDetails(res.data);
                setIsModalVisible(true);
                setCode('');
                setCapturedBlob(null);
                refetch();
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi lấy xe");
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setExitDetails(null);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    useEffect(() => {
        if (isCameraModalOpen) startCamera();
        return () => stopCamera();
    }, [isCameraModalOpen]);

    return (
        <div className="retrieve-vehicle-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <Card title="Lấy xe">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Nhập mã xe:</Text>
                        <Input
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            placeholder="Nhập mã xe"
                            style={{ marginTop: '8px' }}
                        />
                    </div>
                    <div>
                        <Text strong>Chụp ảnh biển số xe:</Text>
                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Button
                                icon={<CameraOutlined />}
                                onClick={() => setIsCameraModalOpen(true)}
                            >
                                Chụp ảnh
                            </Button>
                            {capturedBlob && (
                                <img
                                    src={URL.createObjectURL(capturedBlob)}
                                    alt="Biển số xe"
                                    style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                                />
                            )}
                        </div>
                    </div>
                    <Button type="primary" onClick={handleRetrieve} block>
                        Lấy xe
                    </Button>
                </Space>
            </Card>

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
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: '100%', maxHeight: '500px' }}
                    />
                </div>
            </Modal>

            <Modal
                title="Thông tin lấy xe"
                open={isModalVisible}
                onOk={handleModalClose}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" type="primary" onClick={handleModalClose}>
                        Đóng
                    </Button>
                ]}
            >
                {exitDetails && (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text><strong>Mã xe:</strong> {exitDetails.code}</Text>
                        <Text><strong>Biển số xe:</strong> {exitDetails.licensePlate}</Text>
                        <Text><strong>Thời gian vào:</strong> {formatDateTime(exitDetails.entryTime)}</Text>
                        <Text><strong>Thời gian ra:</strong> {formatDateTime(exitDetails.exitTime)}</Text>
                        <Text><strong>Trạng thái:</strong> {exitDetails.status}</Text>
                        <Text><strong>Tổng chi phí:</strong> {exitDetails.totalCost.toLocaleString('vi-VN')} VNĐ</Text>
                    </Space>
                )}
            </Modal>
        </div>
    );
};

export default RetrieveVehicleTab; 