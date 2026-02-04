import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Input } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGetAllInvoicesQuery } from '../../api/app_invoice/apiInvoice';
import InvoiceDetailModal from './components/InvoiceDetailModal';

const InvoiceManage: React.FC = () => {
    const { data: invoices, isLoading } = useGetAllInvoicesQuery();
    const [searchText, setSearchText] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const columns = [
        {
            title: 'Mã Hóa Đơn',
            dataIndex: 'invoiceCode',
            key: 'invoiceCode',
            render: (text: string) => <span className="font-mono font-bold">{text}</span>,
            filteredValue: [searchText],
            onFilter: (value: any, record: any) =>
                record.invoiceCode?.toLowerCase().includes(value.toLowerCase()) ||
                record.memberId?.toString().includes(value),
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
            render: (amount: number) => (
                <span className="font-bold text-green-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
                </span>
            ),
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                let text = status;
                switch (status) {
                    case 'PAID': color = 'green'; text = 'Đã thanh toán'; break;
                    case 'UNPAID': color = 'orange'; text = 'Chưa thanh toán'; break;
                    case 'OVERDUE': color = 'red'; text = 'Quá hạn'; break;
                    case 'CANCELLED': color = 'gray'; text = 'Đã hủy'; break;
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvoice(record);
                        setIsModalVisible(true);
                    }}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    const dataSource = Array.isArray(invoices) ? invoices : (invoices as any)?.data || [];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Quản Lý Hóa Đơn</h1>

            <Card className="shadow-sm rounded-lg">
                <div className="mb-4 flex justify-between items-center">
                    <Input
                        placeholder="Tìm kiếm theo mã hóa đơn..."
                        prefix={<SearchOutlined />}
                        className="w-64"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                    onRow={(record) => ({
                        onClick: () => {
                            setSelectedInvoice(record);
                            setIsModalVisible(true);
                        },
                        style: { cursor: 'pointer' },
                    })}
                />
            </Card>

            <InvoiceDetailModal
                visible={isModalVisible}
                invoice={selectedInvoice}
                onClose={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default InvoiceManage;
