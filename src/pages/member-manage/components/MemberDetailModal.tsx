import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Button, Tag, Form, Input, DatePicker, message, Space, List, Avatar, Select } from 'antd';
import { EditOutlined, CarOutlined, SaveOutlined, StopOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetMemberByIdQuery, useUpdateMemberMutation } from '../../../api/app_member/apiMember';
import dayjs from 'dayjs';

interface MemberDetailModalProps {
    open: boolean;
    memberId: number | null;
    onCancel: () => void;
    onSuccess: () => void;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ open, memberId, onCancel, onSuccess }) => {
    const { data: memberDetail, isFetching, refetch } = useGetMemberByIdQuery(memberId!, {
        skip: !memberId
    });
    const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            setIsEditing(false);
            if (memberId) refetch();
        }
    }, [open, memberId]);

    useEffect(() => {
        if (isEditing && memberDetail?.data) {
            const vehicles = (memberDetail.data.vehicles || []).map((v: any) => ({
                ...v,
                vehicleType: v.vehicleType === 'Ô tô' ? 'CAR' : (v.vehicleType === 'Xe máy' ? 'MOTORBIKE' : v.vehicleType)
            }));

            form.setFieldsValue({
                fullname: memberDetail.data.fullname,
                phoneNumber: memberDetail.data.phoneNumber,
                email: memberDetail.data.email,
                dateOfBirth: memberDetail.data.dateOfBirth ? dayjs(memberDetail.data.dateOfBirth) : null,
                address: memberDetail.data.address,
                vehicles: vehicles
            });
        }
    }, [isEditing]); // Removed memberDetail from dependencies to prevent reset

    const handleUpdate = async (values: any) => {
        if (!memberId) return;
        try {
            const payload = {
                ...values,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
            };
            await updateMember({ id: memberId, data: payload }).unwrap();
            message.success('Cập nhật thông tin thành công');
            setIsEditing(false);
            refetch();
            onSuccess();
        } catch (error) {
            message.error('Cập nhật thất bại');
        }
    };

    const renderVehicles = (vehicles: any[]) => {
        if (!vehicles || vehicles.length === 0) return <span className="text-gray-400">Chưa có xe đăng ký</span>;
        return (
            <List
                itemLayout="horizontal"
                dataSource={vehicles}
                renderItem={(item: any) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar icon={<CarOutlined />} className="bg-blue-100 text-blue-600" />}
                            title={<span className="font-semibold">{item.licensePlate}</span>}
                            description={<Tag color="blue">{item.vehicleType}</Tag>}
                        />
                    </List.Item>
                )}
            />
        );
    };

    const member = memberDetail?.data;

    return (
        <Modal
            title={isEditing ? "Chỉnh sửa thông tin thành viên" : "Chi tiết thành viên"}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            {isFetching ? (
                <div className="p-8 text-center text-gray-500">Đang tải thông tin...</div>
            ) : member ? (
                isEditing ? (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        className="mt-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="fullname" label="Họ và tên" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="dateOfBirth" label="Ngày sinh">
                                <DatePicker format="DD/MM/YYYY" className="w-full" />
                            </Form.Item>
                            <Form.Item name="address" label="Địa chỉ" className="md:col-span-2">
                                <Input />
                            </Form.Item>
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-bold mb-3">Danh sách xe</h4>
                            <Form.List name="vehicles">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'id']}
                                                    hidden
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'licensePlate']}
                                                    rules={[{ required: true, message: 'Nhập biển số' }]}
                                                >
                                                    <Input placeholder="Biển số" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'vehicleType']}
                                                    rules={[{ required: true, message: 'Chọn loại xe' }]}
                                                >
                                                    <Select placeholder="Loại xe" style={{ width: 120 }}>
                                                        <Select.Option value="MOTORBIKE">Xe máy</Select.Option>
                                                        <Select.Option value="CAR">Ô tô</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add({ vehicleType: 'MOTORBIKE' })} block icon={<PlusOutlined />}>
                                                Thêm xe
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={isUpdating} icon={<SaveOutlined />}>
                                Lưu thay đổi
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <div>
                        <div className="flex justify-end mb-4">
                            {member.memberStatus === 'ACTIVE' && (
                                <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                                    Sửa thông tin
                                </Button>
                            )}
                        </div>

                        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                            <Descriptions.Item label="Mã thành viên">{member.memberCode}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={member.memberStatus === 'ACTIVE' ? 'green' : (member.memberStatus === 'LOCKED' ? 'red' : 'default')}>
                                    {member.memberStatus}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Họ và tên">{member.fullname}</Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh">{member.dateOfBirth ? dayjs(member.dateOfBirth).format('DD/MM/YYYY') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{member.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Email">{member.email}</Descriptions.Item>
                            <Descriptions.Item label="Bãi xe">{member.parkingLotName}</Descriptions.Item>
                            <Descriptions.Item label="Gói đăng ký">{member.planName}</Descriptions.Item>
                            <Descriptions.Item label="Ngày tham gia">{member.membershipStartDate ? dayjs(member.membershipStartDate).format('DD/MM/YYYY') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày hết hạn">{member.membershipExpiryDate ? dayjs(member.membershipExpiryDate).format('DD/MM/YYYY') : '-'}</Descriptions.Item>

                            {member.memberStatus === 'LOCKED' && (
                                <Descriptions.Item label="Lý do khóa" span={2}>
                                    <span className="text-red-500">{member.lockReason}</span>
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        <div className="mt-6">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <CarOutlined /> Danh sách xe đăng ký
                            </h4>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                {renderVehicles(member.vehicles)}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div className="text-center text-red-500">Không tìm thấy thông tin thành viên</div>
            )}
        </Modal>
    );
};

export default MemberDetailModal;
