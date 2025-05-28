import React, { useState } from 'react';
import { Table, DatePicker, Button, Space, Tag, message } from 'antd';
import { EmployeeShifts, useGetEmployeeShiftByEmployeeIdAndDateRangeQuery } from '../../../api/app_employee/apiEmployeeShifts';
import { useCheckInMutation, useCheckOutMutation } from '../../../api/app_employee/apiAttendance';
import dayjs from 'dayjs';
import { useGetCurrentUserQuery } from '../../../api/app_home/apiAuth';
import { getAccessTokenFromCookie } from '../../../utils/token';
import { useGetEmployeeByUserIdQuery } from '../../../api/app_employee/apiEmployee';
import AttendanceDetailsModal from './AttendanceDetailsModal';

const { RangePicker } = DatePicker;

const TimekeepingView: React.FC = () => {
    const [dateRange, setDateRange] = useState<[string, string]>([
        dayjs().startOf('week').format('YYYY-MM-DD'),
        dayjs().endOf('week').format('YYYY-MM-DD')
    ]);
    const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: currentUser } = useGetCurrentUserQuery(undefined, {
        skip: !getAccessTokenFromCookie()
    });
    const { data: employee } = useGetEmployeeByUserIdQuery(currentUser?.data?.id?.toString(), {
        skip: !currentUser?.data?.id
    });

    const { data: employeeShifts, isLoading, refetch } = useGetEmployeeShiftByEmployeeIdAndDateRangeQuery(
        {
            employeeId: employee?.id ? parseInt(employee.id) : 0,
            startDate: dateRange[0],
            endDate: dateRange[1]
        },
        {
            skip: !employee?.id
        }
    );
    const [checkIn] = useCheckInMutation();
    const [checkOut] = useCheckOutMutation();

    const handleDateRangeChange = (dates: any) => {
        if (dates) {
            setDateRange([
                dates[0].format('YYYY-MM-DD'),
                dates[1].format('YYYY-MM-DD')
            ]);
        }
    };

    const handleCheckIn = async (employeeShiftId: number) => {
        try {
            const response = await checkIn({ employeeShiftId }).unwrap();
            message.success('Vào ca thành công!');
            setSelectedAttendanceId(response.id.toString());
            setIsModalOpen(true);
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra khi vào ca!');
        }
    };

    const handleCheckOut = async (employeeShiftId: number) => {
        try {
            const response = await checkOut(employeeShiftId.toString()).unwrap();
            message.success('Ra ca thành công!');
            setSelectedAttendanceId(response.id.toString());
            setIsModalOpen(true);
            refetch();
        } catch (error) {
            message.error('Có lỗi xảy ra khi ra ca!');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAttendanceId(null);
    };

    const columns = [
        {
            title: 'Ca làm việc',
            dataIndex: 'shiftName',
            key: 'shiftName',
        },
        {
            title: 'Thời gian',
            dataIndex: 'shiftTime',
            key: 'shiftTime',
        },
        {
            title: 'Ngày làm việc',
            dataIndex: 'workDate',
            key: 'workDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Bãi xe',
            dataIndex: 'parkingLotName',
            key: 'parkingLotName',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_: any, record: EmployeeShifts) => {
                return (
                    <Tag color={
                        record.status === 'IN_PROGRESS' ? 'processing' :
                            record.status === 'COMPLETED' ? 'success' :
                                record.status === 'ABSENT' ? 'error' :
                                    record.status === 'SCHEDULED' ? 'default' :
                                        'default'
                    }>
                        {record.status === 'IN_PROGRESS' ? 'Đang làm việc' :
                            record.status === 'COMPLETED' ? 'Hoàn thành' :
                                record.status === 'ABSENT' ? 'Vắng mặt' :
                                    record.status === 'SCHEDULED' ? 'Đã lên lịch' :
                                        'Chưa xác định'}
                    </Tag>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: EmployeeShifts) => {
                if (record.status === 'SCHEDULED') {
                    return (
                        <Button
                            type="primary"
                            onClick={() => handleCheckIn(record.id)}
                        >
                            Vào ca
                        </Button>
                    );
                }
                if (record.status === 'IN_PROGRESS') {
                    return (
                        <Button
                            type="primary"
                            onClick={() => handleCheckOut(record.id)}
                        >
                            Ra ca
                        </Button>
                    );
                }
                return null;
            },
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <RangePicker
                    value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                    onChange={handleDateRangeChange}
                    format="DD/MM/YYYY"
                    placeholder={['Từ ngày', 'Đến ngày']}
                    style={{ width: 300 }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={employeeShifts}
                loading={isLoading}
                rowKey="id"
            />

            <AttendanceDetailsModal
                attendanceId={selectedAttendanceId}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default TimekeepingView;
