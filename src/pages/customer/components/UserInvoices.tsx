import React, { useState } from 'react';
import { Table, Button, Tag } from 'antd';
import { AuditOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGetInvoicesByUserQuery } from '../../../api/app_invoice/apiInvoice';
import InvoiceDetailModal from '../../invoice-manage/components/InvoiceDetailModal';

const UserInvoices: React.FC<{ userId: number }> = ({ userId }) => {
    const { data: invoices, isLoading } = useGetInvoicesByUserQuery(userId);
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const columns = [
        {
            title: 'Mã Hóa Đơn',
            dataIndex: 'invoiceCode',
            key: 'invoiceCode',
            render: (text: string) => <span className="font-mono font-bold text-blue-600">{text}</span>,
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={type === 'MEMBERSHIP' ? 'blue' : 'orange'}>
                    {type === 'MEMBERSHIP' ? 'Đăng ký TV' : 'Phí gửi xe'}
                </Tag>
            ),
        },
        {
            title: 'Số Tiền',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right' as const,
            render: (amount: number) => (
                <span className="font-bold text-slate-700">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
                </span>
            ),
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center' as const,
            render: (status: string) => {
                let color = 'default';
                let text = status;
                switch (status) {
                    case 'PAID': color = 'green'; text = 'Đã thanh toán'; break;
                    case 'UNPAID': color = 'red'; text = 'Chưa thanh toán'; break;
                    case 'OVERDUE': color = 'volcano'; text = 'Quá hạn'; break;
                    case 'CANCELLED': color = 'gray'; text = 'Đã hủy'; break;
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: '',
            key: 'action',
            render: (_: any, record: any) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        setSelectedInvoice(record);
                        setIsModalVisible(true);
                    }}
                />
            ),
        },
    ];

    const dataSource = Array.isArray(invoices) ? invoices : (invoices as any)?.data || [];

    return (
        <div className="py-4">
            <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="bg-purple-500 text-white p-3 rounded-full">
                    <AuditOutlined className="text-2xl" />
                </div>
                <div>
                    <h4 className="font-bold text-purple-800 text-lg">Lịch Sử Hóa Đơn</h4>
                    <p className="text-purple-600 text-sm">Theo dõi các khoản thanh toán và hóa đơn dịch vụ của bạn.</p>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={isLoading}
                pagination={{ pageSize: 5 }}
                size="small"
            />

            <InvoiceDetailModal
                visible={isModalVisible}
                invoice={selectedInvoice}
                onClose={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default UserInvoices;
