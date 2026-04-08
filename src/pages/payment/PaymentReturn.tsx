import React, { useEffect, useState, useRef } from 'react';
import { Result, Button, Spin, Card } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { useIpnPaymentMutation } from '../../api/app_payment/apiPayment';

const PaymentReturn: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [ipnPayment] = useIpnPaymentMutation();

    // const [confirmPayment] = useConfirmInvoicePaymentMutation();

    const [status, setStatus] = useState<'success' | 'error' | 'processing'>('processing');
    const [messageText, setMessageText] = useState('Đang xử lý kết quả thanh toán...');

    const isProcessingRef = useRef(false);

    useEffect(() => {
        if (isProcessingRef.current) return;

        const resultCode = searchParams.get('resultCode');
        const messageFromMoMo = searchParams.get('message');
        const orderId = searchParams.get('orderId');

        if (resultCode !== null) {
            isProcessingRef.current = true; // Mark as processed to prevent duplicate calls in StrictMode
        }

        const handleSuccess = async () => {
            // Lớp bảo vệ 2: Phòng trường hợp người dùng F5 (tải lại trang), check xem orderId đã xử lý chưa
            const processedOrders = JSON.parse(sessionStorage.getItem('processed_momo_orders') || '[]');
            if (orderId && processedOrders.includes(orderId)) {
                setStatus('success');
                setMessageText('Thanh toán thành công!');
                localStorage.setItem('momo_payment_success', Date.now().toString());
                return;
            }

            const invoiceId = localStorage.getItem('payment_invoice_id');
            if (invoiceId) {
                // Collect all params for IPN
                const ipnData: any = {};
                searchParams.forEach((value, key) => {
                    if (key === 'amount' || key === 'resultCode') {
                        ipnData[key] = Number(value);
                    } else {
                        ipnData[key] = value;
                    }
                });

                try {
                    // Call IPN endpoint as requested
                    await ipnPayment(ipnData).unwrap();

                    // Lưu lại orderId đã gọi api thành công
                    if (orderId) {
                        processedOrders.push(orderId);
                        sessionStorage.setItem('processed_momo_orders', JSON.stringify(processedOrders));
                    }
                } catch (error) {
                    console.error('Failed to send IPN data:', error);
                }
            }
            setStatus('success');
            setMessageText('Thanh toán thành công!');
            localStorage.setItem('momo_payment_success', Date.now().toString());
        };

        if (resultCode === '0' || resultCode === '9000') {
            handleSuccess();
        } else if (resultCode === '1006') {
            setStatus('error');
            setMessageText('Bạn đã hủy giao dịch thanh toán.');
        } else if (resultCode) {
            setStatus('error');
            setMessageText(messageFromMoMo || 'Thanh toán thất bại.');
        } else {
            setStatus('error');
            setMessageText('Không tìm thấy thông tin kết quả thanh toán.');
        }
    }, [searchParams, ipnPayment]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Card className="w-full max-w-md shadow-lg rounded-xl">
                {status === 'processing' && (
                    <div className="text-center py-10">
                        <Spin size="large" />
                        <p className="mt-4 text-gray-500">{messageText}</p>
                    </div>
                )}

                {status === 'success' && (
                    <Result
                        status="success"
                        icon={<CheckCircleFilled className="text-green-500" />}
                        title="Thanh toán thành công"
                        subTitle="Cảm ơn bạn đã sử dụng dịch vụ. Hóa đơn của bạn đã được thanh toán."
                        extra={[
                            <Button type="primary" key="console" onClick={() => navigate('/invoice-management')}>
                                Về quản lý hóa đơn
                            </Button>,
                            <Button key="buy" onClick={() => navigate('/')}>
                                Về trang chủ
                            </Button>,
                        ]}
                    />
                )}

                {status === 'error' && (
                    <Result
                        status="error"
                        icon={<CloseCircleFilled className="text-red-500" />}
                        title="Thanh toán thất bại"
                        subTitle={messageText}
                        extra={[
                            <Button type="primary" key="console" onClick={() => navigate('/invoice-management')}>
                                Quay lại hóa đơn
                            </Button>,
                            <Button key="buy" onClick={() => navigate('/')}>
                                Về trang chủ
                            </Button>,
                        ]}
                    />
                )}
            </Card>
        </div>
    );
};

export default PaymentReturn;
