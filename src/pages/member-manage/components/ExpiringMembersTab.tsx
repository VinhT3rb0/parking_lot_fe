import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Table, Button, Tag, Space, message, Tooltip, Avatar } from 'antd';
import { useGetExpiringMembersQuery, useRenewMemberMutation } from '../../../api/app_member/apiMember';
import { ReloadOutlined, WarningOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';
import ExpiringMemberDetailModal from './ExpiringMemberDetailModal';

const ExpiringMembersTab: React.FC = () => {
    // Replace 'any' with your actual type if available
    const { data: expiringMembersData, isLoading, refetch } = useGetExpiringMembersQuery();
    const [renewMember] = useRenewMemberMutation();

    const [viewMember, setViewMember] = useState<any | null>(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);

    const handleRenew = async (id: number) => {
        try {
            // Assuming renew accepts just ID or minimal data for now. 
            // Adjust payload if your API requires specific plan data for renewal
            await renewMember({ id }).unwrap();
            message.success('Đã gửi yêu cầu gia hạn thành công');
            refetch();
        } catch (error) {
            console.error(error);
            message.error('Gia hạn thất bại');
        }
    };

    const columns = [
        {
            title: 'Họ và tên',
            key: 'fullname',
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2">
                    <Avatar icon={<UserOutlined />} src={record.avatar} size="small" />
                    <span className="font-medium">{record.fullname}</span>
                </div>
            )
        },
        {
            title: 'Mã thành viên',
            dataIndex: 'memberCode',
            key: 'memberCode',
            render: (text: string) => <span className="text-gray-500 font-mono text-xs">{text}</span>
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Gói hiện tại',
            key: 'plan',
            render: (_: any, record: any) => (
                <Tag color="cyan">{record.planName || 'Gói #' + record.planId}</Tag>
            )
        },
        {
            title: 'Hết hạn ngày',
            key: 'expiryDate',
            render: (_: any, record: any) => {
                const date = record.membershipExpiryDate ? new Date(record.membershipExpiryDate) : null;
                return (
                    <span className="text-red-500 font-semibold">
                        {date ? date.toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                );
            }
        },
        {
            title: 'Số xe',
            key: 'vehicles',
            render: (_: any, record: any) => (
                <Tooltip title={`${record.vehicles?.length || 0} xe đã đăng ký`}>
                    <Tag icon={<CarOutlined />}>
                        {record.vehicles?.length || 0}
                    </Tag>
                </Tooltip>
            )
        },
        {
            key: 'action',
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handleRenew(record.id);
                    }}
                >
                    Gia hạn
                </Button>
            ),
        },
    ];

    const dataSource = (expiringMembersData as any)?.data || [];

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-md border border-orange-200">
                    <WarningOutlined />
                    <span className="font-medium">Danh sách các thành viên sắp hết hạn trong 7 ngày tới</span>
                </div>
                <Button icon={<ReloadOutlined />} onClick={() => refetch()}>Làm mới</Button>
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

            <ExpiringMemberDetailModal
                visible={isViewModalVisible}
                member={viewMember}
                onClose={() => setIsViewModalVisible(false)}
                onRenew={handleRenew}
            />
        </div>
    );
};

export default ExpiringMembersTab;
