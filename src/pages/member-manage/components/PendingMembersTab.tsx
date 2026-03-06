import React, { useState } from 'react';
import { Table, Button, Tag, Space, message, Popconfirm, Modal, Input, Tooltip } from 'antd';
import PendingMemberDetailModal from './PendingMemberDetailModal';
import { useGetPendingMembersQuery, useApproveMemberMutation, useRejectMemberMutation } from '../../../api/app_member/apiMember';
import { useCreateMembershipInvoiceMutation } from '../../../api/app_invoice/apiInvoice';
import { CheckOutlined, CloseOutlined, CarOutlined } from '@ant-design/icons';

const PendingMembersTab: React.FC = () => {
    const { data: pendingMembersData, isLoading, refetch } = useGetPendingMembersQuery();
    const [approveMember] = useApproveMemberMutation();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [createInvoice] = useCreateMembershipInvoiceMutation();
    const [rejectMember] = useRejectMemberMutation();

    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const [viewMember, setViewMember] = useState<any | null>(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);

    const handleApprove = async (id: number) => {
        try {
            await approveMember(id).unwrap();
            message.success('Đã duyệt thành viên và tạo hóa đơn thành công');
            refetch();
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra khi duyệt hoặc tạo hóa đơn');
        }
    };

    const showRejectModal = (id: number) => {
        setSelectedMemberId(id);
        setRejectionReason('');
        setIsRejectModalVisible(true);
    };

    const handleRejectConfirm = async () => {
        if (!selectedMemberId) return;
        if (!rejectionReason.trim()) {
            message.error('Vui lòng nhập lý do từ chối');
            return;
        }

        try {
            await rejectMember({ id: selectedMemberId, reason: rejectionReason }).unwrap();
            message.success('Đã từ chối thành viên');
            setIsRejectModalVisible(false);
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra');
        }
    };

    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Xe đăng ký',
            key: 'vehicles',
            render: (_: any, record: any) => {
                // Handle both flat structure (legacy) and nested vehicles array
                const vehicles = record.vehicles || [];
                if (vehicles.length > 0) {
                    if (vehicles.length === 1) {
                        return (
                            <Tag icon={<CarOutlined />}>
                                {vehicles[0].licensePlate} ({vehicles[0].vehicleType})
                            </Tag>
                        );
                    }
                    return (
                        <Tooltip title={
                            <div>
                                {vehicles.map((v: any) => (
                                    <div key={v.id}>{v.licensePlate} ({v.vehicleType})</div>
                                ))}
                            </div>
                        }>
                            <Tag icon={<CarOutlined />}>
                                {vehicles[0].licensePlate} (+{vehicles.length - 1})
                            </Tag>
                        </Tooltip>
                    );
                }

                // Fallback for flat structure if API returns mixed data
                if (record.licensePlate) {
                    return (
                        <Tag icon={<CarOutlined />}>
                            {record.licensePlate} ({record.vehicleType})
                        </Tag>
                    );
                }

                return <span className="text-gray-400">Không có xe</span>;
            }
        },
        {
            title: 'Gói đăng ký',
            key: 'plan',
            render: (_: any, record: any) => (
                <Tag color="blue">{record.planName || 'Gói #' + record.planId}</Tag>
            )
        },
        {
            title: 'Bãi đỗ xe',
            dataIndex: 'parkingLotName',
            key: 'parkingLotName',
        },
        {
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Popconfirm title="Duyệt thành viên này?" onConfirm={() => handleApprove(record.id)}>
                        <Button type="primary" icon={<CheckOutlined />} className="bg-green-600">Duyệt</Button>
                    </Popconfirm>
                    <Button danger icon={<CloseOutlined />} onClick={() => showRejectModal(record.id)}>Từ chối</Button>
                </Space>
            ),
        },
    ];

    const dataSource = (pendingMembersData as any)?.data || [];

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <Button onClick={() => refetch()}>Làm mới</Button>
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={isLoading}
                onRow={(record) => ({
                    onClick: () => {
                        setViewMember(record);
                        setIsViewModalVisible(true);
                    },
                    style: { cursor: 'pointer' },
                })}
            />

            <PendingMemberDetailModal
                visible={isViewModalVisible}
                member={viewMember}
                onClose={() => setIsViewModalVisible(false)}
                onApprove={handleApprove}
                onReject={showRejectModal}
            />

            <Modal
                title="Từ chối thành viên"
                open={isRejectModalVisible}
                onOk={handleRejectConfirm}
                onCancel={() => setIsRejectModalVisible(false)}
                okText="Xác nhận từ chối"
                okButtonProps={{ danger: true }}
                cancelText="Hủy"
            >
                <p>Vui lòng nhập lý do từ chối yêu cầu thành viên này:</p>
                <Input.TextArea
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Nhập lý do..."
                />
            </Modal>
        </div>
    );
};

export default PendingMembersTab;
