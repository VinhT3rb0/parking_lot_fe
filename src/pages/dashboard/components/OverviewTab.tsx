import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { DollarOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';

interface OverviewTabProps {
    statistics: {
        totalRevenue: number;
        monthlyRevenue: number;
        totalParkingSpots: number;
        availableSpots: number;
        totalUsers: number;
        activeUsers: number;
    };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ statistics }) => {
    return (
        <div>
            <Row gutter={[16, 16]} className="mb-6">
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={statistics.totalRevenue}
                            prefix={<DollarOutlined />}
                            formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Doanh thu tháng"
                            value={statistics.monthlyRevenue}
                            prefix={<DollarOutlined />}
                            formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng số người dùng"
                            value={statistics.totalUsers}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card title="Thống kê bãi đỗ xe">
                        <Statistic
                            title="Tổng số chỗ đỗ"
                            value={statistics.totalParkingSpots}
                            prefix={<CarOutlined />}
                        />
                        <Progress
                            percent={Math.round((statistics.availableSpots / statistics.totalParkingSpots) * 100)}
                            status="active"
                            className="mt-4"
                        />
                        <div className="mt-2 text-gray-500">
                            Còn trống: {statistics.availableSpots} chỗ
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Trạng thái người dùng">
                        <Progress
                            percent={Math.round((statistics.activeUsers / statistics.totalUsers) * 100)}
                            status="active"
                        />
                        <div className="mt-2 text-gray-500">
                            Đang hoạt động: {statistics.activeUsers} người dùng
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OverviewTab; 