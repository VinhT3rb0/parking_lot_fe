import React, { useState, useRef, useEffect } from 'react';
import { Card, Typography, Space, Button, Input, message, Modal, Row, Col, Divider, Descriptions } from 'antd';
import { useCreateParkingExitMutation, useGetAllParkingEntriesQuery, useLazyGetSessionByCodeQuery } from '../../../api/app_parking/apiParking';
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
    const [licensePlate, setLicensePlate] = useState<string>('');
    const [createParkingExit] = useCreateParkingExitMutation();
    const [getSessionByCode] = useLazyGetSessionByCodeQuery();
    const { refetch } = useGetAllParkingEntriesQuery();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
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

        if (!licensePlate) {
            message.error("Vui lòng nhập biển số xe");
            return;
        }

        if (!capturedBlob) {
            message.error("Vui lòng chụp ảnh biển số xe");
            return;
        }

        try {
            const response = await getSessionByCode(code).unwrap();

            if (response.licensePlate !== licensePlate) {
                message.error('Mã xe không khớp với biển số xe');
                return;
            }

            setExitDetails(response);
            setIsConfirmModalVisible(true);
        } catch (error) {
            message.error("Không tìm thấy thông tin xe hoặc có lỗi xảy ra");
        }
    };

    const handleConfirmExit = async () => {
        if (!exitDetails || !capturedBlob) return;

        try {
            const formData = new FormData();
            formData.append('image', capturedBlob, 'exit-image.jpg');

            const res = await createParkingExit({
                code,
                licensePlate,
                formData
            });

            if (res.error) {
                message.error("Có lỗi xảy ra khi lấy xe");
            } else {
                message.success("Lấy xe thành công!");
                setExitDetails(res.data);
                setIsConfirmModalVisible(false);
                setIsModalVisible(true);
                setCode('');
                setLicensePlate('');
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

    const handleConfirmModalClose = () => {
        setIsConfirmModalVisible(false);
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
                        <Text strong>Nhập biển số xe:</Text>
                        <Input
                            value={licensePlate}
                            onChange={e => setLicensePlate(e.target.value)}
                            placeholder="Nhập biển số xe"
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
                        Kiểm tra thông tin
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
                title="Xác nhận thông tin lấy xe"
                open={isConfirmModalVisible}
                onOk={handleConfirmExit}
                onCancel={handleConfirmModalClose}
                footer={[
                    <Button key="cancel" onClick={handleConfirmModalClose}>
                        Hủy
                    </Button>,
                    <Button key="confirm" type="primary" onClick={handleConfirmExit}>
                        Xác nhận lấy xe
                    </Button>
                ]}
                width={1000}
            >
                {exitDetails && (
                    <div style={{ padding: '20px 0' }}>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Mã xe" span={1}>
                                {exitDetails.code}
                            </Descriptions.Item>
                            <Descriptions.Item label="Biển số xe" span={1}>
                                {exitDetails.licensePlate}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian vào" span={1}>
                                {formatDateTime(exitDetails.entryTime)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={1}>
                                {exitDetails.status}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Ảnh biển số xe</Divider>

                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Card
                                    title="Lúc vào"
                                    bordered={false}
                                    bodyStyle={{ padding: '12px' }}
                                >
                                    <img
                                        src={exitDetails.licensePlateImageEntry}
                                        alt="Biển số xe lúc vào"
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'contain',
                                            backgroundColor: '#fafafa',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    title="Lúc ra"
                                    bordered={false}
                                    bodyStyle={{ padding: '12px' }}
                                >
                                    {capturedBlob && (
                                        <img
                                            src={URL.createObjectURL(capturedBlob)}
                                            alt="Biển số xe lúc ra"
                                            style={{
                                                width: '100%',
                                                height: '300px',
                                                objectFit: 'contain',
                                                backgroundColor: '#fafafa',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
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
                width={1000}
            >
                {exitDetails && (
                    <div style={{ padding: '20px 0' }}>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Mã xe" span={1}>
                                {exitDetails.code}
                            </Descriptions.Item>
                            <Descriptions.Item label="Biển số xe" span={1}>
                                {exitDetails.licensePlate}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian vào" span={1}>
                                {formatDateTime(exitDetails.entryTime)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian ra" span={1}>
                                {formatDateTime(exitDetails.exitTime)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={1}>
                                {exitDetails.status === 'COMPLETED' ? 'Hoàn thành' : exitDetails.status}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng chi phí" span={1}>
                                {exitDetails.totalCost ? exitDetails.totalCost.toLocaleString('vi-VN') : '-'} VNĐ
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Ảnh biển số xe</Divider>

                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Card
                                    title="Lúc vào"
                                    bordered={false}
                                    bodyStyle={{ padding: '12px' }}
                                >
                                    <img
                                        src={exitDetails.licensePlateImageEntry}
                                        alt="Biển số xe lúc vào"
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'contain',
                                            backgroundColor: '#fafafa',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    title="Lúc ra"
                                    bordered={false}
                                    bodyStyle={{ padding: '12px' }}
                                >
                                    <img
                                        src={exitDetails.licensePlateImageExit}
                                        alt="Biển số xe lúc ra"
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'contain',
                                            backgroundColor: '#fafafa',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default RetrieveVehicleTab; 