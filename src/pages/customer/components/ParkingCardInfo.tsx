import React, { useState } from 'react';
import { Spin, Button, Form, Input, Row, Col, Tag } from 'antd';
import { IdcardOutlined, UserOutlined, PhoneOutlined, CalendarOutlined, MailOutlined } from '@ant-design/icons';
import { useGetMemberByUserIdQuery } from '../../../api/app_member/apiMember';
import MemberRequestModal from '../../../components/MemberRequestModal';
import dayjs from 'dayjs';
const ParkingCardInfo: React.FC<{ userId: number, role: string }> = ({ userId, role }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const shouldFetch = !!userId && role === 'MEMBER';
    const { data: memberData, isLoading, isError } = useGetMemberByUserIdQuery(userId, {
        skip: !shouldFetch
    });

    if (role !== 'MEMBER') {
        return (
            <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="bg-orange-100 p-6 rounded-full mb-4">
                    <IdcardOutlined className="text-4xl text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa Đăng Ký Thẻ Thành Viên</h3>
                <p className="text-gray-500 max-w-md mb-6">
                    Bạn chưa là thành viên chính thức. Hãy đăng ký ngay để nhận được nhiều ưu đãi và sử dụng dịch vụ gửi xe thuận tiện hơn.
                </p>
                <Button
                    type="primary"
                    size="large"
                    className="bg-orange-500 hover:bg-orange-600 border-none font-bold shadow-md"
                    onClick={() => setIsModalOpen(true)}
                >
                    Đăng Ký Thành Viên Ngay
                </Button>

                <MemberRequestModal
                    visible={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                />
            </div>
        );
    }

    if (isLoading) return <div className="text-center py-8"><Spin /></div>;
    // Handle error or empty data for member
    if (shouldFetch && (isError || !memberData)) return <div className="text-center py-8 text-red-500">Không thể tải thông tin thành viên.</div>;

    const member = memberData?.data;
    if (!member) return null;

    return (
        <div className="py-4">
            <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="bg-blue-500 text-white p-3 rounded-full">
                    <IdcardOutlined className="text-2xl" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-800 text-lg">Thẻ Thành Viên</h4>
                    <p className="text-blue-600 text-sm">Thông tin chi tiết thành viên từ hệ thống quản lý.</p>
                </div>
            </div>

            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={24} md={12}>
                        <Form.Item label="Mã Thành Viên">
                            <Input value={member.memberCode} prefix={<UserOutlined />} readOnly className="bg-gray-50 text-slate-700 font-semibold" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Họ và tên">
                            <Input value={member.fullname || ''} readOnly className="bg-gray-50" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Số điện thoại">
                            <Input value={member.phoneNumber || ''} prefix={<PhoneOutlined rotate={90} />} readOnly className="bg-gray-50" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Ngày sinh">
                            <Input value={member.dateOfBirth ? dayjs(member.dateOfBirth).format('DD/MM/YYYY') : ''} prefix={<CalendarOutlined />} readOnly className="bg-gray-50" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Email">
                            <Input value={member.email} prefix={<MailOutlined />} readOnly className="bg-gray-50" />
                        </Form.Item>
                    </Col>
                    {/* <Col span={24} md={12}>
                        <Form.Item label="Biển số xe">
                            {member?.vehicles?.licensePlate.map((plate, index) => (
                                <Tag key={index} color="blue" className="px-3 py-1 text-sm">{plate}</Tag>
                            ))}
                        </Form.Item>
                    </Col> */}
                    <Col span={24} md={12}>
                        <Form.Item label="Phương tiện đăng ký">
                            <div className="flex flex-wrap gap-2">
                                {member.vehicles && member.vehicles.length > 0 ? (
                                    member.vehicles.map((vehicle) => (
                                        <Tag key={vehicle.id} color="green" className="text-sm py-1 px-3">
                                            {vehicle.licensePlate} ({vehicle.vehicleType})
                                        </Tag>
                                    ))
                                ) : (
                                    <span className="text-gray-500 italic">Chưa đăng ký phương tiện</span>
                                )}
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ParkingCardInfo;
