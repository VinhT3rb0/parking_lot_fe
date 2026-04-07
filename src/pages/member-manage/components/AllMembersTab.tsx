import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Tooltip, Modal, Input } from 'antd';
import { useGetAllMembersQuery, useLockMemberMutation, useUnlockMemberMutation, useLazySearchMembersQuery, useRenewMemberMutation } from '../../../api/app_member/apiMember';
import { EyeOutlined, LockOutlined, UnlockOutlined, CarOutlined, ReloadOutlined } from '@ant-design/icons';
import MemberDetailModal from './MemberDetailModal';

const AllMembersTab: React.FC = () => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const { data: allMembersData, isLoading, refetch } = useGetAllMembersQuery({ page, size });
    const [lockMember] = useLockMemberMutation();
    const [unlockMember] = useUnlockMemberMutation();
    const [renewMember] = useRenewMemberMutation();

    const [triggerSearch, { isFetching: isFetchingSearch }] = useLazySearchMembersQuery();

    const [dataSource, setDataSource] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!isSearching && allMembersData) {
            const list = (allMembersData as any)?.data?.content || (allMembersData as any)?.data || [];
            const filteredList = list.filter((member: any) => member.memberStatus !== 'PENDING' && member.status !== 'PENDING');
            setDataSource(filteredList);
        }
    }, [allMembersData, isSearching]);

    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        try {
            const isNumeric = /^\d+$/.test(value);
            const searchParams: any = { page: 0, size: 50 };

            if (isNumeric) {
                searchParams.phoneNumber = value;
            } else {
                searchParams.keyword = value;
            }

            const result = await triggerSearch(searchParams).unwrap();
            const list = (result as any)?.data?.content || (result as any)?.data || [];
            const filteredList = list.filter((member: any) => member.memberStatus !== 'PENDING' && member.status !== 'PENDING');
            setDataSource(filteredList);
        } catch (error) {
            console.error('Search failed', error);
            message.error('Tìm kiếm thất bại');
            setDataSource([]);
        }
    };

    const handleRefresh = () => {
        setIsSearching(false);
        refetch();
    };

    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Lock Modal State
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [lockReason, setLockReason] = useState('');
    const [selectedLockMemberId, setSelectedLockMemberId] = useState<number | null>(null);

    const handleViewDetail = (id: number) => {
        setSelectedMemberId(id);
        setIsDetailModalOpen(true);
    };

    const handleLock = (id: number) => {
        setSelectedLockMemberId(id);
        setLockReason('');
        setIsLockModalOpen(true);
    };

    const confirmLock = async () => {
        if (!selectedLockMemberId) return;
        if (!lockReason.trim()) {
            message.error('Vui lòng nhập lý do khóa!');
            return;
        }
        try {
            await lockMember({ id: selectedLockMemberId, lockReason: lockReason }).unwrap();
            message.success('Đã khóa thành viên');
            setIsLockModalOpen(false);
            setLockReason('');
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

    const handleRenew = async (record: any) => {
        try {
            const requestBody = {
                planId: record.planId || 0,
                note: "Gia hạn theo yêu cầu khách hàng"
            };
            await renewMember({ id: record.id, data: requestBody }).unwrap();
            message.success('Gia hạn thành công!');
            refetch();
        } catch (error) {
            message.error('Gia hạn thất bại');
        }
    };

    const columns: any = [
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
                        {status === 'EXPIRED' && (
                            <Tooltip title="Gia hạn">
                                <Button icon={<ReloadOutlined />} onClick={() => handleRenew(record)} type="primary" />
                            </Tooltip>
                        )}
                        {status === 'LOCKED' ? (
                            <Button icon={<UnlockOutlined />} onClick={() => handleUnlock(record.id)} type="primary" ghost />
                        ) : (
                            <Button icon={<LockOutlined />} onClick={() => handleLock(record.id)} danger disabled={status === 'CANCELLED' || status === 'EXPIRED'} />
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <div>
            <div className="mb-4 flex gap-4 justify-between items-center">
                <div className="w-1/2">
                    <Input.Search
                        placeholder="Tìm kiếm theo SĐT, biển số xe, tên..."
                        allowClear
                        enterButton="Tìm kiếm"
                        onSearch={handleSearch}
                        loading={isFetchingSearch}
                    />
                </div>
                <Button onClick={handleRefresh}>Làm mới</Button>
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={isLoading || isFetchingSearch}
                pagination={{
                    current: page + 1,
                    pageSize: size,
                    total: isSearching ? dataSource.length : (allMembersData as any)?.data?.totalElements || dataSource.length,
                    onChange: (p, s) => {
                        if (!isSearching) {
                            setPage(p - 1);
                            setSize(s);
                        }
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

            <Modal
                title="Khóa thành viên"
                open={isLockModalOpen}
                onOk={confirmLock}
                onCancel={() => {
                    setIsLockModalOpen(false);
                    setLockReason('');
                }}
                okText="Khóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p className="mb-2">Vui lòng nhập lý do khóa thành viên này:</p>
                <Input.TextArea
                    rows={4}
                    value={lockReason}
                    onChange={(e) => setLockReason(e.target.value)}
                    placeholder="Nhập lý do..."
                />
            </Modal>
        </div>
    );
};

export default AllMembersTab;
