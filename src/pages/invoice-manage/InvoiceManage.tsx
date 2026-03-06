import React, { useState, useMemo } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Table, Tag, Button, Input, Tabs, Card } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useGetAllInvoicesQuery, useGetInvoicesByStatusQuery } from '../../api/app_invoice/apiInvoice';
import InvoiceDetailModal from './components/InvoiceDetailModal';

const InvoiceList: React.FC<{ status: string; onViewDetail: (invoice: any) => void }> = ({ status, onViewDetail }) => {
    const { data: allInvoices, isLoading: isAllLoading } = useGetAllInvoicesQuery(undefined, { skip: status !== 'ALL' });
    const { data: statusInvoices, isLoading: isStatusLoading } = useGetInvoicesByStatusQuery(status, { skip: status === 'ALL' });

    const invoices = status === 'ALL' ? allInvoices : statusInvoices;
    const isLoading = status === 'ALL' ? isAllLoading : isStatusLoading;

    const [searchText, setSearchText] = useState('');

    const dataSource = useMemo(() => {
        if (Array.isArray(invoices)) return invoices;
        if (invoices && typeof invoices === 'object' && Array.isArray((invoices as any).data)) return (invoices as any).data;
        return [];
    }, [invoices]);

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
                        onViewDetail(record);
                    }}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="Tìm kiếm theo mã hóa đơn..."
                    prefix={<SearchOutlined />}
                    className="w-64"
                    value={searchText}
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
                    onClick: () => onViewDetail(record),
                    style: { cursor: 'pointer' },
                })}
            />
        </div>
    );
};

const InvoiceManage: React.FC = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleViewDetail = (invoice: any) => {
        setSelectedInvoice(invoice);
        setIsModalVisible(true);
    };

    const items = [
        { key: 'ALL', label: 'Tất cả hóa đơn', status: 'ALL' },
        { key: 'UNPAID', label: 'Chưa thanh toán', status: 'UNPAID' },
        { key: 'PAID', label: 'Đã thanh toán', status: 'PAID' },
        { key: 'OVERDUE', label: 'Quá hạn', status: 'OVERDUE' },
        { key: 'CANCELLED', label: 'Đã hủy', status: 'CANCELLED' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Quản Lý Hóa Đơn</h1>

            <Tabs
                defaultActiveKey="ALL"
                type="card"
                items={items.map(item => ({
                    key: item.key,
                    label: item.label,
                    children: <InvoiceList status={item.status} onViewDetail={handleViewDetail} />
                }))}
            />

            <InvoiceDetailModal
                visible={isModalVisible}
                invoice={selectedInvoice}
                onClose={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default InvoiceManage;
