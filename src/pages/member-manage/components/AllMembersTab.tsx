import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Tooltip } from 'antd';
import { useGetAllMembersQuery, useLockMemberMutation, useUnlockMemberMutation } from '../../../api/app_member/apiMember';
import { EyeOutlined, LockOutlined, UnlockOutlined, CarOutlined } from '@ant-design/icons';
import MemberDetailModal from './MemberDetailModal';

const AllMembersTab: React.FC = () => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const { data: allMembersData, isLoading, refetch } = useGetAllMembersQuery({ page, size });
    const [lockMember] = useLockMemberMutation();
    const [unlockMember] = useUnlockMemberMutation();

    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        if (allMembersData) {
            const list = (allMembersData as any)?.data?.content || (allMembersData as any)?.data || [];
            // Filter out PENDING requests as they belong in Pending tab.
            // Do NOT filter by isValid:false because we want to see history (Cancelled/Locked/Expired).
            const filteredList = list.filter((member: any) => member.memberStatus !== 'PENDING' && member.status !== 'PENDING');
            setDataSource(filteredList);
        }
    }, [allMembersData]);

    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleViewDetail = (id: number) => {
        setSelectedMemberId(id);
        setIsDetailModalOpen(true);
    };

    const handleLock = async (id: number) => {
        try {
            await lockMember(id).unwrap();
            message.success('Đã khóa thành viên');
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra');
        }
    };

    const handleUnlock = async (id: number) => {
        try {
            await unlockMember(id).unwrap();
            message.success('Đã mở khóa thành viên');
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra');
        }
    };

    const columns = [
        {
            title: 'Mã TV',
            dataIndex: 'memberCode',
            key: 'memberCode',
            render: (text: string, record: any) => text || record.id
        },
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
            title: 'Xe đăng ký',
            key: 'vehicles',
            render: (_: any, record: any) => {
                const vehicles = record.vehicles || [];
                if (!vehicles.length) return <span className="text-gray-400">Không có xe</span>;
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
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_: any, record: any) => {
                const status = record.memberStatus || record.status;
                let color = 'default';
                if (status === 'ACTIVE') color = 'green';
                if (status === 'LOCKED' || status === 'CANCELLED') color = 'red';
                return <Tag color={color}>{status}</Tag>
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => {
                const status = record.memberStatus || record.status;
                return (
                    <Space size="middle">
                        <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record.id)} />
                        {status === 'LOCKED' ? (
                            <Button icon={<UnlockOutlined />} onClick={() => handleUnlock(record.id)} type="primary" ghost />
                        ) : (
                            <Button icon={<LockOutlined />} onClick={() => handleLock(record.id)} danger disabled={status === 'CANCELLED'} />
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <div>
            <div className="mb-4 flex gap-2 justify-end">
                <Button onClick={() => refetch()}>Làm mới</Button>
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={isLoading}
                pagination={{
                    current: page + 1,
                    pageSize: size,
                    total: (allMembersData as any)?.data?.totalElements || dataSource.length, // Fallback to array length if typical pagination metadata missing
                    onChange: (p, s) => {
                        setPage(p - 1);
                        setSize(s);
                    }
                }}
            />

            <MemberDetailModal
                open={isDetailModalOpen}
                memberId={selectedMemberId}
                onCancel={() => setIsDetailModalOpen(false)}
                onSuccess={() => {
                    // Refresh list if needed (though refetch is called inside modal success usually, or we trigger it here)
                    refetch();
                }}
            />
        </div>
    );
};

export default AllMembersTab;
