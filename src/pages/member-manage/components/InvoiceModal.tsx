import React, { useRef } from 'react';
import { Modal, Descriptions, Tag, Button, Divider, Spin, Tooltip } from 'antd'; // Removed PrinterOutlined
import { PrinterOutlined, DownloadOutlined, CarOutlined } from '@ant-design/icons';
import { useGetMemberByIdQuery } from '../../../api/app_member/apiMember';
import { Invoice } from '../../../api/app_invoice/apiInvoice';
import dayjs from 'dayjs';

interface InvoiceModalProps {
    visible: boolean;
    invoice: Invoice | null;
    onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ visible, invoice, onClose }) => {
    const { data: memberData, isLoading } = useGetMemberByIdQuery(invoice?.memberId || 0, {
        skip: !invoice?.memberId,
    });

    const member = memberData?.data;

    const handlePrint = () => {
        window.print();
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
                <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>In hóa đơn</Button>
            ]}
            className="invoice-modal"
        >
            {isLoading ? (
                <div className="flex justify-center p-8"><Spin tip="Đang tải thông tin..." /></div>
            ) : (
                <div className="p-4" id="invoice-content">
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
                            <Descriptions.Item label="Địa chỉ/Phòng">{member?.roomNumber}</Descriptions.Item>
                            <Descriptions.Item label="Xe đăng ký">
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
                                    <th className="px-4 py-2">Gói</th>
                                    <th className="px-4 py-2">Thời gian</th>
                                    <th className="px-4 py-2 text-right">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {invoice.type === 'MEMBERSHIP' ? 'Đăng ký thành viên' : 'Phí gửi xe'}
                                        <div className="text-xs text-gray-400 font-normal">{member?.parkingLotName}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {member?.planName}
                                    </td>
                                    <td className="px-4 py-3">
                                        {member?.membershipStartDate && member?.membershipExpiryDate ? (
                                            <span>{dayjs(member.membershipStartDate).format('DD/MM/YYYY')} - {dayjs(member.membershipExpiryDate).format('DD/MM/YYYY')}</span>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.amount)}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="font-bold text-gray-900 bg-gray-50">
                                    <td colSpan={3} className="px-4 py-3 text-right">TỔNG CỘNG</td>
                                    <td className="px-4 py-3 text-right text-lg text-blue-600">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.amount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Vehicle Info */}
                    {member?.vehicles && member.vehicles.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-gray-600 mb-2">Xe Đăng Ký:</h4>
                            <div className="flex gap-2">
                                {member.vehicles.map((v: any) => (
                                    <Tag key={v.id} icon={<CarOutlined />}>{v.licensePlate} - {v.vehicleType}</Tag>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
                        <p>Cảm ơn quý khách đã sử dụng dịch vụ của Parkivia!</p>
                        <p>Vui lòng thanh toán trước ngày {dayjs(invoice.paymentDeadline).format('DD/MM/YYYY')} để tránh gián đoạn dịch vụ.</p>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default InvoiceModal;
