import React, { useState, useRef, useEffect } from 'react';
import { Card, Typography, Space, Button, Input, message, Modal, Row, Col, Divider, Descriptions, Radio } from 'antd';
import { useCreateParkingExitMutation, useGetAllParkingEntriesQuery, useLazyGetSessionByCodeQuery, useRecognizeLicensePlateMutation, useCreateMemberParkingExitMutation, useLazyGetSessionByLicensePlateQuery, useLazyCalculatePaymentQuery } from '../../../api/app_parking/apiParking';
import { useLazyGetMemberByCodeQuery } from '../../../api/app_member/apiMember';
import { CameraOutlined } from '@ant-design/icons';
import jsQR from 'jsqr';

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
    memberCode?: string;
}

const RetrieveVehicleTab: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [licensePlate, setLicensePlate] = useState<string>('');
    const [createParkingExit] = useCreateParkingExitMutation();
    const [createMemberParkingExit] = useCreateMemberParkingExitMutation();
    const [getSessionByCode] = useLazyGetSessionByCodeQuery();
    const [getSessionByLicensePlate] = useLazyGetSessionByLicensePlateQuery();
    const [recognizeLicensePlate] = useRecognizeLicensePlateMutation();
    const [getMemberByCode] = useLazyGetMemberByCodeQuery();
    const { refetch } = useGetAllParkingEntriesQuery();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [exitDetails, setExitDetails] = useState<ParkingExitDetails | null>(null);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

    const [calculatePayment] = useLazyCalculatePaymentQuery();
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOMO'>('CASH');
    const [isPaymentPending, setIsPaymentPending] = useState(false);

    // Member QR checkout states
    const [scannedMemberCode, setScannedMemberCode] = useState<string | null>(null);
    const [scannedVehicleType, setScannedVehicleType] = useState<string | null>(null);
    const [scannedLotId, setScannedLotId] = useState<number | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
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
            const qrcode = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (qrcode && !scannedMemberCode) {
                console.log("QR Code detected (Real-time Checkout):", qrcode.data);
                scanningRef.current = false;

                getMemberByCode(qrcode.data).unwrap()
                    .then(memberRes => {
                        const memberData = memberRes.data;
                        message.success(`Đã nhận diện TV ${memberData.fullname || ''}. Vui lòng hướng camera chụp biển số xe.`);
                        setScannedMemberCode(qrcode.data);
                        if (memberData && memberData.vehicles && memberData.vehicles.length > 0) {
                            setLicensePlate(memberData.vehicles[0].licensePlate);
                            setScannedVehicleType(memberData.vehicles[0].vehicleType);
                            setScannedLotId(memberData.parkingLotId);
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
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Nếu đã có thông tin quét từ mã QR
        if (scannedMemberCode) {
            canvas.toBlob(async blob => {
                if (blob) {
                    setCapturedBlob(blob);
                    stopCamera();
                    setIsCameraModalOpen(false);

                    let currentPlate = licensePlate;
                    const formData = new FormData();
                    formData.append('image', blob, 'plate.jpg');

                    try {
                        const recognitionResult = await recognizeLicensePlate(formData).unwrap();
                        if (recognitionResult && recognitionResult.plate && recognitionResult.plate.trim() !== '') {
                            currentPlate = recognitionResult.plate.trim();
                            setLicensePlate(currentPlate);
                        } else {
                            message.error('Không thể nhận diện biển số xe từ ảnh. Đang dùng biển mặc định của thành viên.');
                        }
                    } catch (error) {
                        message.error('Không thể nhận diện biển số xe từ ảnh. Đang dùng biển mặc định của thành viên.');
                    }

                    try {
                        const sessionRes: any = await getSessionByLicensePlate(currentPlate).unwrap();
                        let activeSession = null;

                        if (Array.isArray(sessionRes)) {
                            activeSession = sessionRes.find((s: any) => s.status === 'ACTIVE') || sessionRes[0];
                        } else if (sessionRes && sessionRes.data) {
                            if (Array.isArray(sessionRes.data)) {
                                activeSession = sessionRes.data.find((s: any) => s.status === 'ACTIVE') || sessionRes.data[0];
                            } else {
                                activeSession = sessionRes.data;
                            }
                        } else {
                            activeSession = sessionRes;
                        }

                        if (!activeSession) {
                            throw new Error("Không tìm thấy phiên gửi xe hợp lệ.");
                        }

                        try {
                            const paymentRes = await calculatePayment({ code: activeSession.code.toString(), paymentMethod: 'CASH' }).unwrap();
                            activeSession.totalCost = paymentRes?.data?.amount ?? paymentRes?.amount ?? activeSession.totalCost;
                        } catch (e) {
                            console.error(e);
                        }

                        setExitDetails(activeSession);
                        setIsConfirmModalVisible(true);
                    } catch (err) {
                        message.error("Không tìm thấy phiên gửi xe nào của thành viên này");
                        // Reset
                        setScannedMemberCode(null);
                        setLicensePlate('');
                    }
                }
            }, 'image/jpeg', 0.8);
            return;
        }

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrcode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
        });

        if (qrcode) {
            console.log("QR Code detected at capture Checkout:", qrcode.data);
            try {
                const memberRes = await getMemberByCode(qrcode.data).unwrap();
                const memberData = memberRes.data;
                message.success(`Đã nhận diện TV ${memberData.fullname || ''}. Vui lòng hướng camera chụp biển số xe.`);
                setScannedMemberCode(qrcode.data);
                if (memberData && memberData.vehicles && memberData.vehicles.length > 0) {
                    setLicensePlate(memberData.vehicles[0].licensePlate);
                    setScannedVehicleType(memberData.vehicles[0].vehicleType);
                    setScannedLotId(memberData.parkingLotId);
                }
            } catch (err) {
                message.error('Không tìm thấy thông tin thành viên từ mã QR này');
            }
            return;
        }

        canvas.toBlob(async blob => {
            if (blob) {
                setCapturedBlob(blob);
                setIsCameraModalOpen(false);
                stopCamera();

                const formData = new FormData();
                formData.append('image', blob, 'plate.jpg');

                try {
                    const recognitionResult = await recognizeLicensePlate(formData).unwrap();
                    if (recognitionResult && recognitionResult.plate && recognitionResult.plate.trim() !== '') {
                        setLicensePlate(recognitionResult.plate.trim());
                    } else {
                        message.error('Không thể nhận diện biển số xe. Vui lòng nhập thủ công.');
                    }
                } catch (error) {
                    message.error('Không thể nhận diện biển số xe. Vui lòng nhập thủ công.');
                }
            }
        }, 'image/jpeg', 0.8);
    };

    const handleCameraModalClose = () => {
        setIsCameraModalOpen(false);
        stopCamera();
        setScannedMemberCode(null);
        setScannedLotId(null);
        setScannedVehicleType(null);
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

            try {
                const paymentRes = await calculatePayment({ code, paymentMethod: 'CASH' }).unwrap();
                response.totalCost = paymentRes?.data?.amount ?? paymentRes?.amount ?? response.totalCost;
            } catch (e) {
                console.error(e);
            }

            setExitDetails(response);
            setIsPaymentPending(false);
            setPaymentMethod('CASH');
            setIsConfirmModalVisible(true);
        } catch (error) {
            message.error("Không tìm thấy thông tin xe hoặc có lỗi xảy ra");
        }
    };

    const handleConfirmExit = async () => {
        if (!exitDetails || !capturedBlob) return;
        if (isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);

        const resetSubmitting = () => {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        };

        try {
            if (!scannedMemberCode && !isPaymentPending) {
                if (paymentMethod === 'MOMO') {
                    const paymentRes = await calculatePayment({
                        code,
                        paymentMethod
                    }).unwrap();

                    const momoUrl = paymentRes?.data?.paymentUrl || paymentRes?.paymentUrl || paymentRes?.data?.urlmomo || paymentRes?.urlmomo || paymentRes?.data?.payUrl || paymentRes?.payUrl || paymentRes?.data?.urlMomo || paymentRes?.urlMomo;
                    if (momoUrl) {
                        window.open(momoUrl, '_blank');
                        setIsPaymentPending(true);
                        message.info("Vui lòng đợi khách thanh toán MoMo, sau đó xác nhận lại để lấy xe.");
                        resetSubmitting();
                        return;
                    } else {
                        message.error("Không lấy được đường dẫn thanh toán MoMo.");
                        resetSubmitting();
                        return;
                    }
                }
            }

            const formData = new FormData();
            formData.append('image', capturedBlob, 'exit-image.jpg');

            let res;
            if (scannedMemberCode) {
                const payload = {
                    lotId: scannedLotId || exitDetails.lotId,
                    licensePlate: licensePlate,
                    vehicleType: scannedVehicleType || 'MOTORBIKE',
                    memberCode: scannedMemberCode
                };
                const jsonBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
                formData.append("data", jsonBlob);

                res = await createMemberParkingExit(formData);
            } else {
                res = await createParkingExit({
                    code,
                    licensePlate,
                    paymentMethod,
                    formData
                });
            }

            if ('error' in res) {
                const apiError = res.error as { data?: { message?: string } };
                message.error(apiError.data?.message || "Có lỗi xảy ra khi lấy xe");
                resetSubmitting();
            } else {
                message.success("Lấy xe thành công!");
                setExitDetails(res.data);
                setIsConfirmModalVisible(false);
                setIsModalVisible(true);
                setCode('');
                setLicensePlate('');
                setCapturedBlob(null);
                setScannedMemberCode(null);
                setScannedLotId(null);
                setScannedVehicleType(null);
                setIsPaymentPending(false);
                setPaymentMethod('CASH');
                resetSubmitting();
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi lấy xe");
            resetSubmitting();
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setExitDetails(null);
    };

    const handleConfirmModalClose = () => {
        setIsConfirmModalVisible(false);
        setExitDetails(null);
        setIsPaymentPending(false);
        setPaymentMethod('CASH');
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const handleConfirmExitRef = useRef(handleConfirmExit);
    useEffect(() => {
        handleConfirmExitRef.current = handleConfirmExit;
    }, [handleConfirmExit]);

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'momo_payment_success' && e.newValue) {
                if (isConfirmModalVisible && isPaymentPending) {
                    message.success("Thanh toán MoMo tại tab mới thành công! Đang tự động xuất bến...");
                    setTimeout(() => {
                        handleConfirmExitRef.current();
                    }, 500); // Wait a bit for UX
                    localStorage.removeItem('momo_payment_success');
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [isConfirmModalVisible, isPaymentPending]);

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
                onCancel={handleConfirmModalClose}
                footer={[
                    <Button key="cancel" onClick={handleConfirmModalClose} disabled={isSubmitting}>
                        Hủy
                    </Button>,
                    <Button key="confirm" type="primary" onClick={handleConfirmExit} loading={isSubmitting}>
                        Xác nhận lấy xe
                    </Button>
                ]}
                width={1000}
            >
                {exitDetails && (
                    <div style={{ padding: '20px 0' }}>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Mã thẻ/xe" span={1}>
                                {exitDetails.memberCode || exitDetails.code}
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
                            {!scannedMemberCode && (
                                <Descriptions.Item label="Tổng chi phí dự kiến" span={2}>
                                    <Text type="danger" strong>{exitDetails.totalCost != null ? exitDetails.totalCost.toLocaleString('vi-VN') : '-'} VNĐ</Text>
                                </Descriptions.Item>
                            )}
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

                        {!scannedMemberCode && (
                            <>
                                <Divider orientation="left">Phương thức thanh toán</Divider>
                                <Radio.Group
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    disabled={isPaymentPending}
                                >
                                    <Radio value="CASH">Tiền mặt</Radio>
                                    <Radio value="MOMO">MoMo</Radio>
                                </Radio.Group>
                                {isPaymentPending && (
                                    <Text type="warning" style={{ display: 'block', marginTop: 10 }}>
                                        Đang chờ thanh toán MoMo... Bấm "Xác nhận lấy xe" nếu khách đã thanh toán thành công.
                                    </Text>
                                )}
                            </>
                        )}
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
                            <Descriptions.Item label="Mã thẻ/xe" span={1}>
                                {exitDetails.memberCode || exitDetails.code}
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
                                {exitDetails.totalCost != null ? exitDetails.totalCost.toLocaleString('vi-VN') : '-'} VNĐ
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