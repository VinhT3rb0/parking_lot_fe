import React from 'react';
import { Modal, Table, Tag, Card, Row, Col, Statistic } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarOutlined } from '@ant-design/icons';

interface RevenueDetail {
    time: string;
    vehicleType: 'car' | 'motorbike';
    licensePlate: string;
    amount: number;
    duration: string;
}

interface RevenueDetailModalProps {
    visible: boolean;
    onClose: () => void;
    parkingLotName: string;
    date: string;
    details: RevenueDetail[];
}

const RevenueDetailModal: React.FC<RevenueDetailModalProps> = ({
    visible,
    onClose,
    parkingLotName,
    date,
    details
}) => {
    const columns: ColumnsType<RevenueDetail> = [
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Loại xe',
            dataIndex: 'vehicleType',
            key: 'vehicleType',
            render: (type) => (
                <Tag color={type === 'car' ? 'blue' : 'green'}>
                    {type === 'car' ? 'Ô tô' : 'Xe máy'}
                </Tag>
            )
        },
        {
            title: 'Biển số xe',
            dataIndex: 'licensePlate',
            key: 'licensePlate',
        },
        {
            title: 'Thời gian gửi',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`
        }
    ];

    const totalRevenue = details.reduce((sum, detail) => sum + detail.amount, 0);
    const carRevenue = details
        .filter(detail => detail.vehicleType === 'car')
        .reduce((sum, detail) => sum + detail.amount, 0);
    const motorbikeRevenue = details
        .filter(detail => detail.vehicleType === 'motorbike')
        .reduce((sum, detail) => sum + detail.amount, 0);

    return (
        <Modal
            title={`Chi tiết doanh thu - ${parkingLotName}`}
            open={visible}
            onCancel={onClose}
            width={1000}
            footer={null}
        >
            <div className="mb-6">
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng doanh thu"
                                value={totalRevenue}
                                prefix={<DollarOutlined />}
                                formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Doanh thu xe ô tô"
                                value={carRevenue}
                                prefix={<DollarOutlined />}
                                formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Doanh thu xe máy"
                                value={motorbikeRevenue}
                                prefix={<DollarOutlined />}
                                formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
            <Table
                columns={columns}
                dataSource={details}
                rowKey="time"
                pagination={{ pageSize: 5 }}
            />
        </Modal>
    );
};

export default RevenueDetailModal; 