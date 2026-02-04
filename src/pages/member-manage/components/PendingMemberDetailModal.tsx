import React from 'react';
import { Modal, Button, Tag, Card, Row, Col, Descriptions, Avatar, Table } from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    CarOutlined,
    UserOutlined,
    IdcardOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined
} from '@ant-design/icons';

interface PendingMemberDetailModalProps {
    visible: boolean;
    member: any;
    onClose: () => void;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

const PendingMemberDetailModal: React.FC<PendingMemberDetailModalProps> = ({
    visible,
    member,
    onClose,
    onApprove,
    onReject
}) => {
    return (
        <Modal
            title={
                <div className="flex items-center gap-3 border-b pb-3 mr-8">
                    <Avatar size="large" icon={<UserOutlined />} className="bg-blue-500" />
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
                    key="reject"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                        onClose();
                        onReject(member?.id);
                    }}
                >
                    Từ chối
                </Button>,
                <Button
                    key="approve"
                    type="primary"
                    icon={<CheckOutlined />}
                    className="bg-green-600"
                    onClick={() => {
                        onClose();
                        onApprove(member?.id);
                    }}
                >
                    Duyệt thành viên
                </Button>
            ]}
        >
            {member && (
                <div className="py-4 space-y-6">
                    {/* Status Alert */}
                    <div className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600 font-medium">Trạng thái:</span>
                            <Tag color={member.memberStatus === 'PENDING' ? 'orange' : 'green'}>
                                {member.memberStatus}
                            </Tag>
                        </div>
                        <div className="text-gray-500 text-sm">
                            Ngày tạo: {new Date(member.createdAt).toLocaleDateString('vi-VN')}
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
                                    <Descriptions.Item label="Phí thành viên">
                                        <span className="text-green-600 font-bold text-lg">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(member.membershipFee || 0)}
                                        </span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Yêu cầu ngày">
                                        {new Date(member.createdAt).toLocaleString('vi-VN')}
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
                            dataSource={member.vehicles || (member.licensePlate ? [{ id: 1, licensePlate: member.licensePlate, vehicleType: member.vehicleType }] : [])}
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

export default PendingMemberDetailModal;
