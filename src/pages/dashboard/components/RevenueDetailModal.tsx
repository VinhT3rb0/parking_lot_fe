import React from 'react';
import { Modal, Table, Card, Row, Col, Statistic, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarOutlined, CarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface RevenueDetail {
    id: number;
    parkingLotId: number;
    parkingLotName: string;
    date: string;
    totalSessions: number;
    totalRevenue: number;
    averageDurationMinutes: number;
}

interface RevenueDetailModalProps {
    visible: boolean;
    onClose: () => void;
    parkingLotName: string;
    date: string;
    details: RevenueDetail[];
}

const { Title, Text } = Typography;

const RevenueDetailModal: React.FC<RevenueDetailModalProps> = ({
    visible,
    onClose,
    parkingLotName,
    date,
    details
}) => {
    // Sắp xếp dữ liệu theo ngày tăng dần
    const sortedDetails = [...details].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const columns: ColumnsType<RevenueDetail> = [
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: 'Số lượt gửi',
            dataIndex: 'totalSessions',
            key: 'totalSessions',
            sorter: (a, b) => a.totalSessions - b.totalSessions,
        },
        {
            title: 'Thời gian TB (phút)',
            dataIndex: 'averageDurationMinutes',
            key: 'averageDurationMinutes',
            render: (value) => value.toLocaleString('vi-VN'),
            sorter: (a, b) => a.averageDurationMinutes - b.averageDurationMinutes,
        },
        {
            title: 'Doanh thu',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render: (value) => `${value.toLocaleString('vi-VN')} VNĐ`,
            sorter: (a, b) => a.totalRevenue - b.totalRevenue,
        }
    ];

    // Tính toán các thống kê tổng quan
    const totalRevenue = details.reduce((sum, detail) => sum + detail.totalRevenue, 0);
    const totalSessions = details.reduce((sum, detail) => sum + detail.totalSessions, 0);

    // Tính thời gian trung bình có trọng số (theo số lượt gửi)
    const weightedAvgDuration = totalSessions > 0
        ? details.reduce((sum, detail) => sum + (detail.averageDurationMinutes * detail.totalSessions), 0) / totalSessions
        : 0;

    // Tìm ngày bắt đầu và kết thúc
    const startDate = sortedDetails.length > 0 ? sortedDetails[0].date : '';
    const endDate = sortedDetails.length > 0 ? sortedDetails[sortedDetails.length - 1].date : '';

    return (
        <Modal
            title={
                <div>
                    <Title level={4} className="mb-0">Chi tiết doanh thu - {parkingLotName}</Title>
                    {startDate && endDate && (
                        <Text type="secondary">
                            Từ {dayjs(startDate).format('DD/MM/YYYY')} đến {dayjs(endDate).format('DD/MM/YYYY')}
                        </Text>
                    )}
                </div>
            }
            open={visible}
            onCancel={onClose}
            width={1000}
            footer={null}
            centered
        >
            {/* Thống kê tổng quan */}
            <div className="mb-6">
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Card bordered={false} className="shadow-sm">
                            <Statistic
                                title="Tổng doanh thu"
                                value={totalRevenue}
                                precision={0}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                                formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                            />
                            {details.length > 0 && (
                                <Text type="secondary" className="mt-2 block">
                                    Trung bình: {(totalRevenue / details.length).toLocaleString('vi-VN')} VNĐ/ngày
                                </Text>
                            )}
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card bordered={false} className="shadow-sm">
                            <Statistic
                                title="Tổng lượt gửi xe"
                                value={totalSessions}
                                prefix={<CarOutlined />}
                            />
                            {details.length > 0 && (
                                <Text type="secondary" className="mt-2 block">
                                    Trung bình: {(totalSessions / details.length).toFixed(1)} lượt/ngày
                                </Text>
                            )}
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card bordered={false} className="shadow-sm">
                            <Statistic
                                title="Thời gian gửi TB"
                                value={Math.round(weightedAvgDuration)}
                                precision={0}
                                prefix={<ClockCircleOutlined />}
                                suffix="phút"
                            />
                            {details.length > 1 && (
                                <Text type="secondary" className="mt-2 block">
                                    Dao động: {Math.min(...details.map(d => d.averageDurationMinutes))} - {Math.max(...details.map(d => d.averageDurationMinutes))} phút
                                </Text>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Bảng chi tiết theo ngày */}
            <Table
                columns={columns}
                dataSource={sortedDetails}
                rowKey="id"
                pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    showTotal: (total) => `Tổng ${total} ngày`
                }}
                locale={{
                    emptyText: 'Không có dữ liệu doanh thu'
                }}
            />
        </Modal>
    );
};

export default RevenueDetailModal;