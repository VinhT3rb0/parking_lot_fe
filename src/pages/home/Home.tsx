import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import BreadcrumbFunction from '../../components/Breadcrumb/BreadcrumbFunction';
import { Card, Col, Row, Statistic, Tag } from 'antd';

const Home = () => {
    type ParkingSpot = {
        id: number;
        name: string;
        status: 'available' | 'occupied' | 'reserved';
    };
    const parkingSpots: ParkingSpot[] = [
        { id: 1, name: 'A1', status: 'available' },
        { id: 2, name: 'A2', status: 'occupied' },
        { id: 3, name: 'A3', status: 'reserved' },
    ];
    const getStatusColor = (status: ParkingSpot['status']) => {
        switch (status) {
            case 'available':
                return 'success';
            case 'occupied':
                return 'error';
            case 'reserved':
                return 'warning';
            default:
                return 'default';
        }
    };
    const getStatusText = (status: ParkingSpot['status']) => {
        const statusTextMap = {
            available: 'Còn trống',
            occupied: 'Đang sử dụng',
            reserved: 'Đã đặt trước'
        };
        return statusTextMap[status];
    };
    return (
        <>
            <BreadcrumbFunction functionName="Cài đặt" title="Quản lý tư vấn" />
            <Row gutter={16} style={{ marginBottom: 24 }}>
                {[120, 45, 75].map((value, index) => (
                    <Col span={8} key={index}>
                        <Card>
                            <Statistic
                                title={['Tổng số chỗ đỗ', 'Chỗ trống', 'Đang sử dụng'][index]}
                                value={value}
                                valueStyle={{
                                    color: ['#1890ff', '#52c41a', '#ff4d4f'][index]
                                }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row gutter={[16, 16]}>
                {parkingSpots.map((spot) => (
                    <Col
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        xl={4}
                        key={spot.id}
                    >
                        <Card
                            title={`Vị trí ${spot.name}`}
                            size="small"
                            hoverable
                            style={{
                                backgroundColor: {
                                    available: '#f6ffed',
                                    occupied: '#fff1f0',
                                    reserved: '#fffbe6'
                                }[spot.status]
                            }}
                        >
                            <Tag color={getStatusColor(spot.status)}>
                                {getStatusText(spot.status)}
                            </Tag>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default Home;
