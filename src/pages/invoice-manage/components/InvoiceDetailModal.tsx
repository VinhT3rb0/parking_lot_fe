import React from 'react';
import { Modal, Descriptions, Tag, Button, Spin, message, Tooltip } from 'antd';
import { PrinterOutlined, CreditCardOutlined, CarOutlined } from '@ant-design/icons';
import { useGetMemberByIdQuery } from '../../../api/app_member/apiMember';
import { useCreatePaymentMutation } from '../../../api/app_payment/apiPayment';

import { Invoice } from '../../../api/app_invoice/apiInvoice';
import dayjs from 'dayjs';

interface InvoiceDetailModalProps {
    visible: boolean;
    invoice: Invoice | null;
    onClose: () => void;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ visible, invoice, onClose }) => {
    const { data: memberData, isLoading } = useGetMemberByIdQuery(invoice?.memberId || 0, {
        skip: !invoice?.memberId,
    });
    const [createPayment, { isLoading: isPaying }] = useCreatePaymentMutation();

    const member = memberData?.data;

    const handlePrint = () => {
        window.print();
    };

    const handlePayment = async () => {
        if (!invoice) return;
        try {
            const response = await createPayment(invoice.id).unwrap();

            if (response.status === 'success' && response.data?.paymentUrl) {
                // Save invoiceId to localStorage to retrieve it on return
                localStorage.setItem('payment_invoice_id', invoice.id.toString());
                localStorage.setItem('payment_id', response.data.paymentId.toString());

                // Redirect to MoMo payment page
                window.location.href = response.data.paymentUrl;
            } else {
                message.error(response.message || 'Không nhận được đường dẫn thanh toán từ hệ thống');
            }
        } catch (error) {
            console.error('Payment error:', error);
            message.error('Có lỗi xảy ra khi tạo thanh toán');
        }
    };

    if (!invoice) return null;

    return (
        <Modal
            title={<span className="text-lg font-bold text-blue-800">Chi Tiết Hóa Đơn</span>}
            open={visible}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="close" onClick={onClose}>Đóng</Button>,
                <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>In hóa đơn</Button>,
                invoice.status === 'UNPAID' && (
                    <Button
                        key="pay"
                        type="primary"
                        danger // MoMo pink-ish
                        icon={<CreditCardOutlined />}
                        onClick={handlePayment}
                        loading={isPaying}
                    >
                        Thanh toán MoMo
                    </Button>
                )
            ]}
            className="invoice-modal"
        >
            {isLoading ? (
                <div className="flex justify-center p-8"><Spin tip="Đang tải thông tin..." /></div>
            ) : (
                <div className="p-4" id="invoice-content">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">HÓA ĐƠN DỊCH VỤ</h2>
                            <p className="text-sm text-gray-500">Mã hóa đơn: <span className="font-mono font-bold text-gray-800">{invoice.invoiceCode}</span></p>
                            <p className="text-sm text-gray-500">Ngày tạo: {dayjs(invoice.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                        </div>
                        <div className="text-right">
                            <Tag color={invoice.status === 'PAID' ? 'green' : invoice.status === 'OVERDUE' ? 'red' : 'orange'} className="text-base px-3 py-1">
                                {invoice.status === 'PAID' ? 'ĐÃ THANH TOÁN' : invoice.status === 'OVERDUE' ? 'QUÁ HẠN' : 'CHƯA THANH TOÁN'}
                            </Tag>
                            {invoice.status === 'UNPAID' && (
                                <p className="text-xs text-red-500 mt-1">Hạn TT: {dayjs(invoice.paymentDeadline).format('DD/MM/YYYY')}</p>
                            )}
                        </div>
                    </div>

                    {/* Member Info */}
                    <div className="mb-6 bg-slate-50 p-4 rounded-lg">
                        <Descriptions title="Thông Tin Khách Hàng" column={2} size="small">
                            <Descriptions.Item label="Khách hàng"><span className="font-semibold">{member?.fullname}</span></Descriptions.Item>
                            <Descriptions.Item label="Mã thành viên">{member?.memberCode}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{member?.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Email">{member?.email}</Descriptions.Item>
                            <Descriptions.Item label="Số phòng">{member?.parkingLotName} - {member?.roomNumber || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Xe đăng ký">
                                {member?.vehicles.length > 1 ? (
                                    <Tooltip title={
                                        <div>
                                            {member?.vehicles.map((v: any) => (
                                                <div key={v.id}>{v.licensePlate} ({v.vehicleType})</div>
                                            ))}
                                        </div>
                                    }>
                                        <Tag icon={<CarOutlined />}>
                                            {member?.vehicles[0].licensePlate} (+{member?.vehicles.length - 1})
                                        </Tag>
                                    </Tooltip>
                                ) : (
                                    <Tag icon={<CarOutlined />}>
                                        NA
                                    </Tag>
                                )}
                            </Descriptions.Item>
                        </Descriptions>

                    </div>

                    {/* Service Details */}
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-700 mb-3 border-l-4 border-blue-500 pl-2">Chi Tiết Dịch Vụ</h3>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Dịch vụ</th>
                                    <th className="px-4 py-2">Mô tả</th>
                                    <th className="px-4 py-2 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {member?.planName}
                                    </td>
                                    <td className="px-4 py-3">
                                        {invoice.description || member?.planName}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.amount)}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="font-bold text-gray-900 bg-gray-50">
                                    <td colSpan={2} className="px-4 py-3 text-right">TỔNG CỘNG</td>
                                    <td className="px-4 py-3 text-right text-lg text-blue-600">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.amount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default InvoiceDetailModal;
