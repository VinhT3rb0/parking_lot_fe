import React from 'react';
import { Modal, Button, Tag, Card, Row, Col, Descriptions, Avatar, Table } from 'antd';
import {
    ReloadOutlined,
    CarOutlined,
    UserOutlined,
    IdcardOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined
} from '@ant-design/icons';

interface ExpiringMemberDetailModalProps {
    visible: boolean;
    member: any;
    onClose: () => void;
    onRenew: (id: number) => void;
}

const ExpiringMemberDetailModal: React.FC<ExpiringMemberDetailModalProps> = ({
    visible,
    member,
    onClose,
    onRenew
}) => {
    return (
        <Modal
            title={
                <div className="flex items-center gap-3 border-b pb-3 mr-8">
                    <Avatar size="large" icon={<UserOutlined />} className="bg-orange-500" />
                    <div>
                        <div className="text-lg font-bold text-gray-800">{member?.fullname}</div>
                        <div className="text-sm font-normal text-gray-500">{member?.memberCode || 'Chưa có mã'}</div>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onClose}
            width={800}
            className="top-10"
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
                <Button
                    key="renew"
                    type="primary"
                    icon={<ReloadOutlined />}
                    className="bg-blue-600"
                    onClick={() => {
                        onClose();
                        onRenew(member?.id);
                    }}
                >
                    Gia hạn gói
                </Button>
            ]}
        >
            {member && (
                <div className="py-4 space-y-6">
                    {/* Status Alert */}
                    <div className="flex items-center justify-between bg-orange-50 px-4 py-3 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-600 font-medium">Trạng thái:</span>
                            <Tag color="warning">
                                Sắp hết hạn
                            </Tag>
                        </div>
                        <div className="text-gray-500 text-sm">
                            Ngày hết hạn: {member.membershipExpiryDate ? new Date(member.membershipExpiryDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                    </div>

                    <Row gutter={[24, 24]}>
                        {/* Personal Info */}
                        <Col span={24} md={12}>
                            <Card
                                title={<><IdcardOutlined className="mr-2 text-blue-500" />Thông tin cá nhân</>}
                                className="h-full shadow-sm hover:shadow-md transition-shadow"
                                size="small"
                            >
                                <Descriptions column={1} size="small" labelStyle={{ color: '#6b7280' }} contentStyle={{ fontWeight: 500 }}>
                                    <Descriptions.Item label={<><PhoneOutlined className="mr-1" /> Số điện thoại</>}>
                                        {member.phoneNumber}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<><MailOutlined className="mr-1" /> Email</>}>
                                        {member.email}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<><CalendarOutlined className="mr-1" /> Ngày sinh</>}>
                                        {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<><HomeOutlined className="mr-1" /> Số phòng</>}>
                                        {member.roomNumber || 'N/A'}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>

                        {/* Plan Info */}
                        <Col span={24} md={12}>
                            <Card
                                title={<><CarOutlined className="mr-2 text-green-500" />Thông tin gói đăng ký</>}
                                className="h-full shadow-sm hover:shadow-md transition-shadow"
                                size="small"
                            >
                                <Descriptions column={1} size="small" labelStyle={{ color: '#6b7280' }} contentStyle={{ fontWeight: 500 }}>
                                    <Descriptions.Item label="Bãi đỗ xe">
                                        {member.parkingLotName}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Tên gói">
                                        <Tag color="cyan">{member.planName || `Gói #${member.planId}`}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ngày bắt đầu">
                                        {member.membershipStartDate ? new Date(member.membershipStartDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ngày hết hạn">
                                        <span className="text-red-500 font-bold">
                                            {member.membershipExpiryDate ? new Date(member.membershipExpiryDate).toLocaleDateString('vi-VN') : 'N/A'}
                                        </span>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>
                    </Row>

                    {/* Vehicles Table */}
                    <Card
                        title={`Danh sách xe đăng ký (${member.vehicles?.length || 0})`}
                        size="small"
                        className="shadow-sm"
                        bodyStyle={{ padding: 0 }}
                    >
                        <Table
                            dataSource={member.vehicles || []}
                            pagination={false}
                            rowKey="id"
                            columns={[
                                {
                                    title: 'STT',
                                    key: 'index',
                                    width: 60,
                                    align: 'center',
                                    render: (_, __, index) => index + 1
                                },
                                {
                                    title: 'Biển số xe',
                                    dataIndex: 'licensePlate',
                                    key: 'licensePlate',
                                    render: text => <Tag color="geekblue" className="text-base font-medium px-2 py-1">{text}</Tag>
                                },
                                {
                                    title: 'Loại xe',
                                    dataIndex: 'vehicleType',
                                    key: 'vehicleType',
                                    render: text => (
                                        <span>
                                            {text === 'CAR' || text === 'Ô tô' ? <CarOutlined className="mr-2 text-blue-500" /> : null}
                                            {text}
                                        </span>
                                    )
                                },
                            ]}
                        />
                    </Card>
                </div>
            )}
        </Modal>
    );
};

export default ExpiringMemberDetailModal;
